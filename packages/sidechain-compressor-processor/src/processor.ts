type SidechainCompressorParameterKeys = typeof SidechainCompressorProcessor.parameterDescriptors[number]["name"]
type ParameterRecord = Record<SidechainCompressorParameterKeys, Float32Array>

/**
 * An example of AudioWorkletProcessor that uses RingBuffer inside. If your
 * audio processing function uses the buffer size other than 128 frames, using
 * RingBuffer can be a solution.
 *
 * @class SidechainCompressorProcessor
 * @extends AudioWorkletProcessor
 */
class SidechainCompressorProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors(): readonly AudioParamDescriptor[] {
        return  [
            {
                name: 'threshold',
                defaultValue: -28,
                minValue: -128,
                maxValue: 0,
                automationRate: 'k-rate'
            },
            {
                name: 'ratio',
                defaultValue: 4,
                minValue: 1,
                maxValue: 128,
                automationRate: 'k-rate'
            },
            {
                name: "attack",
                defaultValue: 0.005,
                minValue: 0.0001,
                maxValue: 128,
                automationRate: 'k-rate'
            },
            {
                name: "release",
                defaultValue: 0.005,
                minValue: 0.0001,
                maxValue: 128,
                automationRate: 'k-rate'
            },
            {
                name: "mix",
                defaultValue: 1,
                minValue: 0,
                maxValue: 1,
                automationRate: 'k-rate'
            },
            {
                name: "makeupGain",
                defaultValue: 0,
                minValue: -128,
                maxValue: 60,
                automationRate: 'k-rate'
            },
        ] as const
    }
    /**
	 * @constructor
	 * @param {Object} options AudioWorkletNodeOptions object passed from the
	 * AudioWorkletNode constructor.
	 */
    constructor(options?: AudioWorkletNodeOptions) {
        super(options)
        this.sampleRate = options?.processorOptions?.sampleRate || 48000
        this.port.addEventListener("message", () => console.log("processor message listener"))

        this.port.onmessage = (messageEvent: MessageEvent<any>) => {
            const data = messageEvent.data
            switch (data) {
                case "sidechain-on": this.useSidechain = true
                    break
                case "sidechain-off": this.useSidechain = false
                    break
                case "bypass-on": this.isBypassed = true
                    break
                case "bypass-off": this.isBypassed = false
                    break
                case "logging-on": this.useLogging = true
                    break
                case "logging-off": this.useLogging = false
                    break
                default:
                    break
            }
            if (this.useLogging) {
                console.debug("[compressor message] data", messageEvent.data)
                console.debug("[compressor message] ports", messageEvent.ports)
                console.debug("[compressor message] target", messageEvent.target)
                console.debug("[compressor message] origin", messageEvent.origin)
                console.debug("[compressor message] type", messageEvent.type)
            }
        }
        this.port.postMessage('initialized')
    }

    sampleRate = 48000
    firstTime = true
    useSidechain = true
    useLogging = false
    isBypassed = false

    /**
	 * System-invoked process callback function.
	 * @param  {Array} inputs Incoming audio stream.
	 * @param  {Array} outputs Outgoing audio stream.
	 * @param  {Record<string, Float32Array>} parameters data.
	 * @return {Boolean} Active source flag.
	 */
    override process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: ParameterRecord): boolean {
        try {
            if (this.firstTime) {
                console.log("[processor]", "inputs", inputs.length, "outputs", outputs.length, "input", inputs[0].length, "output", outputs[0].length)
                this.firstTime = false
            }
            if (this.isBypassed) {
                for (const [ib, inBus] of inputs.entries()) {
                    for (const [ic, inChannel] of inBus.entries()) {
                        outputs[ib][ic].set(inChannel)
                    }
                }
                return true
            }
            this.threshold = parameters.threshold[0]
            this.ratio = parameters.ratio[0]
            this.release_time = parameters.release[0]
            this.attack_time = parameters.attack[0]
            this.makeupGain = parameters.makeupGain[0]
            const mix = parameters.mix[0]

            const input = inputs[0]
            const output = outputs[0]

            const isSidechainConnected = inputs[1].length === inputs[0].length
            const useSidechain = isSidechainConnected && this.useSidechain
            const sidechainInput = useSidechain ? 1 : 0

            for (let i = 0; i < input[0].length; ++i) {
                const sidechainMono = 0.5 * (inputs[sidechainInput][0][i] + inputs[sidechainInput][1][i])
                this.update(sidechainMono)
                const inputL = input[0][i]
                const inputR = input[1][i]
                const compressedL = inputL * this.gain_linear
                const compressedR = inputR * this.gain_linear
                output[0][i] = inputL * (1 - mix) + compressedL * mix
                output[1][i] = inputR * (1 - mix) + compressedR * mix
            }
        }
        catch (e) {
            this.useLogging && console.debug(e)
        }
        return true
    }

    ratio = 12.0
    threshold = -30.0
    attack_time = 0.005
    release_time = 0.4

    // Initializing Params
    wav_pow = 0
    instantPower = 0
    inputGain = 1.0
    makeupGain = 1.0

    // signal

    comp_ratio_const = 1.0 - (1.0 / this.ratio)

    attack_const = Math.exp(-1.0 / (this.attack_time * this.sampleRate))
    release_const = Math.exp(-1.0 / (this.release_time * this.sampleRate))
    level_lp_const = Math.exp(-1.0 / (this.attack_time * this.sampleRate))

    prev_level_lp_pow = 1.0E-6
    level_dB = 0.0
    above_threshold_dB = 0.0
    instant_target_gain_dB = 1.0
    gain_linear = 1.0
    prev_gain_dB = 0.0
    gain_dB = 0.0

    one_minus_attack_const = 1 - this.attack_const
    one_minus_release_const = 1 - this.release_const

    c1 = 0
    c2 = 0

    update(signal: number) {
        this.attack_const = Math.exp(-1.0 / (this.attack_time * this.sampleRate))
        this.release_const = Math.exp(-1.0 / (this.release_time * this.sampleRate))
        this.level_lp_const = Math.exp(-1.0 / (this.attack_time * this.sampleRate))
        this.one_minus_attack_const = 1 - this.attack_const
        this.one_minus_release_const = 1 - this.release_const
        this.comp_ratio_const = 1.0 - (1.0 / this.ratio)



        this.c1 = this.level_lp_const
        this.c2 = 1.0 - this.c1

        this.wav_pow = this.c1 * this.prev_level_lp_pow + this.c2 * signal * signal
        this.prev_level_lp_pow = Math.max(this.wav_pow, 1.0E-6)
        this.level_dB = Math.log10(this.wav_pow) * 10

        this.above_threshold_dB = this.level_dB - this.threshold
        this.instant_target_gain_dB = Math.min(this.above_threshold_dB / this.ratio - this.above_threshold_dB, 0)
        this.gain_dB = this.instant_target_gain_dB

        if (this.gain_dB < this.prev_gain_dB){
            this.gain_dB = this.attack_const * this.prev_gain_dB + this.one_minus_attack_const * this.gain_dB
        }
        else {
            this.gain_dB = this.release_const * this.prev_gain_dB + this.one_minus_release_const * this.gain_dB
        }

        this.prev_gain_dB = this.gain_dB
        this.gain_linear = Math.pow(10.0, (this.gain_dB + this.makeupGain) / 20.0)
    }
}

registerProcessor("SidechainCompressorProcessor", SidechainCompressorProcessor)

type PassThroughParameterKeys = typeof PassThroughProcessor.parameterDescriptors[number]["name"]
type ParameterRecord = Record<PassThroughParameterKeys, Float32Array>

/**
 * An example of AudioWorkletProcessor that uses RingBuffer inside. If your
 * audio processing function uses the buffer size other than 128 frames, using
 * RingBuffer can be a solution.
 *
 * @class PassThroughProcessor
 * @extends AudioWorkletProcessor
 */
class PassThroughProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors(): readonly AudioParamDescriptor[] {
    return [] as const
  }
  /**
	 * @constructor
	 * @param {Object} options AudioWorkletNodeOptions object passed from the
	 * AudioWorkletNode constructor.
	 */
  constructor(options?: AudioWorkletNodeOptions) {
    super(options)
    this.port.addEventListener("message", () => console.log("processor message listener"))
    this.port.onmessage = (messageEvent: MessageEvent<any>) => {
      if (messageEvent.data === "enable-logging") {
        this.useLogging = true
      }
      else if (messageEvent.data === "disable-logging") {
        this.useLogging = false
      }
      console.debug("[compressor message] data", messageEvent.data)
      console.debug("[compressor message] ports", messageEvent.ports)
      console.debug("[compressor message] target", messageEvent.target)
      console.debug("[compressor message] origin", messageEvent.origin)
      console.debug("[compressor message] type", messageEvent.type)
    }
    this.port.postMessage('initialized')
  }

  firstTime = true
  useLogging = false

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
      for (const [ib, inBus] of inputs.entries()) {
        for (const [ic, inChannel] of inBus.entries()) {
          outputs[ib][ic].set(inChannel)
        }
      }
    }
    catch (e) {
      this.useLogging && console.debug(e)
    }
    return true
  }
}

registerProcessor("PassThroughProcessor", PassThroughProcessor)

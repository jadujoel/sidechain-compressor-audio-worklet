import { getProcessorsForContext } from './processor'
import { ContextGlobalScope, Realm } from './realm'
import { IProcessor, mAudioWorkletNode } from './types'

const PROCESS_PARAMS: Float32Array[] = []
let nextPort: MessagePort | null

// We cannot make class here since we need to return the scriptprocessor itself, with some overriden properties.
export function mAudioWorkletNode(context: BaseAudioContext, name: string, options?: AudioWorkletNodeOptions) {
    const processor = getProcessorsForContext(context)[name]
    const outputChannels = (options && options.outputChannelCount) ? options.outputChannelCount[0] : 2
    const me = context.createScriptProcessor(undefined, 2, outputChannels) as unknown as mAudioWorkletNode

    me.parameters = new Map<string, AudioParam>()
    if (processor.properties) {
        for (const prop of processor.properties) {
            const audioParam = context.createGain().gain
            if (prop.defaultValue !== undefined) {
                audioParam.value = prop.defaultValue
            }
            // @TODO there's no good way to construct the proxy AudioParam here
            me.parameters.set(prop.name, audioParam)
        }
    }

    const messageChannel = new MessageChannel()
    nextPort = messageChannel.port2

    const instance = new (processor.Processor as typeof AudioWorkletProcessor)(options || {})
    nextPort = null

    me.port = messageChannel.port1
    me.processor = processor
    me.instance = instance
    me.onaudioprocess = onAudioProcess
    return me

    function onAudioProcess (this: mAudioWorkletNode, params: { inputBuffer: AudioBuffer, outputBuffer: AudioBuffer}) {
        const parameters: Record<string, Float32Array> = {}
        let index = -1
        this.parameters?.forEach((value: AudioParam, key: string) => {
            const arr = PROCESS_PARAMS[++index] || (PROCESS_PARAMS[index] = new Float32Array(this.bufferSize))
            // @TODO proper values here if possible
            arr.fill(value.value)
            parameters[key] = arr
        })
        this.processor?.realm.exec(
            'self.sampleRate=sampleRate=' + this.context.sampleRate + ';'
            + 'self.currentTime=currentTime=' + this.context.currentTime
        )
        const inputs = channelToArray(params.inputBuffer)
        const outputs = channelToArray(params.outputBuffer)
        this.instance?.process([inputs], [outputs], parameters)

        // @todo - keepalive
        // let ret = this.instance.process([inputs], [outputs], parameters);
        // if (ret === true) { }

        function channelToArray (ch: AudioBuffer) {
            const out = []
            for (let i = 0; i < ch.numberOfChannels; i++) {
                out[i] = ch.getChannelData(i)
            }
            return out
        }
    }
}

export class mAudioWorklet implements mAudioWorklet {
    #context: AudioContext
    constructor (audioContext?: AudioContext) {
        this.#context = audioContext || new AudioContext()
    }

    async addModule(url: string | URL, options?: WorkletOptions & { transpile?: (v: string) => void }) {
        const response = await fetch(url)
        if (!response.ok) {
            throw Error(`${response.status}`)
        }
        const code = response.text()

        class mAudioWorkletProcessor  {
            port: MessagePort | null
            constructor(options?: AudioWorkletNodeOptions) {
                this.port = nextPort
            }
        }

        const audioContextScope: ContextGlobalScope = {
            sampleRate: this.#context.sampleRate,
            currentTime: this.#context.currentTime,
            AudioWorkletProcessor: mAudioWorkletProcessor as any,
            // AudioWorkletProcessor(this: AudioWorkletProcessor) {
            // so we can override non-writable property
            // (this as any).port = nextPort
            // },
            registerProcessor: (name: string, Processor: AudioWorkletProcessor) => {
                const processors = getProcessorsForContext(this.#context)
                const processor: IProcessor = {
                    realm,
                    context: audioContextScope,
                    Processor,
                    properties: Processor.parameterDescriptors || []
                }
                processors[name] = processor
            }
        }
        audioContextScope.self = audioContextScope
        const realm = new Realm(audioContextScope, document.documentElement)
        realm.exec(((options && options.transpile) || String)(await code))
    }
}

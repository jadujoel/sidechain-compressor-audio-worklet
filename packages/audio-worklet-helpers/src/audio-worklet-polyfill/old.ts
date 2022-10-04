import { ContextGlobalScope, Realm } from './realm'

type AudioWorkletNodeScriptProcessor = {
    properties?: AudioParamDescriptor[]
    parameters?: Map<string, AudioParam>
    port?: MessagePort
    onaudioprocess: (this: AudioWorkletNodeScriptProcessor, params: {
        inputBuffer: AudioBuffer;
        outputBuffer: AudioBuffer;
    }) => void
    processor?: IProcessor
    process: AudioWorkletProcessor['process']
    instance?: AudioWorkletProcessor
    bufferSize: number
    context: ContextGlobalScope
} & AudioWorkletProcessor


interface IProcessor {
    realm: Realm;
    context: ContextGlobalScope;
    Processor: AudioWorkletProcessor | typeof AudioWorkletProcessor;
    properties: readonly AudioParamDescriptor[];
}
export const audioWorkletPolyfill = (force = false) => {
    const PARAMS: Float32Array[] = []
    let nextPort: MessagePort | null
    if (typeof AudioWorkletNode !== "function" || !("audioWorklet" in AudioContext.prototype) || force) {
        (self.AudioWorkletNode as any) = function AudioWorkletNode(context: BaseAudioContext, name: string, options?: AudioWorkletNodeOptions) {
            const processor = getProcessorsForContext(context)[name]
            const outputChannels = (options && options.outputChannelCount) ? options.outputChannelCount[0] : 2
            const scriptProcessor = context.createScriptProcessor(undefined, 2, outputChannels) as unknown as AudioWorkletNodeScriptProcessor

            scriptProcessor.parameters = new Map()
            if (processor.properties) {
                for (const prop of processor.properties) {
                    const node = context.createGain().gain
                    if (prop.defaultValue !== undefined) {
                        node.value = prop.defaultValue
                    }
                    // @TODO there's no good way to construct the proxy AudioParam here
                    scriptProcessor.parameters.set(prop.name, node)
                }
            }

            const mc = new MessageChannel()
            nextPort = mc.port2
            const instance = new (processor.Processor as typeof AudioWorkletProcessor)(options || {})
            nextPort = null

            scriptProcessor.port = mc.port1
            scriptProcessor.processor = processor
            scriptProcessor.instance = instance
            scriptProcessor.onaudioprocess = onAudioProcess
            return scriptProcessor
        }
        const prototype = (self.AudioContext || (self as Window & typeof globalThis & { webkitAudioContext: AudioContext }).webkitAudioContext).prototype
        Object.defineProperty(prototype, 'audioWorklet', {
            get() {
                return this.$$audioWorklet || (this.$$audioWorklet = new (self.AudioWorklet as any)(this))
            }
        })

        self.AudioWorklet = class AudioWorklet {
            $$context: AudioContext
            constructor (audioContext?: AudioContext) {
                this.$$context = audioContext || new AudioContext()
            }

            addModule(url: string | URL, options?: WorkletOptions & { transpile?: (v: string) => void }) {
                return fetch(url)
                    .then(r => {
                        if (!r.ok) throw Error(`${r.status}`)
                        return r.text()
                    })
                    .then(code => {
                        const context: ContextGlobalScope = {
                            sampleRate: this.$$context.sampleRate,
                            currentTime: this.$$context.currentTime,
                            AudioWorkletProcessor (this: any) {
                                this.port = nextPort
                            },
                            registerProcessor: (name: string, Processor: AudioWorkletProcessor) => {
                                const processors = getProcessorsForContext(this.$$context)
                                const p = {
                                    realm,
                                    context,
                                    Processor,
                                    properties: Processor.parameterDescriptors || []
                                }
                                processors[name] = p
                            }
                        }
                        context.self = context
                        const realm = new Realm(context, document.documentElement)
                        realm.exec(((options && options.transpile) || String)(code))
                        return void 0
                    })
            }
        }
    }

    function onAudioProcess (this: AudioWorkletNodeScriptProcessor, params: { inputBuffer: AudioBuffer, outputBuffer: AudioBuffer}) {
        const parameters: Record<string, Float32Array> = {}
        let index = -1
        this.parameters?.forEach((value: AudioParam, key: string) => {
            const arr = PARAMS[++index] || (PARAMS[index] = new Float32Array(this.bufferSize))
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
    }

    function channelToArray (ch: AudioBuffer) {
        const out = []
        for (let i = 0; i < ch.numberOfChannels; i++) {
            out[i] = ch.getChannelData(i)
        }
        return out
    }

    function getProcessorsForContext(audioContext: BaseAudioContext & {$$processors?: Record<string, IProcessor>}): Record<string, IProcessor> {
        return audioContext.$$processors || (audioContext.$$processors = {})
    }
}

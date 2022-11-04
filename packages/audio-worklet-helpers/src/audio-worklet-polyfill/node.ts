import { getProcessorsForContext } from "./get-processors-for-context"
import { mAudioWorkletNode } from "./types"

const PROCESS_PARAMS: Float32Array[] = []
let nextPort: MessagePort | null

export class AudioWorkletProcessorPolyfill  {
  port: MessagePort | null
  constructor(options?: AudioWorkletNodeOptions) {
    this.port = nextPort
  }
}

const scriptPrototype = ScriptProcessorNode.prototype as typeof ScriptProcessorNode.prototype & { $connect: typeof ScriptProcessorNode.prototype.connect }
scriptPrototype.$connect = scriptPrototype.connect
function connect(this: typeof scriptPrototype, destination: AudioNode,  output?: number | undefined, input?: number | undefined) {
  console.log("[ScriptProcessorNode]: connect", {this: this, output, input})
  return this.$connect(destination, output, input)
}
scriptPrototype.connect = connect as typeof scriptPrototype.connect


function isAudioWorkletNodePolyfill(thing: Record<string, any>): thing is mAudioWorkletNode {
  return "isAudioWorkletNodePolyfill" in thing && thing.isAudioWorkletNodePolyfill === true
}

function isAudioWorkletNodePolyfillInputProcessor(thing: Record<string, any>) {
  return "AWNPI" in thing && thing.AWNPI === true
}

const audioPrototype = AudioNode.prototype as typeof AudioNode.prototype & { $connect: typeof AudioNode.prototype.connect }
audioPrototype.$connect = audioPrototype.connect
function connectAudioNode(this: typeof audioPrototype, destination: AudioNode,  output?: number | undefined, input?: number | undefined) {
  console.log("[AudioNode]: connect", {this: this, destination, output, input})
  if (isAudioWorkletNodePolyfill(destination) && !isAudioWorkletNodePolyfillInputProcessor(destination)) {
    console.debug("[AudioNode]: connecting to polyfilled audioworklet-script-processor!")
    this.$connect(destination.inputProcessors[input ?? 0], output, 0)
    return destination
  }
  return this.$connect(destination, output, input)
}
audioPrototype.connect = connectAudioNode as typeof audioPrototype.connect



export class AudioWorkletNodePolyfill {
  constructor(context: BaseAudioContext, name: string, options?: AudioWorkletNodeOptions) {
    const processor = getProcessorsForContext(context)[name]
    const outputChannels = (options && options.outputChannelCount) ? options.outputChannelCount[0] : 2

    const me = context.createScriptProcessor(1024, 2, outputChannels) as unknown as mAudioWorkletNode
    // const channelMerger = context.createChannelMerger(2)
    // me.channelMerger = channelMerger
    // me.channelMerger.connect(me as any)
    me.inputBuffers = [
      context.createBuffer(2, 1024, context.sampleRate),
      context.createBuffer(2, 1024, context.sampleRate),
    ]

    me.isAudioWorkletNodePolyfill = true
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
    me.onaudioprocess = onaudioprocess

    me.inputProcessors = [
      context.createScriptProcessor(1024, 2, 1),
      context.createScriptProcessor(1024, 2, 1)
    ]

    for (let i = 0; i < 2; ++i) {
      const proc = me.inputProcessors[i];
      (proc as any).AWNPI = true;
      proc.onaudioprocess = (ev: AudioProcessingEvent) => {
        me.inputBuffers[i] = ev.inputBuffer
      }
      proc.connect(me as unknown as ScriptProcessorNode)
    }

    return me

    function onaudioprocess (this: mAudioWorkletNode, params: { inputBuffer: AudioBuffer, outputBuffer: AudioBuffer}) {
      if (!this.processor) {
        return
      }
      const parameters: Record<string, Float32Array> = {}
      let index = -1
      this.parameters?.forEach((value: AudioParam, key: string) => {
        const arr = PROCESS_PARAMS[++index] || (PROCESS_PARAMS[index] = new Float32Array(this.bufferSize))
        // @TODO proper values here if possible
        arr.fill(value.value)
        parameters[key] = arr
      })
      this.processor.realm.exec(
        'self.sampleRate=sampleRate=' + this.context.sampleRate + ';'
        + 'self.currentTime=currentTime=' + this.context.currentTime
      )
      // const inputs = channelToArray(params.inputBuffer)
      const input0 = channelToArray(this.inputBuffers[0])
      const input1 = channelToArray(this.inputBuffers[1])
      // const input1 = inputs.slice(2, 4)
      const outputs = channelToArray(params.outputBuffer)
      this.instance?.process([input0, input1], [outputs], parameters)

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
}

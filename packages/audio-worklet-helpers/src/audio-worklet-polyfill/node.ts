import { getProcessorsForContext } from "./get-processors-for-context"
import { mAudioWorkletNode } from "./types"

const PROCESS_PARAMS: Float32Array[] = []
let nextPort: MessagePort | null

export class mAudioWorkletProcessor  {
  port: MessagePort | null
  constructor(options?: AudioWorkletNodeOptions) {
    this.port = nextPort
  }
}

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
    if (!this.processor) {
      return
    }
    this.processor.realm.exec(
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

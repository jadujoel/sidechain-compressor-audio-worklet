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
function isAudioWorkletNodePolyfill(thing: Record<string, any>): thing is mAudioWorkletNode {
  return "isAudioWorkletNodePolyfill" in thing && thing.isAudioWorkletNodePolyfill === true
}

function overrideConnectScriptProcessor() {
  const prototype = ScriptProcessorNode.prototype as typeof ScriptProcessorNode.prototype & { $connect: typeof ScriptProcessorNode.prototype.connect }
  prototype.$connect = prototype.connect
  function connect(this: typeof prototype, destination: AudioNode,  output?: number | undefined, input?: number | undefined) {
    console.log("[ScriptProcessorNode]: connect", {this: this, output, input})
    if (isAudioWorkletNodePolyfill(this)) {
      return this._outputNodes[output || 0].connect(destination, 0, input)
    }
    return this.$connect(destination, output, input)
  }
  prototype.connect = connect as typeof prototype.connect
}

/** ScriptProcessorNode can only have one input, which is why we-ve added multiple as inputs to this polyfill
 * so now all nodes needs to know how to connect to the correct inpt
 */
function overrideConnectAudioNode() {
  const prototype = AudioNode.prototype as typeof AudioNode.prototype & { $connect: typeof AudioNode.prototype.connect }
  prototype.$connect = prototype.connect

  prototype.connect = function connectAudioNode(this: typeof prototype, destination: AudioNode,  output?: number | undefined, input?: number | undefined) {
    if (isAudioWorkletNodePolyfill(destination)) {
      this.$connect(destination.inputNodes[input ?? 0], output, 0)
      return destination
    }
    return this.$connect(destination, output, input)
  } as typeof prototype.connect
}

overrideConnectScriptProcessor()
overrideConnectAudioNode()

const vname = "[AudioWorkletNodePolyfill]:"
export class AudioWorkletNodePolyfill {
  constructor(context: BaseAudioContext, name: string, options?: AudioWorkletNodeOptions) {
    const processor = getProcessorsForContext(context)[name]
    const numberOfInputs = options?.numberOfInputs ?? 1
    const numberOfOutputs = options?.numberOfOutputs ?? options?.outputChannelCount?.length ?? 1
    const channelCount = options?.channelCount ?? 2
    const outputChannels = options?.outputChannelCount ? options.outputChannelCount[0] : channelCount
    const outputChannelCount = options?.outputChannelCount ?? new Array<number>(numberOfOutputs).fill(outputChannels)
    const bufferSize = 1024 as const
    console.debug(vname, {options, channelCount, outputChannels, numberOfInputs, numberOfOutputs, outputChannelCount, bufferSize})

    const me = context.createScriptProcessor(bufferSize, channelCount, outputChannels) as unknown as mAudioWorkletNode
    me._numberOfInputs = numberOfInputs
    me._numberOfOutputs = numberOfOutputs
    me._outputChannelCount = outputChannelCount
    me._channelCount = channelCount

    me.isAudioWorkletNodePolyfill = true
    me.parameters = new Map<string, AudioParam>()
    if (processor.properties) {
      for (const prop of processor.properties) {
        const audioParam = context.createGain().gain
        audioParam.value = prop.defaultValue ?? audioParam.value
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

    const createInputs = () => {
      const nodes: ScriptProcessorNode[] = new Array(numberOfInputs)
      const buffers: AudioBuffer[] = new Array(numberOfInputs)
      for (let i = 0; i < numberOfInputs; ++i) {
        buffers[i] = context.createBuffer(channelCount, bufferSize, context.sampleRate)
        const node = context.createScriptProcessor(bufferSize, channelCount, channelCount);
        node.onaudioprocess = ev => me.inputBuffers[i] = ev.inputBuffer;
        (node as any).$connect(me)
        nodes[i] = node
      }
      me.inputNodes = nodes
      me.inputBuffers = buffers
    }
    createInputs()

    const createOutputs = () => {
      const outputs = new Array<Float32Array[]>(numberOfOutputs)
      for (const [i, numChannels] of outputChannelCount.entries()) {
        outputs[i] =
          new Array<Float32Array>(numChannels)
          .fill(new Float32Array(bufferSize).fill(0))
      }
      me._outputs = outputs

      const nodes: ScriptProcessorNode[] = new Array(numberOfOutputs)
      for (let i = 0; i < numberOfOutputs; ++i) {
        const node = context.createScriptProcessor(bufferSize, 1, outputChannelCount[i]);
        node.onaudioprocess = ev => {
          for (let ch = 0; ch < outputChannelCount[i]; ++ch) {
            const channelData = ev.outputBuffer.getChannelData(ch)
            for (let sample = 0; sample < channelData.length; ++ sample) {
              channelData[sample] = me._outputs[i][ch][sample]
            }
          }
        }
        me.$connect(node, 0, 0)
        nodes[i] = node
      }
      me._outputNodes = nodes
    }
    createOutputs()
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
      const inputs: Float32Array[][] = new Array(this._numberOfInputs)
      for (let i = 0; i < this._numberOfInputs; ++i) {
        inputs[i] = bufferToArray(this.inputBuffers[i])
      }

      this.instance?.process(inputs, this._outputs as any, parameters)

      function bufferToArray (buffer: AudioBuffer) {
        const output = new Array<Float32Array>(buffer.numberOfChannels)
        for (let i = 0; i < buffer.numberOfChannels; i++) {
          output[i] = buffer.getChannelData(i)
        }
        return output
      }
    }
  }
}

import { getProcessorsForContext } from "../get-processors-for-context"
import { IProcessor } from "../types"

const PROCESS_PARAMS: Float32Array[] = []
let nextPort: MessagePort | null

export class AudioWorkletProcessorPolyfill  {
  port: MessagePort | null
  constructor(options?: AudioWorkletNodeOptions) {
    console.debug("[mAudioWorkletProcessor]: constructor")
    this.port = nextPort
  }
}


const vname = "[AudioWorkletNodePolyfill]:"

type Me = ScriptProcessorNode & {
  parameters: Map<string, AudioParam>,
  process: AudioWorkletProcessor['process'],
  instance: AudioWorkletProcessor,
  processor: IProcessor,
  port: MessagePort,
  onaudioprocess: AudioWorkletNodePolyfill['onaudioprocess'],
  onprocessorerror: AudioWorkletNode['onprocessorerror'],
}

let numberOfTimesProcessed = 0

// const AudioWorkletNode = window.AudioWorkletNode ?? class AudioWorkletNode {}
// const AudioNode = window.AudioNode ?? class AudioNode {}

// class AudioNode {
//   constructor(context: BaseAudioContext) {
//     const node = context.createGain()
//     return node
//   }
// }

export class AudioWorkletNodePolyfill implements AudioNode, Me {
  // onprocessorerror: ((this: AudioWorkletNode, ev: Event) => any) | null
  onprocessorerror(ev: Event) {
    console.debug(ev)
  }

  connect(destination: AudioParam | AudioNode, output?: number, input?: number): AudioNode {
    console.debug(vname, "connect", destination, output, input)
    return this.me.connect(destination as AudioNode, output, input)
  }
  disconnect(destination?: AudioParam | AudioNode | number, output?: number, input?: number): void {
    console.debug(vname, "disconnect", destination, output, input)
    return this.me.disconnect(destination as AudioNode, output as any, input as any)
  }

  // static onprocessorerror() {
  //   console.debug("onprocessorerror")
  // }
  addEventListener<K extends "audioprocess">(type: K, listener: (this: ScriptProcessorNode, ev: ScriptProcessorNodeEventMap[K]) => any, options?: boolean | AddEventListenerOptions | undefined): void
  addEventListener<K extends "processorerror">(type: K, listener: (this: AudioWorkletNode, ev: AudioWorkletNodeEventMap[K]) => any, options?: boolean | AddEventListenerOptions | undefined): void
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined): void
  addEventListener(type: unknown, listener: unknown, options?: unknown): void {
    console.debug(vname, "addEventListener", {type, listener, options})
    return this.me.addEventListener(type as any, listener as any, options as any)
  }

  removeEventListener<K extends "audioprocess">(type: K, listener: (this: ScriptProcessorNode, ev: ScriptProcessorNodeEventMap[K]) => any, options?: boolean | EventListenerOptions | undefined): void
  removeEventListener<K extends "processorerror">(type: K, listener: (this: AudioWorkletNode, ev: AudioWorkletNodeEventMap[K]) => any, options?: boolean | EventListenerOptions | undefined): void
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions | undefined): void {
    console.debug(vname, "removeEventListener", {type, listener, options})
    return this.me.removeEventListener(type, listener, options)
  }
  dispatchEvent(event: Event): boolean
  dispatchEvent(event: Event): boolean {
    console.debug(vname, "dispatchEvent", {event})
    return this.me.dispatchEvent(event)
  }

  process(inputs: ProcessInputs, outputs: Float32Array[][], parameters: ProcessParameters): boolean {
    console.debug(vname, "process", {inputs, outputs, parameters})
    const bound = () => this.me.process(inputs, outputs, parameters)
    return bound()
  }

  me: Me

  get bufferSize() {
    console.debug(vname, "get bufferSize")
    return this.me.bufferSize
  }

  get context() {
    console.debug(vname, "get context")
    return this.me.context
  }

  set port(newPort) {
    console.debug(vname, "set port");
    this.me.port = newPort
  }

  get port() {
    console.debug(vname, "get port")
    return this.me.port
  }

  get properties() {
    console.debug(vname, "get properties")
    return this.me.processor.properties

  }

  get parameters() {
    console.debug(vname, "get parameters")
    return this.me.parameters
  }

  set parameters(newParameters) {
    console.debug(vname, "set parameters");
    this.me.parameters = newParameters
  }

  get channelCount() {
    console.debug(vname, "get channelCount");
    return this.me.channelCount
  }

  set channelCount(newChannelCount) {
    console.debug(vname, "set channelCount", newChannelCount);
    this.me.channelCount = newChannelCount
  }

  get channelCountMode() {
    console.debug(vname, "get channelCountMode");
    return this.me.channelCountMode
  }

  set channelCountMode(newChannelCountMode) {
    console.debug(vname, "set channelCountMode", newChannelCountMode);
    this.me.channelCountMode = newChannelCountMode
  }

  get channelInterpretation() {
    console.debug(vname, "get channelInterpretation");
    return this.me.channelInterpretation
  }

  set channelInterpretation(newChannelInterpretation) {
    console.debug(vname, "set channelInterpretation", newChannelInterpretation);
    this.me.channelInterpretation = newChannelInterpretation
  }

  set instance(newInstance) {
    console.debug(vname, "set instance", newInstance);
    this.me.instance = newInstance
  }

  get instance() {
    console.debug(vname, "get instance");
    return this.me.instance
  }

  set processor(newProcessor) {
    console.debug(vname, "set processor", newProcessor);
    this.me.processor = newProcessor
  }

  get processor() {
    console.debug(vname, "get processor");
    return this.me.processor
  }

  #numberOfInputs: number
  #numberOfOutputs: number
  #outputChannelCount: number[]

  get numberOfInputs() {
    console.debug(vname, "get numberOfInputs")
    return this.#numberOfInputs
  }

  get numberOfOutputs() {
    console.debug(vname, "get numberOfOutputs")
    return this.#numberOfOutputs
  }

  get outputChannelCount() {
    return this.#outputChannelCount
  }

  constructor(context: BaseAudioContext, name: string, options: AudioWorkletNodeOptions = {}) {
    // super(context, "audio-worklet-node-polyfill", options)
    console.debug(vname, "constructor", {context, name, options})
    const {outputChannelCount, numberOfInputs, channelCount, channelCountMode, channelInterpretation, numberOfOutputs, parameterData, processorOptions} = options
    this.#numberOfInputs = numberOfInputs ?? 1
    this.#numberOfOutputs = numberOfOutputs ?? 1
    this.#outputChannelCount = outputChannelCount ?? (new Array(this.#numberOfOutputs)).fill(2)
    if (this.#outputChannelCount.length !== this.#numberOfOutputs) {
      throw new Error("IndexSizeError")
    }

    function sum(arr: number[]) {
      let y = 0
      for(const i of arr) {
        y += i
      }
      return y
    }

    const processor = getProcessorsForContext(context)[name]
    const numberOfOutputChannels = sum(this.outputChannelCount)
    const numberOfInputChannels = channelCount ?? 2 * this.#numberOfInputs

    console.debug(vname, {outputChannels: numberOfOutputChannels, inputChannels: numberOfInputChannels, numberOfInputs, numberOfOutputs})

    // outputChannelCount array doesn't match numberOfOutputs, an IndexSizeError will be thrown.

  //   processorOptions: {
  //     sampleRate: context.sampleRate
  //   },
  //   numberOfInputs: 2,
  //   numberOfOutputs: 1,
  //   outputChannelCount: [2]
  // }

    const me = context.createScriptProcessor(undefined, numberOfInputChannels, numberOfOutputChannels) as Me
    // me.channelCount = channelCount ?? this.numberOfInputs *
    me.channelCountMode = channelCountMode ?? me.channelCountMode
    me.channelInterpretation = channelInterpretation ?? me.channelInterpretation

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
    me.port = messageChannel.port1
    nextPort = messageChannel.port2
    const instance = new (processor.Processor as typeof AudioWorkletProcessor)(options)
    nextPort = null

    me.processor = processor
    me.instance = instance;

    me.onprocessorerror = this.onprocessorerror
    me.onaudioprocess = this.onaudioprocess.bind(me)

    console.debug(vname, {me})
    console.debug(vname, "this", this);

    // return me as unknown as AudioWorkletNodePolyfill
    (me as any).$connect = me.connect
    const connect = (destinationNode: AudioNode, output?: number | undefined, input?: number | undefined) => {
      console.log("connect!", {destinationNode, output, input}, {me, $connect: (me as any).$connect, connect: (me as any).connect});
      (me as any).$connect(destinationNode, output, input)
    }
    // connect.name = "connect";
    (me as any).connect = connect
    this.me = me

    console.log(vname, "end of constructor", me)
    return (me as any)
  }


  onaudioprocess(ev: AudioProcessingEvent) {
    if (numberOfTimesProcessed > 10) {
      return
    }
    numberOfTimesProcessed += 1
    console.log(vname, "onaudioprocess", {params: ev})
    const parameters: Record<string, Float32Array> = {}
    let index = -1
    this.parameters.forEach((value: AudioParam, key: string) => {
      const processParams = PROCESS_PARAMS[++index] ?? (PROCESS_PARAMS[index] = new Float32Array(this.bufferSize))
      // @TODO proper values here if possible
      processParams.fill(value.value)
      parameters[key] = processParams
    })
    if (!this.processor) {
      console.debug(vname, "onaudioprocess return due to no processor")
      return
    }
    this.processor.realm.exec(
      `self.sampleRate=sampleRate=${this.context.sampleRate};`
      + `self.currentTime=currentTime=${this.context.currentTime}`
    )

    const {inputBuffer, outputBuffer} = ev
    const inputs = channelToArray(inputBuffer)
    const outputs = channelToArray(outputBuffer)
    console.debug(vname, "onaudioprocess", {inputBuffer, outputBuffer, inputs, outputs})
    this.instance.process([inputs], [outputs], parameters)

    // @todo - keepalive
    // let ret = this.instance.process([inputs], [outputs], parameters);
    // if (ret === true) { }

    function channelToArray (ch: AudioBuffer) {
      const out: Float32Array[] = new Array(ch.numberOfChannels)
      for (let i = 0; i < ch.numberOfChannels; i++) {
        out[i] = ch.getChannelData(i)
      }
      return out
    }
  }

}

// function onaudioprocess(this: Me, params: { inputBuffer: AudioBuffer, outputBuffer: AudioBuffer}) {

//   console.log(vname, "onaudioprocess", {params})
//   const parameters: Record<string, Float32Array> = {}
//   let index = -1
//   this.parameters?.forEach((value: AudioParam, key: string) => {
//     const processParams = PROCESS_PARAMS[++index] ?? (PROCESS_PARAMS[index] = new Float32Array(this.bufferSize))
//     // @TODO proper values here if possible
//     processParams.fill(value.value)
//     parameters[key] = processParams
//   })
//   if (!this.processor) {
//     return
//   }
//   this.processor.realm.exec(
//     `self.sampleRate=sampleRate=${this.context.sampleRate};`
//     + `self.currentTime=currentTime=${this.context.currentTime}`
//   )

//   const inputs = channelToArray(params.inputBuffer)
//   const outputs = channelToArray(params.outputBuffer)
//   this.instance?.process([inputs], [outputs], parameters)

//   // @todo - keepalive
//   // let ret = this.instance.process([inputs], [outputs], parameters);
//   // if (ret === true) { }

//   function channelToArray (ch: AudioBuffer) {
//     const out = []
//     for (let i = 0; i < ch.numberOfChannels; i++) {
//       out[i] = ch.getChannelData(i)
//     }
//     return out
//   }
// }

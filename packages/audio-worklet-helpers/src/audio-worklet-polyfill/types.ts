import { Realm, Scope } from "./realm"

export type mAudioWorkletNode = {
    properties?: AudioParamDescriptor[]
    parameters?: Map<string, AudioParam>
    port?: MessagePort
    onaudioprocess: (this: mAudioWorkletNode, params: {
        inputBuffer: AudioBuffer;
        outputBuffer: AudioBuffer;
    }) => void
    processor?: IProcessor
    process: AudioWorkletProcessor['process']
    instance?: AudioWorkletProcessor
    bufferSize: number
    context: Scope
    isAudioWorkletNodePolyfill: boolean
    channelMerger: ChannelMergerNode
    inputNodes: ScriptProcessorNode[]
    inputBuffers: AudioBuffer[]
    _outputNodes: ScriptProcessorNode[]
    // outputBuffers: AudioBuffer[]
    _channelCount: number
    _numberOfInputs: number
    _numberOfOutputs: number
    _outputChannelCount: number[]
    _outputs: Float32Array[][]
    $connect: typeof ScriptProcessorNode.prototype.connect
} & AudioWorkletProcessor & AudioNode

export interface IAudioWorkletNode extends AudioWorkletNode {
    prototype: AudioWorkletNode;
    new (context: BaseAudioContext, name: string, options?: AudioWorkletNodeOptions | undefined): AudioWorkletNode;
}

export interface IAudioWorklet extends AudioWorklet {
    prototype: AudioWorklet;
    new(audioContext?: AudioContext): AudioWorklet;
}

export interface IProcessor {
    realm: Realm;
    context: Scope;
    Processor: AudioWorkletProcessor | typeof AudioWorkletProcessor;
    properties: readonly AudioParamDescriptor[];
}

import { id } from "sidechain-compressor-processor";

export type SidechainCompressorParameterIds = "threshold" | "ratio" | "attack" | "release" | "makeupGain"

export interface SidechainCompressorAudioParamMap extends AudioParamMap {
    forEach(callbackfn: (value: AudioParam, key: SidechainCompressorParameterIds, parent: SidechainCompressorAudioParamMap) => void, thisArg?: any): void;
	get: (key: SidechainCompressorParameterIds) => AudioParam;
}

// These types / interfaces / declaration is so we can get better defined types on parameters for intellisense.
type ModifyParametersType<T, R> = Omit<T, 'parameters'> & R;
type SidechainCompressorAudioWorkletNode = ModifyParametersType<AudioWorkletNode, { parameters: SidechainCompressorAudioParamMap }>

// Modify the AudioWorkletNode declared types
// eslint-disable-next-line no-var
declare var AudioWorkletNode: {
    prototype: SidechainCompressorAudioWorkletNode;
    new(context: BaseAudioContext, name: string, options?: AudioWorkletNodeOptions): SidechainCompressorAudioWorkletNode;
}

export interface SidechainCompressorNodeOptions {
    context: AudioContext,
    audioWorkletNodeOptions?: AudioWorkletNodeOptions
}


export class SidechainCompressorNode extends AudioWorkletNode {
    constructor(context: AudioContext, audioWorkletNodeOptions: AudioWorkletNodeOptions = {
        processorOptions: {
            sampleRate: context.sampleRate
        },
        numberOfInputs: 2,
        numberOfOutputs: 1,
        outputChannelCount: [2]
    }) {
        super(context, id, audioWorkletNodeOptions)
        this.onprocessorerror = (ev) => console.log(ev)
    }
}

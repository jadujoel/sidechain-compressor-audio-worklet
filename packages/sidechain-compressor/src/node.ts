import { id } from "sidechain-compressor-processor"

export type SidechainCompressorParameterIds = "threshold" | "ratio" | "attack" | "release" | "makeupGain" | "mix"
export type LooseAutoComplete<T extends string> = T | Omit<string, T>

export interface SidechainCompressorAudioParamMap extends AudioParamMap {
    forEach(callbackfn: (value: AudioParam, key: string, parent: SidechainCompressorAudioParamMap) => void, thisArg?: any): void;
    // forEach(callbackfn: (value: AudioParam, key: LooseAutoComplete<SidechainCompressorParameterIds>, parent: AudioParamMap) => void, thisArg?: any): void;
	get: (key: SidechainCompressorParameterIds) => AudioParam;
}

// These types / interfaces / declaration is so we can get better defined types on parameters for intellisense.
type ModifyParametersType<T, R> = Omit<T, 'parameters'> & R;
type SidechainCompressorAudioWorkletNode = ModifyParametersType<AudioWorkletNode, { parameters: SidechainCompressorAudioParamMap }>

// Modify the AudioWorkletNode declared types, now if we do compressor.parameters.get("threshold")
// we eliminate the possibility of undefined on the params we have specified
// eslint-disable-next-line no-var
declare var AudioWorkletNode: {
    prototype: SidechainCompressorAudioWorkletNode;
    new(context: BaseAudioContext, name: string, options?: AudioWorkletNodeOptions): SidechainCompressorAudioWorkletNode;
}

export interface SidechainCompressorNodeOptions {
    context: AudioContext,
    audioWorkletNodeOptions?: AudioWorkletNodeOptions
}

// safer to do window.AudioWorklet node rather than just AudioWorkletNode for it to work in old react versions
// https://stackoverflow.com/questions/49971779/error-audioworkletnode-is-undefined-in-react-app
export class SidechainCompressorNode extends window.AudioWorkletNode { //implements SidechainCompressorAudioWorkletNode {
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

import { id } from "sidechain-compressor-processor"

export type SidechainCompressorParameterIds = "threshold" | "ratio" | "attack" | "release" | "makeupGain" | "mix"
export type LooseAutoComplete<T extends string> = T | Omit<string, T>

export interface SidechainCompressorAudioParamMap extends AudioParamMap {
    forEach(callbackfn: (value: AudioParam, key: string, parent: SidechainCompressorAudioParamMap) => void, thisArg?: any): void;
    // forEach(callbackfn: (value: AudioParam, key: LooseAutoComplete<SidechainCompressorParameterIds>, parent: AudioParamMap) => void, thisArg?: any): void;
	get: (key: SidechainCompressorParameterIds) => AudioParam;
}

export interface SidechainCompressorNodeOptions {
    context: AudioContext,
    audioWorkletNodeOptions?: AudioWorkletNodeOptions
}

// safer to do window.AudioWorklet node rather than just AudioWorkletNode for it to work in old react versions
// https://stackoverflow.com/questions/49971779/error-audioworkletnode-is-undefined-in-react-app
export class SidechainCompressorNode extends window.AudioWorkletNode {
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

import { getProcessorsForContext } from './get-processors-for-context'
import { mAudioWorkletProcessor } from './node'
import { Realm, Scope } from './realm'
import { IProcessor } from './types'

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

    const audioContextScope: Scope = {
      sampleRate: this.#context.sampleRate,
      currentTime: this.#context.currentTime,
      AudioWorkletProcessor: mAudioWorkletProcessor as any,
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

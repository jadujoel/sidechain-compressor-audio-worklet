import { mAudioWorklet, mAudioWorkletNode } from "./audio-worklet"
import type { IAudioWorklet, IAudioWorkletNode } from "./types"

export function installer(force = false) {
    const shouldInstall = typeof mAudioWorkletNode !== "function" || !("audioWorklet" in AudioContext.prototype) || force
    if (shouldInstall) {
        self.AudioWorkletNode = mAudioWorkletNode as unknown as IAudioWorkletNode //mAudioWorkletNode
        self.AudioWorklet = mAudioWorklet

        // add audioworklet property to audiocontext prototype
        const audioContextPrototype = (self.AudioContext || (self as any).webkitAudioContext).prototype
        Object.defineProperty(audioContextPrototype, 'audioWorklet', {
            get() {
                if (!this.__audioWorklet) {
                    this.__audioWorklet = new (self.AudioWorklet as IAudioWorklet)(this)
                }
                return this.__audioWorklet
            }
        })
    }
}

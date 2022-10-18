import { audioWorkletPolyfill } from "audio-worklet-helpers"
import { SidechainCompressorInsert } from 'sidechain-compressor'
import { createAudioContext } from '../utils/audio-context'
import { getBuffer } from '../utils/buffer'

export async function createApp() {
    await createAudioContext()
    audioWorkletPolyfill()
    const audioContext = await createAudioContext()

    const compressor = await SidechainCompressorInsert.create({context: audioContext})
    const base = "/sidechain-compressor-audio-worklet" as const
    const music = new URL(base + "/audio/pad.mp4", window.location.href)
    const sidechain = new URL(base + "audio/kick.mp4", window.location.href)
    const loop = true as const
    const duration = undefined
    const offset = 0 as const

    const musicBuffer = await getBuffer(music)
    const sidechainBuffer = await getBuffer(sidechain)

    const compressorNode = compressor.node

    const musicSource = audioContext.createBufferSource()
    musicSource.buffer = musicBuffer
    musicSource.loop = loop

    const sidechainSource = audioContext.createBufferSource()
    sidechainSource.buffer = sidechainBuffer
    sidechainSource.loop = loop

    const musicGain = audioContext.createGain()
    const sidechainGain = audioContext.createGain()
    const masterGain = audioContext.createGain()

    musicGain.gain.value = 0.5
    masterGain.gain.value = 0.8

    musicSource
        .connect(musicGain)
        .connect(compressorNode, 0, 0)

    sidechainSource
        .connect(sidechainGain)
        .connect(compressorNode, 0, 1)

    compressorNode
        .connect(masterGain)
        .connect(audioContext.destination)

    musicSource.start(audioContext.currentTime + 0.2, offset, duration)
    sidechainSource.start(audioContext.currentTime + 0.2, offset, duration)
    return compressor
}

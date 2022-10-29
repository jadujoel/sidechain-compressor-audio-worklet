import { audioWorkletPolyfill } from "audio-worklet-helpers"
import { SidechainCompressorInsert } from 'sidechain-compressor'
import { createAudioContext } from '../utils/audio-context'
import { getBuffer } from '../utils/buffer'

function getAudioUrl(id: string) {
    const audio = "/sidechain-compressor-audio-worklet/audio/" as const
    return new URL(audio + id + ".mp4", window.location.href)
}

export async function createCompressor() {
    await createAudioContext()
    audioWorkletPolyfill()
    const audioContext = await createAudioContext()

    const compressor = await SidechainCompressorInsert.create({context: audioContext})
    const music = getAudioUrl("pad")
    const sidechain = getAudioUrl("kick")
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

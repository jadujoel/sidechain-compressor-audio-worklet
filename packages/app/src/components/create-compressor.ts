import { SidechainCompressorInsert } from 'sidechain-compressor'
import { createAudioContext } from '../utils/audio-context'
import { getBuffer } from '../utils/buffer'

function getAudioUrl(id: string) {
    const audio = "/sidechain-compressor-audio-worklet/audio/" as const
    return new URL(audio + id + ".mp4", window.location.href)
}

export async function createCompressor() {
    await createAudioContext()
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
    console.log("compressorNode", compressorNode);
    (window as any).comp = compressorNode

    musicGain.gain.value = 0.5
    masterGain.gain.value = 0.8

    console.log("connect musicSource")
    musicSource
        .connect(musicGain)
        .connect(compressorNode, 0, 0)

    // console.log({ScriptProcessorNode})

    sidechainSource
        .connect(sidechainGain)
        .connect(compressorNode, 0, 1)

    compressorNode
        .connect(masterGain)
        .connect(audioContext.destination)


    // const mergerNode = audioContext.createChannelMerger()


    // musicSource.connect(mergerNode, 0, 0)
    // sidechainSource.connect(mergerNode, 0, 1)
    // mergerNode.connect(audioContext.destination, 0, 0)


    musicSource.start(audioContext.currentTime + 0.2, offset, duration)
    sidechainSource.start(audioContext.currentTime + 0.2, offset, duration)
    return compressor
}

import { SidechainCompressorInsert } from "../../src/sidechain-compressor"
import { getBuffer } from "../constants/buffer"

context("compressor", async () => {
    const music = "/pad.wav"
    const kick = "/kick.wav"
    const audioContext = new AudioContext()
    const now = () => audioContext.currentTime
    let buffer: AudioBuffer
    let buffer2: AudioBuffer

    beforeEach(async () => {
        buffer = await getBuffer(music)
        buffer2 = await getBuffer(kick)
    })

    it("starts test", async () => {
        expect(true)
    })

    it("node", async () => {
        const duration = undefined
        const offset = 0
        const loop = true

        const compressor = await SidechainCompressorInsert.create({context: audioContext})
        const compressorNode = compressor.node
        compressorNode.port.postMessage("data", [])

        const musicSource = audioContext.createBufferSource()
        musicSource.buffer = buffer
        musicSource.loop = loop

        const sidechainSource = audioContext.createBufferSource()
        sidechainSource.buffer = buffer2
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
        compressorNode.port.postMessage("enable-sidechain")

        compressorNode
            .connect(masterGain)
            .connect(audioContext.destination)

        musicSource.start(audioContext.currentTime + 0.2, offset, duration)
        sidechainSource.start(audioContext.currentTime + 0.2, offset, duration)

        compressorNode.parameters.get("threshold").value = -30
        compressorNode.parameters.get("ratio").value = 40
        compressorNode.parameters.get("attack").value = 0.02
        compressorNode.parameters.get("release").value = 0.18
        // compressorNode.parameters.get("release").setValueCurveAtTime([0.0001, 1, 0.0001], audioContext.currentTime, 8)
        // compressorNode.parameters.get("makeupGain").setValueCurveAtTime([0, 14, 0], audioContext.currentTime, 8)
        // compressorNode.parameters.get("threshold").setValueCurveAtTime([0, -60, -28], audioContext.currentTime, 8)
        // setTimeout(() => {
        // compressorNode.port.postMessage("enable-sidechain")
        // }, 8000)
    })
})

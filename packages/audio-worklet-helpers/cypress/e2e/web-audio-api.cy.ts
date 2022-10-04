import { getBuffer } from "cypress/constants/buffer"
import {installer} from "../../src/audio-worklet-polyfill/installer"
describe.skip("Baseline", () => {
    runTests()
})

describe(("Polyfilled"), () => {
    installer(true)
    // console.log("hello")
    runTests()
})

function runTests() {
    it("creates AudioContext", async () => {
        const context = new AudioContext()
        expect(context instanceof AudioContext).to.be.true
        expect(typeof context.currentTime).to.equal("number")
    })

    it("creates BiquadFilterNode using audioContext", async () => {
        const context = new AudioContext()
        const filter = context.createBiquadFilter()
        expect(filter instanceof BiquadFilterNode).to.be.true
        expect(typeof filter.type).to.equal("string")
    })

    it("creates BiquadFilterNode using constructor", async () => {
        const context = new AudioContext()
        const filter = new BiquadFilterNode(context)
        expect(filter instanceof BiquadFilterNode).to.be.true
        expect(typeof filter.type).to.equal("string")
    })

    it("has AudioWorklets", async () => {
        const context = new AudioContext()
        expect(context.audioWorklet instanceof AudioWorklet).to.be.true
    })

    it("has AudioWorkletNode (and AudioWorkletProcessor)", async () => {
        const context = new AudioContext()
        const {id, url} = await import("pass-through-processor")
        console.log(context.audioWorklet)
        await context.audioWorklet.addModule(url)
        const node = new AudioWorkletNode(context, id)
        expect(node instanceof AudioWorkletNode)
    })

    it("play audio through pass-through-processor", async () => {
        const context = new AudioContext()
        const {id, url} = await import("pass-through-processor")
        await context.audioWorklet.addModule(url)
        const node = new AudioWorkletNode(context, id)
        expect(node instanceof AudioWorkletNode)

        const audio = await getBuffer("/music.mp4")
        const src = context.createBufferSource()
        src.buffer = audio

        src.connect(node).connect(context.destination)
        src.start(0, 0, 1)
        const ended = new Promise<void>((resolve) => {
            src.addEventListener("ended", () => {
                resolve()
            }, {once: true})
        })
        await ended
    })

    it.only("play audio through sidechain-compressor-processor", async () => {
        const context = new AudioContext()
        const {id, url} = await import("sidechain-compressor-processor")
        await context.audioWorklet.addModule(url)
        const node = new AudioWorkletNode(context, id)
        node.port.postMessage("enable-logging")
        expect(node instanceof AudioWorkletNode)

        const audio = await getBuffer("/music.mp4")
        const src = context.createBufferSource()
        src.buffer = audio

        src.connect(node).connect(context.destination)
        src.start()
    })
}

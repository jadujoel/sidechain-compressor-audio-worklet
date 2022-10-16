import { url, type SidechainCompressorProcessorMessages } from "sidechain-compressor-processor"
import { SidechainCompressorNode, SidechainCompressorNodeOptions } from "./node"
export class SidechainCompressorInsertError extends Error {
    override name = "SidechainCompressorInsertError"
    constructor(message?: string) {
        super(message)
    }
}

interface SidechainCompressorInsertOptions extends SidechainCompressorNodeOptions {
    node?: SidechainCompressorNode
}

export class SidechainCompressorInsert {
    static isPrepared = false
    static async create(options: SidechainCompressorInsertOptions) {
        const { context, audioWorkletNodeOptions } = options
        let node: SidechainCompressorNode
        try {
            node = new SidechainCompressorNode(context, audioWorkletNodeOptions)
        }
        catch (err) {
            await context.audioWorklet.addModule(url)
            node = new SidechainCompressorNode(context, audioWorkletNodeOptions)
        }
        return new SidechainCompressorInsert({...options, node})
    }

    node: SidechainCompressorNode

    constructor({node, audioWorkletNodeOptions, context}: SidechainCompressorInsertOptions) {
        this.node = node || new SidechainCompressorNode(context, audioWorkletNodeOptions)

    }

    connect(...args: Parameters<typeof SidechainCompressorNode.prototype.connect>) {
        this.node.connect(...args)
    }

    #useSidechain = true
    #useLogging = false
    #isBypassed = false

    get sidechain() {
        return this.#useSidechain
    }
    set sidechain(use: boolean) {
        this.#useSidechain = use
        const msg: SidechainCompressorProcessorMessages = use ? "sidechain-on" : "sidechain-off"
        this.node.port.postMessage(msg)
    }
    get bypass() {
        return this.#isBypassed
    }
    
    set bypass(use: boolean) {
        this.#isBypassed = use
        const msg: SidechainCompressorProcessorMessages = use ? "bypass-on" : "bypass-off"
        this.node.port.postMessage(msg)
    }
    get logging() {
        return this.#useLogging
    }

    set logging(use: boolean) {
        this.#useLogging = use
        const msg: SidechainCompressorProcessorMessages = use ? "logging-on" : "logging-off"
        this.node.port.postMessage(msg)
    }

    get threshold() {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return (this.node.parameters as Map<string, AudioParam>).get("threshold")!
    }

    get ratio() {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return (this.node.parameters as Map<string, AudioParam>).get("ratio")!
    }

    get attack() {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return (this.node.parameters as Map<string, AudioParam>).get("attack")!
    }

    get release() {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return (this.node.parameters as Map<string, AudioParam>).get("release")!
    }

    get makeupGain() {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return (this.node.parameters as Map<string, AudioParam>).get("makeupGain")!
    }

    get mix() {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return (this.node.parameters as Map<string, AudioParam>).get("mix")!
    }
}

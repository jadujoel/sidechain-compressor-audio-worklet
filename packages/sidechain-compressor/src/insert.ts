import { url } from "sidechain-compressor-processor"
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
        // this.node = new SidechainCompressorNode(audioContext, {
        //     processorOptions: {
        //         kernelBufferSize: 128,
        //         channelCount: 2,
        //         numSamplesInStream: 128
        //     },
        //     numberOfInputs: 2,
        //     numberOfOutputs: 2,
        //     outputChannelCount: [2]
        // })
        // {numberOfInputs: 2, numberOfOutputs: 1, channelCount: 2, outputChannelCount: [2]})
    }

    connect(...args: Parameters<typeof SidechainCompressorNode.prototype.connect>) {
        this.node.connect(...args)
    }
}

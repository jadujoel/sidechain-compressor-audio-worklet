import usePromise from 'react-promise';
import { SidechainCompressorInsert } from 'sidechain-compressor';
import { createAudioContext } from '../utils/audio-context';
import { getBuffer } from '../utils/buffer';
import './Compressor.css';
import { createDefaultKnob, Knob } from "./Knob";
import { ToggleButton } from "./ToggleButton";

const thresholdDefault = -18 as const


async function create() {
    const audioContext = await createAudioContext()
    const compressor = await SidechainCompressorInsert.create({context: audioContext})

    const music = "/audio/pad.mp4" as const
    const sidechain = "/audio/kick.mp4" as const
    const loop = true as const
    const duration = undefined
    const offset = 0 as const

    const now = () => audioContext.currentTime

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

    // compressorNode.parameters.get("threshold").value = -30
    // compressorNode.parameters.get("ratio").value = 40
    // compressorNode.parameters.get("attack").value = 0.02
    // compressorNode.parameters.get("release").value = 0.18
    // compressorNode.port.postMessage("enable-sidechain")

}

async function createCompressor() {
    await create()
    return (
        <div className="Compressor">
        <header className="Compressor-header">
        <p>Sidechain Compressor</p>
        </header>
        <div className="Compressor-controls">
            <div className="top-row">
            <div className="empty"></div>
            <div className="empty"></div>
            <div className="sidechain-toggle">
                <ToggleButton/>
            </div>
            </div>
            <div className="outputs-top">
            <output id="threshold-output">{thresholdDefault}</output>
            <output id="attack-output">0</output>
            <output id="mix-output">100</output>
            </div>
            <div className="knobs-top">
            <Knob
                onChange={(v: number) => (document.getElementById("threshold-output") as HTMLOutputElement).value = String(v)}
                size={100} numTicks={25} degrees={260} color={false}
                min={-79} max={0} value={-18}
            />
            {createDefaultKnob()}
            {createDefaultKnob()}
            </div>
            <div className="labels-top">
            <p>Threshold</p>
            <p>Attack</p>
            <p>Mix</p>
            </div>
            <div className="outputs-bot">
            <output id="ratio-output">0</output>
            <output id="release-output">0</output>
            <output id="makeup-gain-output">0</output>
            </div>
            <div className="knobs-bot">
            {createDefaultKnob()}
            {createDefaultKnob()}
            {createDefaultKnob()}
            </div>
            <div className="labels-bot">
            <p>Ratio</p>
            <p>Release</p>
            <p>Makeup Gain</p>
            </div>
        </div>
        </div>
    )
}

export const AsyncCompressor = () => {
    const {value, loading} = usePromise<JSX.Element>(createCompressor())
    if (loading || !value) {
        return <p className="compressor-loading">loading compressor...</p>
    }
    return value
}


// const ExampleWithAsync = (props) => {
//     const {value, loading} = usePromise<string>(prom)
//     if (loading) return null
//     return <div>{value}</div>}
// }

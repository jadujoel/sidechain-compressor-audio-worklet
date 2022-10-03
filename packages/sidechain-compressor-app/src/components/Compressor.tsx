import { audioWorkletPolyfill } from "audio-worklet-helpers"
import type { SidechainCompressorInsert } from 'sidechain-compressor'
import { precisionRound } from '../utils/pretty'
import './Compressor.css'
import { createApp } from './create-app'
import { Knob } from "./Knob"
import { ToggleButton } from "./ToggleButton"

audioWorkletPolyfill(false)

let compressor: SidechainCompressorInsert

const defaultCb = (v: number): void => void 0

const Callbacks = {
    threshold: defaultCb,
    ratio: defaultCb,
    attack: defaultCb,
    release: defaultCb,
    mix: defaultCb,
    makeupGain: defaultCb,
    sidechain: (isEnabled: boolean): void => void 0,
}

createApp()
.then((v) => {
    compressor = v
    const threshold = compressor.node.parameters.get("threshold")!
    const ratio = compressor.node.parameters.get("ratio")!
    const attack = compressor.node.parameters.get("attack")!
    const release = compressor.node.parameters.get("release")!
    const makeupGain = compressor.node.parameters.get("makeupGain")!
    // const mix = compressor.node.parameters.get("mix")!

    const thresholdOutput = document.getElementById("threshold-output") as HTMLOutputElement
    const ratioOutput = document.getElementById("ratio-output") as HTMLOutputElement
    const attackOutput = document.getElementById("attack-output") as HTMLOutputElement
    const releaseOutput = document.getElementById("release-output") as HTMLOutputElement
    const makeupGainOutput = document.getElementById("makeup-gain-output") as HTMLOutputElement
    const mixOutput = document.getElementById("mix-output") as HTMLOutputElement

    Callbacks.threshold = (v: number) => {
        thresholdOutput.value = String(precisionRound(v, 1)) + " dBFS"
        threshold.value = v
    }
    Callbacks.ratio = (v: number) => {
        ratioOutput.value = String(precisionRound(v, 1))
        ratio.value = v
    }
    Callbacks.attack = (v: number) => {
        attackOutput.value = String(precisionRound(v * 1000, 0)) + " ms"
        attack.value = v
    }
    Callbacks.release = (v: number) => {
        releaseOutput.value = String(precisionRound(v * 1000, 0)) + " ms"
        release.value = v
    }
    Callbacks.mix = (v: number) => {
        mixOutput.value = String(precisionRound(v * 100, 0)) + " %"
        // mix.value = v
    }
    Callbacks.makeupGain = (v: number) => {
        makeupGainOutput.value = String(precisionRound(v, 1)) + " dB"
        makeupGain.value = v
    }
    Callbacks.sidechain = (isEnabled: boolean) => {
        compressor.node.port.postMessage(isEnabled ? "disable-sidechain" : "enable-sidechain")
    }

    Callbacks.threshold(threshold.value)
    Callbacks.ratio(ratio.value)
    Callbacks.attack(attack.value)
    Callbacks.release(release.value)
    Callbacks.makeupGain(makeupGain.value)
    // Callbacks.mix(mix.value)
})

const attr = `size={100} numTick={25} degrees={260} color={false}`



export const Compressor = () => {
    return <div className="Compressor">
        <header className="Compressor-header">
            <p>Sidechain Compressor</p>
        </header>
        <div className="Compressor-controls">
            <div className="top-row">
                <div className="empty"></div>
                <div className="empty"></div>
                <div className="sidechain-toggle">
                    <ToggleButton onChange={(v: any) => Callbacks.sidechain(v)}/>
                </div>
            </div>
            <div className="outputs-top">
                <output id="threshold-output">0</output>
                <output id="attack-output">0</output>
                <output id="mix-output">100</output>
            </div>
            <div className="knobs-top">
                <Knob
                    onChange={(v: number) => Callbacks.threshold(v)}
                    size={100} numTicks={25} degrees={260} color={false}
                    min={-79} max={0} value={-26}
                />
                <Knob
                    onChange={(v: number) => Callbacks.attack(v)}
                    size={100} numTicks={25} degrees={260} color={false}
                    min={0.001} max={0.08} value={0.04}
                />
                <Knob
                    onChange={(v: number) => Callbacks.mix(v)}
                    size={100} numTicks={25} degrees={260} color={false}
                    min={0} max={1} value={1}
                />
            </div>
            <div className="labels-top">
                <p>Threshold</p>
                <p>Attack</p>
                <p>Mix</p>
            </div>
            <div className="outputs-bot">
                <output id="ratio-output">1</output>
                <output id="release-output">0</output>
                <output id="makeup-gain-output">0</output>
            </div>
            <div className="knobs-bot">
                <Knob
                    onChange={(v: number) => Callbacks.ratio(v)}
                    size={100} numTicks={25} degrees={260} color={false}
                    min={1} max={100} value={12}
                />
                <Knob
                    onChange={(v: number) => Callbacks.release(v)}
                    size={100} numTicks={25} degrees={260} color={false}
                    min={0.001} max={0.08} value={0.04}
                />
                <Knob
                    onChange={(v: number) => Callbacks.makeupGain(v)}
                    size={100} numTicks={25} degrees={260} color={false}
                    min={-12} max={12} value={0}
                />
            </div>
            <div className="labels-bot">
                <p>Ratio</p>
                <p>Release</p>
                <p>Makeup Gain</p>
            </div>
        </div>
    </div>
}

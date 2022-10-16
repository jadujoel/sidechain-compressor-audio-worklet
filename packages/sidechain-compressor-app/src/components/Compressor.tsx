import type { SidechainCompressorInsert } from 'sidechain-compressor'
import { precisionRound } from '../utils/pretty'
import './Compressor.css'
import { createApp } from './create-app'
import { Knob } from "./Knob"
import { ToggleButton } from "./ToggleButton"

// audioWorkletPolyfill(true)

const defaultCallback = (v: number): void => void 0

const Callbacks = {
    threshold: defaultCallback,
    ratio: defaultCallback,
    attack: defaultCallback,
    release: defaultCallback,
    mix: defaultCallback,
    makeupGain: defaultCallback,
    sidechain: (isEnabled: boolean): void => void 0,
    bypass: (isEnabled: boolean): void => void 0,
}

createApp()
.then((compressor) => {
    const Outputs = {
        threshold: document.getElementById("threshold-output") as HTMLOutputElement,
        ratio: document.getElementById("ratio-output") as HTMLOutputElement,
        attack: document.getElementById("attack-output") as HTMLOutputElement,
        release: document.getElementById("release-output") as HTMLOutputElement,
        makeupGain: document.getElementById("makeup-gain-output") as HTMLOutputElement,
        mix: document.getElementById("mix-output") as HTMLOutputElement,
    } as const
    
    Callbacks.threshold = (v: number) => {
        Outputs.threshold.value = String(precisionRound(v, 1)) + " dBFS"
        compressor.threshold.value = v
    }
    Callbacks.ratio = (v: number) => {
        Outputs.ratio.value = String(precisionRound(v, 1))
        compressor.ratio.value = v
    }
    Callbacks.attack = (v: number) => {
        Outputs.attack.value = String(precisionRound(v * 1000, 0)) + " ms"
        compressor.attack.value = v
    }
    Callbacks.release = (v: number) => {
        Outputs.release.value = String(precisionRound(v * 1000, 0)) + " ms"
        compressor.release.value = v
    }
    Callbacks.mix = (v: number) => {
        Outputs.mix.value = String(precisionRound(v * 100, 0)) + " %"
        compressor.mix.value = v
    }
    Callbacks.makeupGain = (v: number) => {
        Outputs.makeupGain.value = String(precisionRound(v, 1)) + " dB"
        compressor.makeupGain.value = v
    }
    Callbacks.sidechain = (isEnabled: boolean) => {
        compressor.sidechain = !isEnabled
    }

    Callbacks.bypass = (isEnabled: boolean) => {
        compressor.bypass = !isEnabled
    }

    Callbacks.threshold(compressor.threshold.value)
    Callbacks.ratio(compressor.ratio.value)
    Callbacks.attack(compressor.attack.value)
    Callbacks.release(compressor.release.value)
    Callbacks.makeupGain(compressor.makeupGain.value)
    Callbacks.mix(compressor.mix.value)
})

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
                    <ToggleButton onChange={(isEnabled: boolean) => Callbacks.sidechain(isEnabled)}/>
                    <ToggleButton onChange={(isEnabled: boolean) => Callbacks.bypass(isEnabled)}/>
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

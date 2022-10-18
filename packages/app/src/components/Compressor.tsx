import { precisionRound } from '../utils/pretty'
import './Compressor.css'
import { createApp } from './create-app'
import { Knob } from "./Knob"
import { ToggleButton } from "./ToggleButton"


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defaultCallback = (v: number): void => void 0

const Callbacks = {
    threshold: defaultCallback,
    ratio: defaultCallback,
    attack: defaultCallback,
    release: defaultCallback,
    mix: defaultCallback,
    makeupGain: defaultCallback,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sidechain: (isEnabled: boolean): void => void 0,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    bypass: (isEnabled: boolean): void => void 0,
}

const Defaults = {
    threshold: -36,
    ratio: 4,
    attack: 0.044,
    release: 0.070,
    mix: 1,
    makeupGain: 0,
} as const

const OutputNames = {
    threshold: "threshold-output",
    ratio: "ratio-output",
    attack: "attack-output",
    release: "release-output",
    makeupGain: "makeup-gain-output",
    mix: "mix-output",
} as const

const LabelNames = {
    threshold: "threshold-label",
    ratio: "ratio-label",
    attack: "attack-label",
    release: "release-label",
    makeupGain: "makeup-gain-label",
    mix: "mix-label",
} as const

function getOutputElement(name: string) {
    return document.getElementById(name) as HTMLOutputElement
}

createApp().then(compressor => {
    const Outputs = {
        threshold: getOutputElement(OutputNames.threshold),
        ratio: getOutputElement(OutputNames.ratio),
        attack: getOutputElement(OutputNames.attack),
        release: getOutputElement(OutputNames.release),
        makeupGain: getOutputElement(OutputNames.makeupGain),
        mix: getOutputElement(OutputNames.mix),
    } as const

    Callbacks.threshold = (v: number) => {
        Outputs.threshold.value = String(precisionRound(v, 1))
        compressor.threshold.value = v
        return v
    }
    Callbacks.ratio = (v: number) => {
        Outputs.ratio.value = String(precisionRound(v, 1))
        compressor.ratio.value = v
    }
    Callbacks.attack = (v: number) => {
        Outputs.attack.value = String(precisionRound(v * 1000, 0))
        compressor.attack.value = v
    }
    Callbacks.release = (v: number) => {
        Outputs.release.value = String(precisionRound(v * 1000, 0))
        compressor.release.value = v
    }
    Callbacks.mix = (v: number) => {
        Outputs.mix.value = String(precisionRound(v * 100, 0))
        compressor.mix.value = v
    }
    Callbacks.makeupGain = (v: number) => {
        Outputs.makeupGain.value = String(precisionRound(v, 1))
        compressor.makeupGain.value = v
    }
    Callbacks.sidechain = (isEnabled: boolean) => {
        compressor.sidechain = isEnabled
    }

    Callbacks.bypass = (isEnabled: boolean) => {
        compressor.bypass = isEnabled
    }

    compressor.threshold.value = Defaults.threshold
    compressor.ratio.value = Defaults.ratio
    compressor.attack.value = Defaults.attack
    compressor.release.value = Defaults.release
    compressor.makeupGain.value = Defaults.makeupGain
    compressor.mix.value = Defaults.mix

    Callbacks.threshold(compressor.threshold.value)
    Callbacks.ratio(compressor.ratio.value)
    Callbacks.attack(compressor.attack.value)
    Callbacks.release(compressor.release.value)
    Callbacks.makeupGain(compressor.makeupGain.value)
    Callbacks.mix(compressor.mix.value)
})

export function Compressor() {
    return <div className="Compressor">

        <header className="Compressor-header">Compressor</header>
        <div className='Compressor-main-area'>
            <div className="Compressor-controls">
                <div className="frame blue">
                    <div className="control threshold">
                        <div className="output"><output id={OutputNames.threshold}>{Defaults.threshold}</output><label id={LabelNames.threshold}></label></div>
                        <Knob
                            onChange={(v: number) => Callbacks.threshold(v)}
                            min={-79} max={0} value={Defaults.threshold}
                            fillStart={Knob.FillStart.Right}
                        />
                        <p>Threshold</p>
                    </div>
                    <div className="control ratio">
                        <div className="output"><output id={OutputNames.ratio}>{Defaults.ratio}</output><label id={LabelNames.ratio}></label></div>
                        <Knob
                            onChange={(v: number) => Callbacks.ratio(v)}
                            min={1} max={100} value={Defaults.ratio}
                        />
                        <p>Ratio</p>
                    </div>
                </div>

                <div className="frame pink">
                    <div className="control attack">
                        <div className="output"><output id={OutputNames.attack}>{Defaults.attack * 1000}</output><label id={LabelNames.attack}></label></div>
                        <Knob
                            onChange={(v: number) => Callbacks.attack(v)}
                            min={0.001} max={0.08} value={Defaults.attack}
                        />
                        <p>Attack</p>
                    </div>
                    <div className="control release">
                        <div className="output"><output id={OutputNames.release}>{Defaults.release * 1000}</output><label id={LabelNames.release}></label></div>
                        <Knob
                            onChange={(v: number) => Callbacks.release(v)}
                            min={0.001} max={0.08} value={Defaults.release}
                        />
                        <p>Release</p>
                    </div>
                </div>

                <div className="frame yellow">
                    <div className="control gain">
                        <div className="output"><output id={OutputNames.makeupGain}>{Defaults.makeupGain}</output><label id={LabelNames.makeupGain}></label></div>
                        <Knob
                            onChange={(v: number) => Callbacks.makeupGain(v)}
                            min={0} max={24} value={Defaults.makeupGain}
                        />
                        <p>Makeup Gain</p>

                    </div>
                    <div className="control mix">
                        <div className="output">
                            <output id={OutputNames.mix}>{Defaults.mix * 100}</output>
                            <label id={LabelNames.mix}>%</label>
                        </div>
                        <Knob
                            onChange={(v: number) => Callbacks.mix(v)}
                            min={0} max={1} value={Defaults.mix}
                        />
                        <p>Mix</p>
                    </div>
                </div>

                <div className="frame grey toggles">
                    <div className="toggle">
                        <ToggleButton onChange={(isEnabled: boolean) => Callbacks.sidechain(isEnabled)} defaultChecked={true}/>
                        <p className='toggle-label'>Sidechain</p>
                    </div>
                    <div className="toggle">
                        <ToggleButton onChange={(isEnabled: boolean) => Callbacks.bypass(isEnabled)}/>
                        <p className='toggle-label'>Bypass</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

import { useDispatch, useSelector } from 'react-redux'
import { precisionRound } from '../utils/precisionRound'
import { join } from '../utils/string'
import styles from './compressor.module.css'

import { createCompressor } from './create-compressor'
import { Knob } from "./knob"
import { setAttack, setBypass, setGain, setMix, setRatio, setRelease, setSidechain, setThreshold, StoreState } from './store'
import { ToggleButton } from "./toggle-button"

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


const compressorPromise = createCompressor()

export function Compressor() {
    const state = useSelector<StoreState, StoreState['compressor']>(state => state.compressor)
    const dispatch = useDispatch()

    compressorPromise
    .then((compressor) => {
        Callbacks.threshold = (v: number) => {
            compressor.threshold.value = v
        }
        Callbacks.ratio = (v: number) => {
            compressor.ratio.value = v
        }
        Callbacks.attack = (v: number) => {
            compressor.attack.value = v
        }
        Callbacks.release = (v: number) => {
            compressor.release.value = v
        }
        Callbacks.mix = (v: number) => {
            compressor.mix.value = v
        }
        Callbacks.makeupGain = (v: number) => {
            compressor.makeupGain.value = v
        }

        Callbacks.sidechain = (isEnabled: boolean) => {
            compressor.sidechain = isEnabled
        }

        Callbacks.bypass = (isEnabled: boolean) => {
            compressor.bypass = isEnabled
        }

        Callbacks.threshold(state.threshold)
        Callbacks.ratio(state.ratio)
        Callbacks.attack(state.attack)
        Callbacks.release(state.release)
        Callbacks.makeupGain(state.gain)
        Callbacks.mix(state.mix)
        Callbacks.sidechain(state.sidechain)
        Callbacks.bypass(state.bypass)
    })

    return <div className={styles.Compressor}>
        <header className={styles['Compressor-header']}>
            Compressor
        </header>
        <div className={styles['Compressor-main-area']}>
            <div className={styles["Compressor-controls"]}>
                <div className={join(styles.frame, styles.blue)}>
                    <div className={join(styles.control, styles.threshold)}>
                        <div className={styles.output}>
                            <output id={OutputNames.threshold}>
                                {String(precisionRound(state.threshold, 1))}
                            </output>
                            <label id={LabelNames.threshold}></label>
                        </div>
                        <Knob
                            onChange={(v: number) => {
                                Callbacks.threshold(v)
                                dispatch(setThreshold(v))
                            }}
                            min={-79} max={0} value={state.threshold}
                            fillStart={Knob.FillStart.Right}
                        />
                        <p className={styles.p}>Threshold</p>
                    </div>
                    <div className={join(styles.control, styles.ratio)}>
                        <div className={styles.output}>
                            <output id={OutputNames.ratio}>
                                {String(precisionRound(state.ratio, 1))}
                            </output>
                            <label id={LabelNames.ratio}></label>
                        </div>
                        <Knob
                            onChange={(v: number) => {
                                Callbacks.ratio(v)
                                dispatch(setRatio(v))
                            }}
                            min={1} max={20} value={state.ratio}
                        />
                        <p className={styles.p}>Ratio</p>
                    </div>
                </div>

                <div className={join(styles.frame, styles.pink)}>
                    <div className={join(styles.control, styles.attack)}>
                        <div className={styles.output}>
                            <output id={OutputNames.attack}>
                                {String(precisionRound(state.attack * 1000, 0))}
                            </output>
                            <label id={LabelNames.attack}></label>
                        </div>
                        <Knob
                            onChange={(v: number) => {
                                Callbacks.attack(v)
                                dispatch(setAttack(v))
                            }}
                            min={0.001} max={0.08} value={state.attack}
                        />
                        <p className={styles.p}>Attack</p>
                    </div>
                    <div className={join(styles.control, styles.release)}>
                        <div className={styles.output}>
                            <output id={OutputNames.release}>
                                {String(precisionRound(state.release * 1000, 0))}
                            </output>
                            <label id={LabelNames.release}></label></div>
                        <Knob
                            onChange={(v: number) => {
                                Callbacks.release(v)
                                dispatch(setRelease(v))
                            }}
                            min={0.001} max={0.08} value={state.release}
                        />
                        <p className={styles.p}>Release</p>
                    </div>
                </div>

                <div className={join(styles.frame, styles.yellow)}>
                    <div className={join(styles.control, styles.gain)}>
                        <div className={join(styles.output)}>
                            <output id={OutputNames.makeupGain}>
                                {String(precisionRound(state.gain, 1))}
                            </output>
                            <label id={LabelNames.makeupGain}></label>
                        </div>
                        <Knob
                            onChange={(v: number) => {
                                Callbacks.makeupGain(v)
                                dispatch(setGain(v))
                            }}
                            min={0} max={24} value={state.gain}
                        />
                        <p className={styles.p}>Gain</p>
                    </div>
                    <div className={join(styles.control, styles.mix)}>
                        <div className={join(styles.output)}>
                            <output id={OutputNames.mix}>
                                {String(precisionRound(state.mix * 100, 0))}
                            </output>
                            <label id={LabelNames.mix}>%</label>
                        </div>
                        <Knob
                            onChange={(v: number) => {
                                Callbacks.mix(v)
                                dispatch(setMix(v))
                            }}
                            min={0} max={1} value={state.mix}
                        />
                        <p className={styles.p}>Mix</p>
                    </div>
                </div>

                <div className={join(styles.frame, styles.grey, styles.toggles)}>
                    <div className={join(styles.toggle)}>
                        <ToggleButton
                            defaultChecked={state.sidechain}
                            onChange={(isEnabled: boolean) => {
                                dispatch(setSidechain(isEnabled))
                                Callbacks.sidechain(isEnabled)
                            }}
                        />
                        <p className={join(styles.p, styles['toggle-label'])}>
                            Sidechain
                        </p>
                    </div>
                    <div className={join(styles.p, styles.toggle)}>
                        <ToggleButton
                            defaultChecked={state.bypass}
                            onChange={(isEnabled: boolean) => {
                                dispatch(setBypass(isEnabled))
                                Callbacks.bypass(isEnabled)
                            }}
                        />
                        <p className={join(styles.p, styles['toggle-label'])}>
                            Bypass
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

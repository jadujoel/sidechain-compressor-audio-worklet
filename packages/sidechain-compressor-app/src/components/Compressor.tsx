import type { SidechainCompressorInsert } from 'sidechain-compressor'
import './Compressor.css'
import { createApp } from './create-app'
import { Knob } from "./Knob"
import { ToggleButton } from "./ToggleButton"

const thresholdDefault = -18 as const

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


createApp().then((v) => {
  compressor = v
  Callbacks.threshold = (v: number) => {
    (document.getElementById("threshold-output") as HTMLOutputElement).value = String(v)
    compressor.node.parameters.get("threshold").value = v
  }
  Callbacks.ratio = (v: number) => {
    (document.getElementById("ratio-output") as HTMLOutputElement).value = String(v)
    compressor.node.parameters.get("ratio").value = v
  }
  Callbacks.attack = (v: number) => {
    (document.getElementById("attack-output") as HTMLOutputElement).value = String(v)
    compressor.node.parameters.get("attack").value = v
  }
  Callbacks.release = (v: number) => {
    (document.getElementById("release-output") as HTMLOutputElement).value = String(v)
    compressor.node.parameters.get("release").value = v
  }
  Callbacks.mix = (v: number) => {
    (document.getElementById("mix-output") as HTMLOutputElement).value = String(v)
    // compressor.node.parameters.get("mix").value = v
  }
  Callbacks.makeupGain = (v: number) => {
    (document.getElementById("makeup-gain-output") as HTMLOutputElement).value = String(v)
    compressor.node.parameters.get("makeupGain").value = v
  }
  Callbacks.sidechain = (isEnabled: boolean) => {
    compressor.node.port.postMessage(isEnabled ? "disable-sidechain" : "enable-sidechain")
  }
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
            <ToggleButton onChange={(v: any) => Callbacks.sidechain(v)}/>
          </div>
        </div>
        <div className="outputs-top">
          <output id="threshold-output">{thresholdDefault}</output>
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
              min={0.0001} max={4} value={0.2}
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
          <output id="ratio-output">0</output>
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
              min={0.0001} max={4} value={0.2}
          />
          <Knob
              onChange={(v: number) => Callbacks.makeupGain(v)}
              size={100} numTicks={25} degrees={260} color={false}
              min={-24} max={24} value={0}
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

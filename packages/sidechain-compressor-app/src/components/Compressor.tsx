import './Compressor.css'
import { createDefaultKnob, Knob } from "./Knob"
import { ToggleButton } from "./ToggleButton"

const thresholdDefault = -18 as const

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
}

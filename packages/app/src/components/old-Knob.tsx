import { Component } from "react"
import { clamp } from "../clamp"
import { FunctionAny } from "../utils/types"
import "./Knob.css"

type MouseEventFix = MouseEvent & {target: {getBoundingClientRect: FunctionAny}}
interface KnobProps {
    degrees: number
    size: number
    min: number
    max: number
    value: number
    numTicks: number
    color: boolean
    onChange: FunctionAny
}

interface State {
    deg: number
}

export class Knob extends Component<KnobProps, State> {
    static defaultProps: typeof Knob.prototype.props = {
        size: 150,
        min: 0,
        max: 1,
        numTicks: 0,
        degrees: 270,
        value: 0,
        color: true,
        onChange: () => void 0
    }

    fullAngle: number
    startAngle: number
    endAngle: number
    margin: number
    currentDeg: number

    constructor(props: KnobProps) {
        super(props)
        const {degrees, size, min, max, value} = this.props
        this.fullAngle = degrees
        this.startAngle = (360 - degrees) / 2
        this.endAngle = this.startAngle + degrees
        this.margin = size * 0.15
        this.currentDeg = Math.floor(
            this.convertRange(min, max, this.startAngle, this.endAngle, value)
        )
        this.state = { deg: this.currentDeg }
    }

    startDrag = (e: React.MouseEvent<HTMLDivElement> & MouseEventFix) => {
        let startY = this.currentDeg + e.clientY
        e.preventDefault()
        const clampDeg = (input: number) => {
            return clamp(input, this.startAngle, this.endAngle)
        }

        const moveHandler = (e: MouseEvent) => {
            const sensitivity = 1
            const y = startY - e.clientY * sensitivity
            this.currentDeg = clampDeg(y)

            // clamp mouse at min / max basically
            if (y > this.endAngle) {
                startY -= y - this.endAngle
            }
            else if (y < this.startAngle) {
                startY -= y - this.startAngle
            }

            let newValue = this.convertRange(
                this.startAngle,
                this.endAngle,
                this.props.min,
                this.props.max,
                this.currentDeg
            )
            newValue = Math.max(Math.min(newValue, this.props.max), this.props.min)
            this.setState({ deg: this.currentDeg })
            this.props.onChange(newValue)
        }
        document.addEventListener("mousemove", moveHandler)
        document.addEventListener("mouseup", e => {
            document.removeEventListener("mousemove", moveHandler)
        })
    }

    convertRange = (oldMin: number, oldMax: number, newMin: number, newMax: number, oldValue: number) => {
        return (oldValue - oldMin) * (newMax - newMin) / (oldMax - oldMin) + newMin
    }

    renderTicks = () => {
        const ticks = []
        const incr = this.fullAngle / this.props.numTicks
        const size = this.margin + this.props.size / 2
        for (let deg = this.startAngle; deg <= this.endAngle; deg += incr) {
            const tick = {
                deg: deg,
                tickStyle: {
                    height: size + 10,
                    left: size - 1,
                    top: size + 2,
                    transform: "rotate(" + deg + "deg)",
                    transformOrigin: "top"
                }
            }
            ticks.push(tick)
        }
        return ticks
    }

    dcpy = (o: Record<string, any>) => {
        return JSON.parse(JSON.stringify(o))
    }

    override render() {
        const kStyle = {
            width: this.props.size,
            height: this.props.size
        }
        const iStyle = this.dcpy(kStyle)
        const oStyle = this.dcpy(kStyle)
        oStyle.margin = this.margin
        if (this.props.color) {
            oStyle.backgroundImage
                = "radial-gradient(100% 70%,hsl(210, "
                + this.currentDeg
                + "%, "
                + this.currentDeg / 5
                + "%),hsl("
                + Math.random() * 100
                + ",20%,"
                + this.currentDeg / 36
                + "%))"
        }
        iStyle.transform = "rotate(" + this.state.deg + "deg)"

        return (
            <div className="knob-container">
                <div className="knob" style={kStyle}>
                    <div className="ticks"> {
                        this.props.numTicks
                            ? this.renderTicks().map((tick, i) => (
                                <div key={i} className={"tick" + (tick.deg <= this.currentDeg ? " active" : "") } style={tick.tickStyle}/>
                            ))
                            : null
                    }</div>
                    <div className="knob outer" style={oStyle} onMouseDown={this.startDrag}>
                        <div className="knob inner" style={iStyle}>
                            <div className="grip" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

import { Component } from "react"
import { clamp } from "../clamp"
import { FunctionAny } from "../utils/types"
import "./Knob.css"

type MouseEventFix = MouseEvent & {target: {getBoundingClientRect: FunctionAny}}
type TouchEventFix = TouchEvent & {target: {getBoundingClientRect: FunctionAny}}
type MoveEvent
    = React.MouseEvent<HTMLDivElement> & MouseEventFix
    | React.TouchEvent<HTMLDivElement>  & TouchEventFix

interface KnobProps {
    degrees: number
    size: number
    min: number
    max: number
    value: number
    onChange: FunctionAny
    fillStart: typeof Knob.FillStart[keyof typeof Knob.FillStart]
}

interface State {
    deg: number
}

const Rotation = [134, -90, 46] as const

const parse = (o: Record<string, any>) => {
    return JSON.parse(JSON.stringify(o))
}

const convertRange = (oldMin: number, oldMax: number, newMin: number, newMax: number, oldValue: number) => {
    return (oldValue - oldMin) * (newMax - newMin) / (oldMax - oldMin) + newMin
}

export class Knob extends Component<KnobProps, State> {
    static FillStart = {
        Left: 0,
        Middle: 1,
        Right: 2
    } as const
    static defaultProps: typeof Knob.prototype.props = {
        size: 150,
        min: 0,
        max: 1,
        degrees: 270,
        value: 0,
        onChange: () => void 0,
        fillStart: Knob.FillStart.Left
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
            convertRange(min, max, this.startAngle, this.endAngle, value)
        )
        this.state = { deg: this.currentDeg }
    }

    startDrag = (e: MouseEvent | TouchEvent) => {
        const isTouchEvent = (thing: MouseEvent | TouchEvent): thing is TouchEvent => {
            return Object.prototype.hasOwnProperty.call(e, "touches")
        }
        let startY = isTouchEvent(e)
            ? this.currentDeg + e.touches[0].clientY
            : this.currentDeg + e.clientY

        e.preventDefault()
        const clampDeg = (input: number) => {
            return clamp(input, this.startAngle, this.endAngle)
        }

        const moveHandler = (e: MouseEvent | TouchEvent) => {
            const sensitivity = 1

            const clienty = isTouchEvent(e)
                ? e.touches[0].clientY
                : e.clientY

            const y = startY - clienty * sensitivity
            this.currentDeg = clampDeg(y)

            // clamp mouse at min / max basically
            if (y > this.endAngle) {
                startY -= y - this.endAngle
            }
            else if (y < this.startAngle) {
                startY -= y - this.startAngle
            }

            let newValue = convertRange(
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
        document.addEventListener("touchmove", moveHandler)
        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", moveHandler)
        })
        document.addEventListener("touchup", () => {
            document.removeEventListener("mousemove", moveHandler)
        })
    }

    getOffset() {
        const scale = 0.5222222 as const
        const scaled = this.state.deg * scale
        const angle = this.startAngle * scale
        switch (this.props.fillStart) {
            case Knob.FillStart.Left: {
                return 360 - scaled + angle
            }
            case Knob.FillStart.Right: {
                return 0 - scaled - angle
            }
            case Knob.FillStart.Middle: {
                return this.currentDeg > 180
                    ? 360 - scaled + 94
                    : -70 - scaled - angle
            }
            default: {
                return 360
            }
        }
    }

    override render() {
        const rotate = {
            transform: `rotate(${this.state.deg}deg)`
        } as const
        const circle = {
            "strokeDashoffset": this.getOffset()
        } as const
        const svgStyle = {
            transform: `rotate(${Rotation[this.props.fillStart]}deg)`
        } as const

        return (
            <div className="knob container" onMouseDown={this.startDrag as any} onTouchStart={this.startDrag as any}>
                {/* <div className="knob track"></div> */}
                <svg className="track-shadow" x="0px" y="0px" width="68px" height="68px">
                    <filter id="inset-shadow" x="-50%" y="-50%" width="200%" height="200%" transform="rotate(90deg)">
                        <feComponentTransfer in="SourceAlpha">
                            <feFuncA type="table" tableValues="1 0" />
                        </feComponentTransfer>
                        <feGaussianBlur stdDeviation="1"/>
                        <feOffset dx="1" dy="1" result="offsetblur"/>
                        <feFlood floodColor="rgb(0, 0, 0)" result="color"/>
                        <feComposite in2="offsetblur" operator="in"/>
                        <feComposite in2="SourceAlpha" operator="in" />
                        <feMerge>
                            <feMergeNode in="SourceGraphic" />
                            <feMergeNode />
                        </feMerge>
                    </filter>
                    <circle cx="34" cy="34" r="30" filter="url(#inset-shadow)"/>
                </svg>
                <div className="pizza"/>
                <div className="">
                    <svg x="0px" y="0px" width="68px" height="68px" style={parse(svgStyle)}>
                        <circle cx="34" cy="34" r="30" style={parse(circle)}/>
                        <circle className="glow" cx="34" cy="34" r="30" style={parse(circle)}/>
                    </svg>
                </div>
                <div className="knob">

                    <div className="knob base shadow"></div>
                    <div className="knob base rotate" style={rotate}>
                        <div className="knob indicator"></div>
                        <div className="knob indicator fill"></div>
                        <div className="knob indicator fill glow"></div>
                    </div>
                </div>
                <svg className="knob outline" x="0px" y="0px" width="68px" height="68px">
                    <defs>
                        <linearGradient id="gradient" y1="0" y2="1">
                            <stop stopColor="rgba(255,255,255,0.25)" offset="0"/>
                            <stop stopColor="rgba(0,0,0,0.25)" offset="1"/>
                        </linearGradient>
                    </defs>
                    <circle className="outline" cx="34" cy="34" r="29"/>
                </svg>
            </div>
        )
    }
}

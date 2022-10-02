import { Component } from "react";
import "./Knob.css";

type MouseEventFix = MouseEvent & {target: {getBoundingClientRect: Function}}
interface KnobProps {
    degrees: number
    size: number
    min: number
    max: number
    value: number
    numTicks: number
    color: boolean
    onChange: Function
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
    };

    fullAngle: number
    startAngle: number
    endAngle: number
    margin: number
    currentDeg: number

    constructor(props: KnobProps) {
        super(props);
        const {degrees, size, min, max, value} = this.props
        this.fullAngle = degrees;
        this.startAngle = (360 - degrees) / 2;
        this.endAngle = this.startAngle + degrees;
        this.margin = size * 0.15;
        this.currentDeg = Math.floor(
            this.convertRange(min, max, this.startAngle, this.endAngle, value)
        );
        this.state = { deg: this.currentDeg };
    }

    startDrag = (e: React.MouseEvent<HTMLDivElement> & MouseEventFix) => {

        e.preventDefault();
        const knob = e.target.getBoundingClientRect();
        const pts = {
            x: knob.left + knob.width / 2,
            y: knob.top + knob.height / 2
        };
        const moveHandler = (e: MouseEvent) => {
            this.currentDeg = this.getDeg(e.clientX, e.clientY, pts);
            if (this.currentDeg === this.startAngle) this.currentDeg--;
            let newValue = this.convertRange(
                this.startAngle,
                this.endAngle,
                this.props.min,
                this.props.max,
                this.currentDeg
            )
            newValue = Math.max(Math.min(newValue, this.props.max), this.props.min)
            this.setState({ deg: this.currentDeg });
            this.props.onChange(newValue);
        };
        document.addEventListener("mousemove", moveHandler);
        document.addEventListener("mouseup", e => {
            document.removeEventListener("mousemove", moveHandler);
        });
    };

    getDeg = (cX: number, cY: number, pts: {x: number, y: number}) => {
        const x = cX - pts.x;
        const y = cY - pts.y;
        let deg = Math.atan(y / x) * 180 / Math.PI;
        if ((x < 0 && y >= 0) || (x < 0 && y < 0)) {
            deg += 90;
        } else {
            deg += 270;
        }
        let finalDeg = Math.min(Math.max(this.startAngle, deg), this.endAngle);
        return finalDeg;
    };

    convertRange = (oldMin: number, oldMax: number, newMin: number, newMax: number, oldValue: number) => {
        return (oldValue - oldMin) * (newMax - newMin) / (oldMax - oldMin) + newMin;
    };

    renderTicks = () => {
        let ticks = [];
        const incr = this.fullAngle / this.props.numTicks;
        const size = this.margin + this.props.size / 2;
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
            };
            ticks.push(tick);
        }
        return ticks;
    };

    dcpy = (o: {}) => {
        return JSON.parse(JSON.stringify(o));
    };

    override render() {
        let kStyle = {
            width: this.props.size,
            height: this.props.size
        };
        let iStyle = this.dcpy(kStyle);
        let oStyle = this.dcpy(kStyle);
        oStyle.margin = this.margin;
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
                + "%))";
        }
        iStyle.transform = "rotate(" + this.state.deg + "deg)";

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
        );
    }
}

export function createDefaultKnob() {
    return <Knob
        size={100}
        numTicks={25}
        degrees={260}
        min={1}
        max={100}
        value={30}
        color={false}
    />
}

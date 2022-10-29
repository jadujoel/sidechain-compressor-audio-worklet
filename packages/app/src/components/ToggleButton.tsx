import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { FunctionAny } from '../utils/types'
import './ToggleButton.css'

const CheckedIcon = () => <>🌜</>
const UncheckedIcon = () => <>🌞</>

const ToggleButton = (props: {
        defaultChecked?: boolean,
        onChange?: FunctionAny,
        disabled?: boolean,
        className?: string,
        icons?: {
            checked: JSX.Element,
            unchecked: JSX.Element
        }
    }) => {
    props = {...ToggleButton.defaultProps, ...props}
    const [toggle, setToggle] = useState(false)
    const { defaultChecked, onChange, disabled, className } = props

    useEffect(() => {
        if (defaultChecked) {
            setToggle(defaultChecked)
        }
    }, [defaultChecked])

    const triggerToggle = () => {
        if ( disabled ) {
            return
        }

        setToggle(!toggle)

        if (typeof onChange === 'function') {
            onChange(!toggle)
        }
    }

    // 'checked': toggle,
    // 'disabled': disabled,
    const toggleClasses = classNames('wrg-toggle', {
        'wrg-toggle--checked': toggle,
        'wrg-toggle--disabled': disabled,

    }, className)

    const cx = "11"
    const cy = "34"

    return (
        <div onClick={triggerToggle} className={toggleClasses}>
            <div className="wrg-toggle-container">
                <div className="wrg-toggle-circle">
                    <svg className={`wrg-toggle knob outline`} x="0px" y="0px" width="68px" height="68px">
                    <defs>
                        <linearGradient id="gradient" y1="0" y2="1">
                            <stop stopColor="rgba(255,255,255,0.25)" offset="0"/>
                            <stop stopColor="rgba(0,0,0,1)" offset="1"/>
                        </linearGradient>
                    </defs>
                    <circle className={`outline`} cx={cx} cy={cy} r="21.5"/>
                    </svg>
                </div>
                <input type="checkbox" aria-label="Toggle Button" className="wrg-toggle-input" />
            </div>
        </div>
    )
}

ToggleButton.defaultProps = {
    icons: {
        checked: <CheckedIcon />,
        unchecked: <UncheckedIcon />
    }
}

ToggleButton.propTypes = {
    disabled: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    className: PropTypes.string,
    onChange: PropTypes.func,
    icons: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.shape({
            checked: PropTypes.node,
            unchecked: PropTypes.node
        })
    ])
}

export { ToggleButton }

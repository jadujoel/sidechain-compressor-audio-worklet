import { max } from "./clamp"
import { add, subtract } from "./math"

export function wait (time = 0) {
    return new Promise<void> (
        (resolve) => {
            setTimeout(() => resolve(), time * 1000)
        },
    )
}

export function endTime(currentTime: number, when: number, duration = 0) {
    const then = max(subtract(when, currentTime), 0)
    return add(then, duration)
}

export function endTimer(currentTime: number, when: number, duration = 0) {
    const then = endTime(currentTime, when, duration)
    return wait(then)
}

// https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime#choosing_a_good_timeconstant
export function timeConstant(duration: number) {
    return duration / 3
}

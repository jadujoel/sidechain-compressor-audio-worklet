export function linearFromDecibel(decibels: number) {
    return decibelsToLinear(decibels)
}

export function decibelFromLinear(linear: number) {
    return linearToDecibels(linear)
}

export function decibelsToLinear(decibels: number): number {
    return Math.pow(10, 0.05 * decibels)
}

export function linearToDecibels(linear: number) {
    // It's not possible to calculate decibels for a zero linear value since it would be -Inf.
    // -1000.0 dB represents a very tiny linear value in case we ever reach this case.
    if (!linear)
        return -1000

    return 20 * Math.log10(linear)
}


// works when adding undefined, null etc also
export function add(...args: unknown[]) {
    let total = Number(0)
    for (const arg of args) {
        const val = Number(arg)
        if (Number.isFinite(val)) {
            total += val
        }
    }
    return total
}


// works when adding undefined, null etc also
export function subtract(x: unknown, y: unknown) {
    let result = 0
    const xn = Number(x)
    const yn = Number(y)
    if (Number.isFinite(xn)) {
        result = xn
    }
    if (Number.isFinite(yn)) {
        result -= yn
    }
    return result
}

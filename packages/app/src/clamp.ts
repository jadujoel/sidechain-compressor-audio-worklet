export function max(x: number, y: number) {
    return Math.max(x, y)
}

export function min(x: number, y: number) {
    return Math.min(x, y)
}

export function clamp(input: number, min_: number, max_: number) {
    return Math.min(Math.max(input, min_), max_)
}

export function clampZeroToOne(input: number) {
    return clamp(input, 0, 1)
}

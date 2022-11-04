export function max(x: number, y: number) {
    return Math.max(x, y)
}

export function min(x: number, y: number) {
    return Math.min(x, y)
}

export function clamp(input: number, x: number, y: number) {
    return Math.min(Math.max(input, x), y)
}

export function clampZeroToOne(input: number) {
    return clamp(input, 0, 1)
}

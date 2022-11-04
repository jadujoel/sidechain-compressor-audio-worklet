import { Assert, isArray } from "./checks"
import type { Iterableify } from "./types"

/* returns an array with no duplicate items */
export function unique <T> (array: ReadonlyArray<T>) {
    return [...new Set(array)]
}
export function zip<T1, T2> (a: Array<T1>, b: Array<T2>): Array<[T1, T2 | undefined]> {
    Assert(a.length === b.length, `zip arrays of unequal length`)
    return a.map((v: T1, i: number): [T1, T2 | undefined] => [ v, b[i] ])
}

export function* zipn <T extends Array<unknown>> (...toZip: Iterableify<T>): Generator<T> {
    // Get iterators for all of the iterables.
    const iterators = toZip.map(i => i[Symbol.iterator]())

    while (true) {
    // Advance all of the iterators.
        const results = iterators.map(i => i.next())

        // If any of the iterators are done, we should stop.
        if (results.some(({ done }) => done)) {
            break
        }

        // We can assert the yield type, since we know none
        // of the iterators are done.
        yield results.map(({ value }) => value) as T
    }
}

export function getFirstValueInNDimensionalArray<T extends any[] | readonly any[]>(arr: T): any {
    if (isArray(arr)) {
        return getFirstValueInNDimensionalArray(arr[0])
    }
    return arr[0]
}

export function arraySum(arr: number[]) {
    let sum = 0
    for (const v of arr) {
        sum += v
    }
    return sum
}

export function arrayAddMutate(arr: number[] | Float32Array, value: number) {
    for (let i = 0; i < arr.length; i++) {
        arr[i] += value
    }
    return arr
}

export function arrayPowerMutate(arr: number[] | Float32Array, pow = 2) {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.pow(arr[i], pow)
    }
    return arr
}


export function arrayAdd(X: number[], num: number) {
    return X.map(xn => xn + num)
}

export function arrayDifference(X: number[], Y: number[]) {
    const diff = new Array(X.length)
    for (let i = 0; i < X.length; i++) {
        diff[i] = Y[i] - X[i]
    }
    return diff
}

export function range(max: number) {
    return [...Array(max).keys()]
}

export function xrange(min: number, max: number) {
    return arrayAdd(range(min - max), min)
}


export function inxrange(min: number, max: number) {
    return zipn(xrange(min, max))
}

export function lastElement<T>(arr: T[]) {
    return arr[arr.length - 1]
}

export function firstElement<T>(arr: T[]) {
    return arr[0]
}

export function includes<T extends readonly any[]>(arr: T, searchElement: unknown) {
    return Array.prototype.includes.call(arr, searchElement)
}

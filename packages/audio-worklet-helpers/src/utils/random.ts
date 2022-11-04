import { isArray, isNumber } from "./checks"

/**
 * Randomizing Value
 * @param {RandomSet} values Passes as a range. example [[0.1, 0.3], 0.5, 0.5]
 * would result in 66.6% chance of returning 0.5 and 33.3% chance of returning
 * a value in between 0.1-0.3
 * @returns {number} Random value if input was a random range, otherwise same as input
 */
export function randomizeValues(values: ValueOrRandom): number {
    if (isNumber(values)) {
        return values
    }
    // else if (isUndefined(values)) {
    //     /* DEBUG_START */ console.warn("value passed to randomizeValues is undefined") /* DEBUG_END */
    //     return 0
    // }
    let isValid = true
    const rangeReg = /^-?\d*\.?\d+,-?\d*\.?\d+$/ // eslint-disable-line
    const valueReg = /^-?\d*\.?\d+$/
    let randomVal
    let filterArr

    if (!isNumber(values) && Array.isArray(values)) {
        if (values.length > 0) {
            filterArr = (values as string[]).map((n) => {
                if (valueReg.test(n)) {
                    return n
                }

                else if (isArray(n)) {
                    return getRandomValue(parseFloat(n[0]), parseFloat(n[1]))
                }

                else if (rangeReg.test(n)) {
                    const range = n.split(",")
                    return getRandomValue(parseFloat(range[0]), parseFloat(range[1]))
                }

                else {
                    isValid = false
                    /* DEBUG_START */
                    console.warn("Invalid random value format: " + values)
                    /* DEBUG_END */
                }
                return null
            })

            if (isValid) {
                randomVal  = randomShuffle(filterArr)[0]
                return parseFloat(randomVal as string)
            }
        }
        else {
            console.warn("Invalid random value: empty array")
        }
    }
    else {
        randomVal = values
        return Number(randomVal)
    }
    throw new Error(/* DEBUG_START */"Randomize values should not reach this line"/* DEBUG_END */)
}

/**
 * Get random value from two values
 * @param {number} min lower limit
 * @param {number} max upper limit
 * @returns {number} random value from range
 */
function getRandomValue(min: number, max: number) {
    const rand = Math.random() * (max - min) + min
    return rand.toFixed(3)
}


/**
 * Shuffle the sequential array when pool type is random and ends the Q
 * @param {T[]} array Array to shuffle
 * @returns {T[]} Shuffled array
 */
export function randomShuffle<T>(array: T[]): T[] {
    const arrayWithRandomNumbers: Array<[number, T]> = array.map((n: T) => [Math.random(), n])
    arrayWithRandomNumbers.sort()
    return arrayWithRandomNumbers.map((n) => n[1])
}

/** @example [0, 1000] */
export type RandomRangeArray = [number, number];
/** @example "0,1000" */
export type RandomRangeString = string;
/** @example [0, [100, 200], "400,500"] */
export type RandomSet = Array<number | RandomRangeArray | RandomRangeString> | RandomRangeArray | RandomRangeString;
export type ValueOrRandom = number | RandomSet;

function getNumDigitsBeforeDecimal(value: number) {
    const isNegative = value < 0
    const str = String(value)
    const regexp = isNegative ? /-\d*/ : /\d*/
    const match = str.match(regexp)
    const length = match ? match[0].length : 0
    return length
}

export function getPrettyNumericString(value: number, precision = 2) {
    const isNegative = value < 0
    const numDigitsBeforeDecimal = getNumDigitsBeforeDecimal(value)

    // might need to remove the minus sign
    const start = isNegative ? numDigitsBeforeDecimal + 1 : numDigitsBeforeDecimal

    // +1 to account for the dot character
    const end = start + 1 + precision
    const str = String(value).slice(0, end)

    // if input was 0.0001 and we now have 0.00 might as well just show 0
    const result = Number(str) === 0 ? '0' : str

    // if string ends with the dot character now might as well remove that also
    const lastChar = result[result.length - 1]
    const resultEndsWithDot = lastChar === "."

    return resultEndsWithDot ? result.slice(0, result.length - 1) : result
}

export function precisionRound(number: number, precision: number) {
    const factor = Math.pow(10, precision)
    return Math.round(number * factor) / factor
}

export function getPrettyNumber(value: number, precision = 2) {
    return Number(getPrettyNumericString(value, precision))
}


/** Returns how many digits there are before and after the decimal point */
function getDigitSplitLengths(value: number) {
    const x = String(value)
    const beforeDot = x.match(/\d*/)
    const afterDot = x.match(/\.\d*/)
    const beforeLength = beforeDot ? beforeDot[0].length : 0
    const afterLength = afterDot ? afterDot[0].length - 1: 0
    return [beforeLength, afterLength]
}

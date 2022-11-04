import { AssertionError } from "./errors"
import { keys } from "./object"
import type { ArrayOfMinLengthOne, Newable, NonExistant } from "./types"

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
export function Assert<T extends Newable<Error>> (condition: boolean, opt?: { Err?: T, msg?: string } | string): asserts condition is true {
    if (!condition) {
        if (isString(opt)) {
            throw new AssertionError(opt)
        }
        if (isDefined(opt?.Err)) {
            throw new Error(opt?.msg)
        }
        throw new AssertionError(opt?.msg)
    }
}

export function AssertIsString (thing: unknown, message?: string): asserts thing is string {
    Assert(isString(thing), { msg: message || `[${typeof thing}] is not a string` })
}

export function AssertIsNumber (thing: unknown, message?: string): asserts thing is number {
    Assert(isNumber(thing), { msg: message || `thing ${thing} of type ${typeof thing} is not of type number.` })
}

export function AssertIsObject (thing: unknown, message?: string): asserts thing is object {
    Assert(isObject(thing), { msg: message || `thing: ${thing} of type ${typeof thing} is not of type object.` })
}

export function AssertIsFunction (thing: unknown, message?: string): asserts thing is () => unknown {
    Assert(isFunction(thing), { msg: message || `[${typeof thing}] is not a string` })
}

export function AssertIsDefined<T> (thing: T | undefined, message?: string): asserts thing is T {
    Assert(isDefined(thing), { msg: message || `thing: ${thing} is undefined` })
}

export function AssertIsNotNull<T> (thing: T | null, message?: string): asserts thing is T {
    Assert(!isNull(thing), { msg: message || `thing: ${thing} is null` })
}
export function AssertExists<T> (thing: T | NonExistant, message?: string): asserts thing is T {
    AssertIsDefined(thing, message)
    AssertIsNotNull(thing, message)
}

export function AssertObjectNotEmpty (thing: object, message?: string): void | never {
    Assert(!isObjectEmpty(thing), { msg: message || `thing: ${thing} is empty.` })
}

export function assert (condition: boolean, message?: string): void | never {
    if (!condition) {
        throw console.error({ msg: message || `condition unsatified` })
    }
}
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export function IsString (thing: unknown, message?: string): string | never {
    AssertIsString(thing, message)
    return thing
}

export function IsFunction (thing: unknown, message?: string): CallableFunction | never {
    AssertIsFunction(thing, message)
    return thing
}

export function IsDefined<T> (thing: T | undefined, message?: string): T | never {
    AssertIsDefined(thing, message)
    return thing
}

export function IsNotNull<T> (thing: T | null, message?: string): T | never {
    AssertIsNotNull(thing, message)
    return thing
}

export function IsObject (thing: unknown, message?: string): object | never {
    AssertIsObject(thing, message)
    return thing
}

export function Exists<T> (thing: T | NonExistant, message?: string): T | never {
    AssertExists(thing, message)
    return thing
}
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const hasArrayBuffer = typeof ArrayBuffer === 'function'
export function isArrayBuffer(thing: unknown): thing is ArrayBuffer {
    return hasArrayBuffer && (thing instanceof ArrayBuffer || Object.prototype.toString.call(thing) === '[object ArrayBuffer]')
}

export function isDefined<T>(thing: T | undefined): thing is T {
    return !isUndefined(thing)
}

export function isUndefined(thing: unknown): thing is undefined {
    return thing === void 0 // safer than === undefined since undefined is a variable that can be changed...
}

export function isObjectEmpty(thing: object): boolean {
    return keys(thing).length === 0
}

export function isNotNull<T>(thing: T | null): thing is T {
    return !isNull(thing)
}

export function exists<T> (thing: T | NonExistant): thing is T {
    return isDefined(thing) && isNotNull(thing)
}

export function isNull(thing: unknown): thing is null {
    return thing === null
}

export function isObject(thing: unknown): thing is object {
    return typeof thing === "object" && !isNull(thing) // null is considered
}

export function isArray(thing: unknown): thing is Array<unknown> | ReadonlyArray<unknown> {
    return Array.isArray(thing)
}

export function isTrue(thing: unknown): thing is true {
    return thing === true
}

export function isFalse(thing: unknown): thing is false {
    return thing === false
}
export function isArrayEmpty<T>(arr: T[]) {
    return arr.length > 0
}

export function isArrayNonEmpty<T>(arr: T[]) {
    return !isArrayEmpty(arr)
}

export function isNonEmptyArray<T>(thing: unknown): thing is ArrayOfMinLengthOne<T> | Readonly<ArrayOfMinLengthOne<T>> {
    return Array.isArray(thing) && thing.length > 0
}

export function isNumber(thing: unknown): thing is number {
    return typeof thing === "number" && !isNaN(thing)
}

export function isFunction(thing: unknown): thing is typeof Function {
    return typeof thing === "function"
}

export function isString(thing: unknown): thing is string {
    return typeof thing === "string"
}

export function isKeyof<T>(key: unknown, thing: T): key is keyof T {
    return keys(thing).includes(key as Extract<keyof T, string>)
}

/**
 * Check if a value is a numeric, ie. can be interpreted as a number including numeric strings.
 *
 * @param {unknown} thing Value to check.
 * @returns {boolean} True if value is numeric.
 */
export function isNumeric(thing: unknown): thing is number | `${number}` {
    if (isNumber(thing)) {
        return true
    }
    if (isString(thing)) {
        return isStringNumber(thing)
    }
    return false
}

export function isStringNumber(thing: string): thing is `${number}` {
    return !isNaN(parseFloat(thing))
}
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

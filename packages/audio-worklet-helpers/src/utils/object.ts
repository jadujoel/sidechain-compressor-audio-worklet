
/** start https://fettblog.eu/typescript-better-object-keys/ Improving Typescript built-in definitions for Object.keys() */

export const keys = Object.keys as <T>(o: T) => (Extract<keyof T, string>)[]

export const create = Object.create as <T>(o: T) => T

export const entries = Object.entries as <T, K extends keyof T>(o: T) => [K, T[K]][]

export function hasOwnProperty<X, Y extends string> (obj: X, prop: Y): obj is X & Record<Y, unknown> {
    const has = Object.prototype.hasOwnProperty.call(obj, prop)
    return has
}

export function defineProperty<O extends object, P extends string, A extends PropertyDescriptor & ThisType<O>>(o: O, p: P, attributes: A): asserts o is ObjectWithNewProperty<O, P, A['value']> {
    Object.defineProperty(o, p, attributes) as ObjectWithNewProperty<O, P, A['value']>
}

export function getPrototypeOf<O extends { prototype: P }, P> (o: O) {
    return Object.getPrototypeOf(o) as O['prototype']
}

type ObjectWithNewProperty<O extends object, P extends string, V> = O & { [K in P]: V }

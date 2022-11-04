export const enumKeys = <O extends object, K extends keyof O = keyof O>(obj: O): K[] =>
    Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[]

export const enumValues = <O extends object, K extends keyof O = keyof O>(obj: O): O[K][] =>
    Object.values(obj)

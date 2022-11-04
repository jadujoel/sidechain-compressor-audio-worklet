export function cloneDeep<T>(source: T): T {

    const is = Array.isArray(source)
    if (is) {
        return source.map(item => cloneDeep<unknown>(item)) as unknown as T
    }
    else if (source instanceof Date) {
        return new Date(source.getTime()) as unknown as T
    }
    else if(source && typeof source === 'object') {
        return Object.getOwnPropertyNames(source).reduce((o, prop) => {
            Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop)!)
            o[prop] = cloneDeep((source as { [key: string]: any })[prop])
            return o
        }, Object.create(Object.getPrototypeOf(source)))
    }
    return source
}

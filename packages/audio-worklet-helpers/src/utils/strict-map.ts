
export class StrictMapError extends Error {
    override name = "StrictMapError"

    constructor(message?: string) {
        super(message)
    }
}

/** The strict map will throw an error if you try to get a nonexisting key */
export class StrictMap<Key, Value> {
    #map = new Map<Key, Value>()

    get(key: Key) {
        if (!this.#map.has(key)) {
            throw new StrictMapError(`Key: '${key}' does not exist.`)
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we know for sure we just checked
        return this.#map.get(key)!
    }

    set(key: Key, value: Value) {
        this.#map.set(key, value)
        return this
    }

    get [Symbol.toStringTag]() {
        return "StrictMap"
    }

    get [Symbol.iterator]() {
        return this.#map.entries()
    }

    forEach (callbackfn: (value: Value, key: Key, map: Map<Key, Value>) => void, thisArg?: any) {
        return this.#map.forEach(callbackfn, thisArg)
    }

    clear = () => this.#map.clear
    delete = (key: Key) => this.#map.delete(key)
    entries = () => this.#map.entries()
    has = (key: Key) => this.#map.has(key)
    keys = () => this.#map.keys()
    size = () => this.#map.size
    values = () => this.#map.values()
}

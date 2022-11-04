import { DeepReadonly } from "./types"

export function asWriteable<T>(thing: Readonly<T>) {
    return thing as T
}

export function asDeepWriteable<T>(thing: DeepReadonly<T>) {
    return thing as T
}

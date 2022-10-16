import { FunctionSyncLike, TryitReturnSync } from "./types"

export function trySync <F extends FunctionSyncLike<F>, E extends Error> (func: F)  {
    return (...args: Parameters<F>): TryitReturnSync<F, E> => {
        try {
            return [null, func(...args)]
        }
        catch (err) {
            return [err as E, null]
        }
    }
}

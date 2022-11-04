import type { FunctionAsyncLike, FunctionSyncLike, TryitReturnAsync, TryitReturnSync } from "./types"

export function tryAsync <F extends FunctionAsyncLike<F>, E extends Error> (func: F) {
    return async (...args: Parameters<F>): TryitReturnAsync<F, E> => {
        try {
            return [null, await func(...args)]
        }
        catch (err) {
            return [err as E, null]
        }
    }
}

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

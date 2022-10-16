
export type Keys<T> = keyof T

/* * * * * * * Utility Types * * * * * * * * * * * * */

/** Makes it possible to get autocomplete for specified strings but still allow all strings to be used*/
export type LooseAutoComplete<T extends string> = T | Omit<string, T>

export type DeepReadonly<T> =
    T extends (infer R)[] ? DeepReadonlyArray<R> :
    T extends (...args: any) => any ? T :
    T extends object ? DeepReadonlyObject<T> :
    T;

export type DeepReadonlyArray<T> = ReadonlyArray<DeepReadonly<T>>

export type DeepReadonlyObject<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
export type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };

export type Properties<T> = { [K in keyof T]: T[K] }
export type PartialProperties<T> = Partial<Properties<T>>

export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export type DeepPartialProperties<T> = DeepPartial<Properties<T>>

export type Newable<T> = { new (...args: any[]): T; }; // Make it possible to pass a class into a function

export type KeyofType = string | number | symbol

export type Values<T> = T[keyof T];

export type NonExistant = null | undefined

export type ArrayOfLengthTwo <T1, T2> = [T1, T2]
export type ArrayOfMinLengthOne<T> = [T, ...T[]]
export type ArrayOfMinLengthTwo<T> = [T, T, ...T[]]
export type SingleItemOrArrayOfLengthTwo<T> = T | [T, T]
export type DefaultParameterType<T> = T | ArrayOfMinLengthOne<SingleItemOrArrayOfLengthTwo<T>>

// eslint-disable-next-line no-use-before-define
export type AnyDimensional<T> = AnyDimensionalArray<T> // this is a recursive type
type AnyDimensionalArray<T> = Array<AnyDimensional<T> | T>


// Courtesy of the chrismilson, thank you chris. https://gist.github.com/chrismilson/e6549023bdca1fa9c263973b8f7a713b
export type Iterableify<T> = {
    [K in keyof T]: Iterable<T[K]>
}

export type FunctionAny = (...args: any[]) => any;
export type FunctionSyncLike <T extends FunctionAny> = (...args: Parameters<T>) => ReturnType<T> extends Promise<any> ? never : ReturnType<T>
export type FunctionAsyncLike <T extends FunctionAny> = (...args: Parameters<T>) => Promise<ReturnType<T> extends Promise<any> ? Awaited<ReturnType<T>> : never>

export type TryitReturnSync<F extends FunctionSyncLike<F>, E> = [E, null] | [null, ReturnType<F>]
export type TryitReturnAsync<F extends FunctionAsyncLike<F>, E> = Promise<[E, null] | [null, Awaited<ReturnType<F>>]>

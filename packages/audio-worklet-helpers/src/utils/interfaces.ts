
export interface ITypeNamed<T extends string> {
    typename: T
}

export interface Identifiable {
    id: string
}

export interface Disposable {
    dispose: () => Promise<void> | void
}

export interface Outputable<Output extends AudioNode> {
    output: Output
}

export interface Inputable<Input extends AudioNode> {
    input: Input
}

export type InputableAny = Inputable<AudioNode>

export interface Insertable<Input extends AudioNode, Output extends AudioNode> extends Inputable<Input>, Outputable<Output> {}

export type Method = (...args: any[]) => any

export interface Playable {
    play: Method,
    stop: Method
}

export type AudioParamSetter = (target: number, when: number, duration: number) => void

export interface Panable {
    pan: AudioParamSetter
}

export interface Gainable {
    gain: AudioParamSetter
}

export interface Fadeable {
    fadeIn: AudioParamSetter
    fadeOut: AudioParamSetter
}

export interface Disconnectable {
    disconnect: () => unknown
}

export interface Connectable extends Disconnectable {
    connect: (destinationNode: AudioNode) => AudioNode
}

// export interface SoundSourcable extends Playable, Panable, Gainable, Outputable<AudioNode>, Connectable {}
export interface SoundSourcable extends Playable, Outputable<AudioNode>, Connectable {}

export interface BusMethods extends Panable, Gainable, Connectable, Inputable<GainNode>, Outputable<GainNode> {}

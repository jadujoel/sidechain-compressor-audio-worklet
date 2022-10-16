import type { IProcessor } from "./types"

export function getProcessorsForContext(audioContext: BaseAudioContext & {$$processors?: Record<string, IProcessor>}): Record<string, IProcessor> {
    return audioContext.$$processors || (audioContext.$$processors = {})
}


import { trySync } from "./tryit"

export async function createAudioContext(contextOptions?: AudioContextOptions) {
    // check if we need to install polyfill and
    // Make sure audioContext has been allowed to start from user interaction
    const [, audioContext] = trySync(() => new AudioContext(contextOptions))()

    return new Promise<AudioContext>((resolve) => {
        if (audioContext?.state === "running") {
            resolve(audioContext)
            return
        }
        // if audio context was not allowed to be started we need to wait for an user interaction before we can initialize
        const oninteraction = () => {
            const audioContext = new AudioContext(contextOptions)
            window.removeEventListener("click", oninteraction)
            window.removeEventListener("touchstart", oninteraction)
            window.removeEventListener("keypress", oninteraction)
            audioContext.resume()
            resolve(audioContext)
        }

        window.addEventListener("click", oninteraction)
        window.addEventListener("keypress", oninteraction)
        window.addEventListener("touchstart", oninteraction)
    })
}

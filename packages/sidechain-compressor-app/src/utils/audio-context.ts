import { trySync } from "./tryit"

export async function createAudioContext(contextOptions?: AudioContextOptions) {
    // check if we need to install polyfill and
    // Make sure audioContext has been allowed to start from user interaction
    let [, audioContext] = trySync(() => new AudioContext(contextOptions))()

    return new Promise<AudioContext>((resolve) => {
        if (audioContext?.state === "running") {
            resolve(audioContext)
        }
        // if audio context was not allowed to be started we need to wait for an user interaction before we can initialize
        function tryToStart(){
            if (audioContext) {
                if (audioContext?.state === "running") {
                    resolve(audioContext)
                }
                else {
                    audioContext.resume()
                }
            }
            else {
                audioContext = new AudioContext(contextOptions)
                tryToStart()
            }
            setTimeout(tryToStart, 200)
        }
        tryToStart()
    })
}

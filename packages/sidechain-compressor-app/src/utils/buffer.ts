export async function getBuffer(url: URL, audioContext: AudioContext = new AudioContext()) {
    const data = await fetch(url)
    const arrayBuffer = await data.arrayBuffer()
    return audioContext.decodeAudioData(arrayBuffer)
}

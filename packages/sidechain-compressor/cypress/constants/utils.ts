export async function wait (time = 1) {
    return new Promise<void> (
        (resolve) => {
            setTimeout(() => resolve(), time * 1000)
        },
    )
}

export class AssertionError extends Error {
    override name = "AssertionError"

    constructor(message?: string) {
        super(message)
    }
}

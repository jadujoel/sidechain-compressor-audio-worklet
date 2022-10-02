import { readdir } from "fs/promises"
import { resolve } from "path"

async function getDirectories(source: string) {
    return (await readdir(source, { withFileTypes: true }))
        .filter(dirent => dirent.isDirectory())
        .map(dirent => resolve(source, dirent.name))
}

export async function getPackageDirs() {
    return [
        ...await getDirectories(resolve("packages")),
    ]
}

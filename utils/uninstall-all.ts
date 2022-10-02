#!/usr/bin/env ts-node
import { rm } from "fs"
import { resolve } from "path"
import { getPackageDirs } from "./get-package-dirs"

async function main() {
    const packages = await getPackageDirs()
    const remover = (dir: string) => {
        try {
            console.log(`removing ${dir}`)
            rm(dir, {recursive: true}, err => err)
        }
        catch {
            () => null
        }
    }

    function remove(subpath: string) {
        const paths = packages.map(pkg => resolve(pkg, subpath))
        paths.push(resolve(subpath))
        paths.forEach(remover)
    }

    remove("node_modules")
    remove("package-lock.json")
    remove("bun.lockb")
}
main()

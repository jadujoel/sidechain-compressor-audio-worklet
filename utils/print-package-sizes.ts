#!/usr/bin/env ts-node
import { statSync, type Stats } from "fs"
import { resolve } from "path"
import { getPackageDirs } from "./get-package-dirs"

function getName(dir: string) {
    return dir.match((/\w*[^/]*$/))![0]
}

async function main() {
    const packageDirs = await getPackageDirs()
    const names = packageDirs.map(dir => getName(dir))
    const dists = packageDirs.map(dir => resolve(dir, "dist", `index.js`))
    const sizes: number[] = []
    for (const file of dists) {
        let stats: Stats
        try {
            stats = statSync(file)
        }
        catch (err) {
            sizes.push(0)
            continue
        }
        sizes.push(stats.size)
    }

    const [sortedSizes, sortedNames] = bubbleSort(sizes, names)

    let total = 0
    for (const [index, name] of sortedNames.entries()) {
        const size = sortedSizes[index]!
        total += size
        console.log(`${name}: ${niceBytes(size)}, total: ${niceBytes(total)}`)
    }

    function niceBytes(bytes: number) {
        const x = String(bytes)
        const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        let l = 0, n = parseInt(x, 10) || 0
        while(n >= 1024 && ++l) {
            n = n/1024
        }
        return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l])
    }

}

function bubbleSort(array: number[], follow: string[]): [number[], string[]] {
    array = array.slice() // creates a copy of the array
    const swapper = (arr: any[], j: number) => {
        const swap = arr[j]!
        arr[j] = arr[j + 1]!
        arr[j + 1] = swap
    }

    for(const _ of array) {
        for(let j = 0; j < array.length - 1; j++) {
            if(array[j]! > array[j + 1]!) {
                swapper(array, j)
                swapper(follow, j)
            }
        }
    }
    return [array, follow]
}
main()

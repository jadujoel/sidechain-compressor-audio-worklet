#!/usr/bin/env ts-node
import * as glob from "glob"
import { readFileSync, writeFileSync} from "fs"

let version = 0
glob.sync('package.json')
    .forEach(location => {
        const buffer = readFileSync(location)
        const json = JSON.parse(buffer.toString())
        version = json.version
    })

glob.sync('./packages/**/*/package.json')
    .forEach(location =>
        writeFileSync(location, JSON.stringify({
            ...JSON.parse(readFileSync(location).toString()),
            version
        }, null, 3))
    )

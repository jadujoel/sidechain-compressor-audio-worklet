#!/usr/bin/env ts-node
import { readFileSync, unlinkSync, writeFileSync } from "fs"
import { resolve } from "path"
import { Stats, webpack } from "webpack"

const id = "SidechainCompressorProcessor" as const
const index = "index" as const
const generatedDir = resolve("src", "generated")
const processorSourceTsPath = resolve("src", "processor.ts")
const processorGeneratedJsPath = resolve(generatedDir, `${index}.js`)
const processorGeneratedTsPath = resolve(generatedDir, `${index}.ts`)

const log = (error: Error | undefined, stats: Stats | undefined) => {
    const logger = console
    if (error) {
        logger.error("[webpack error]:", error)
    }
    if (!stats) {
        logger.warn("[webpack]:", "no stats")
        return
    }
    if (stats && stats.hasWarnings()) {
        logger.warn("[webpack warnings]:", stats?.compilation.warnings)
    }
    if (stats && stats.hasErrors()) {
        logger.error("[webpack errors]:", stats?.compilation.errors)
    }
    if (!error && !stats?.hasErrors()) {
        // webpackLogger.log("[webpack]: finished with no errors.")
        // const l = stats?.compilation.getLogger("minimal")
        for (const asset of stats.compilation.assetsInfo.keys()) {
            logger.log("[webpack asset]:", asset)
        }
        for (const asset of stats.compilation.emittedAssets) {
            logger.log("[webpack emitted]: ", asset)
        }
    }
}

const packer = webpack({
    mode: "production",
    // create the generated processor.js
    entry: {
        [index]: processorSourceTsPath
    },
    output: {
        filename: "[name].js", path: generatedDir,
    },
    resolve: {
        extensions: ['.ts'],
        alias: { src: resolve("src") }
    },
    module: {
        rules: [
            {test: processorSourceTsPath, loader: 'ts-loader'},
        ]
    },
    optimization: {
        minimize: true
    },
}, log)

packer.hooks.afterEmit.tap("create-index.ts", () => {
    // create the generated index.ts
    const buffer = readFileSync(processorGeneratedJsPath)
    const str = buffer.toString()

    const ts
        = `const js = \`${str}\`\n`
        + "export const blob = new Blob([js], { type: 'application/javascript' })\n"
        + "export const url = URL.createObjectURL(blob)\n"
        + `export const id = \`${id}\` as const\n`

    writeFileSync(processorGeneratedTsPath, ts)
    unlinkSync(processorGeneratedJsPath)
})

packer.hooks.afterEmit.tap("create-dist", () => {
    webpack({
        mode: "production",
        entry: {
            index: processorGeneratedTsPath
        },
        output: {
            filename: "[name].js", path: resolve("dist"),
            libraryTarget: "amd",
            library: "[name]",
            umdNamedDefine: true,
            globalObject: "this",
        },
        resolve: {
            extensions: ['.ts'],
            alias: { src: resolve("src") }
        },
        module: {
            rules: [
                {test: processorGeneratedTsPath, loader: 'ts-loader'},
            ]
        },
        devtool: "source-map",
        optimization: {
            minimize: true
        },
    }, log)
})

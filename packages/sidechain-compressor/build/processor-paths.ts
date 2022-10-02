import { resolve } from "path"
export const processorName = "processor" as const
export const outputPath = resolve("src", "__generated")
export const processorTsPath = resolve("src", `${processorName}.ts`)
export const processorJsPath = resolve(outputPath, `${processorName}.js`)
export const processorUrlPath = resolve(outputPath, `${processorName}-url.ts`)
console.log({processorName, processorJsPath, processorTsPath, processorUrlPath})

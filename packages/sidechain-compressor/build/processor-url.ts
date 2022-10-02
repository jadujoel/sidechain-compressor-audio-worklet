#!/usr/bin/env ts-node
import { readFileSync, unlinkSync, writeFileSync } from "fs"
import { processorJsPath, processorUrlPath } from "./processor-paths"

const buffer = readFileSync(processorJsPath)
const str = buffer.toString()

const ts = `
const js = \`${str}\`
export const blob = new Blob([js], { type: 'application/javascript' })
export const url = URL.createObjectURL(blob)
`
writeFileSync(processorUrlPath, ts)
unlinkSync(processorJsPath)

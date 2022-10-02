import { resolve } from "path"
import { Configuration } from "webpack"
import { outputPath, processorName, processorTsPath } from "./processor-paths"

const config: Configuration = {
    entry: {
        [processorName]: processorTsPath
    },
    output: {
        filename: "[name].js", path: outputPath,
    },
    resolve: {
        extensions: ['.ts'],
        alias: { src: resolve("src") }
    },
    module: {
        rules: [
            // {test: /\.ts?$/, loader: 'ts-loader'},
            {test: processorTsPath, loader: 'ts-loader'},
            // {test: `${processorName}.ts`, loader: 'ts-loader'},
        ]
    },
    optimization: {
        minimize: true
    },
}
export default config

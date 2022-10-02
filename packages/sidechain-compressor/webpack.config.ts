import { resolve } from "path"
import { Configuration } from "webpack"

const config: Configuration = {
    entry: {
        index: resolve("src", "index.ts"),
    },
    output: {
        filename: '[name].js',
        path: resolve('dist'),
        libraryTarget: "umd",
        // libraryTarget: "commonjs",
        library: "sidechain-compressor",
        umdNamedDefine: true,
        globalObject: "this",
    },
    devtool: "source-map",
    resolve: {
        extensions: ['.ts'],
        alias: { src: resolve("src") }
    },
    module: {
        rules: [
            {test: /\.tsx?$/, loader: 'ts-loader'},
        ]
    },
    optimization: {
        minimize: false
    },
}

export default config

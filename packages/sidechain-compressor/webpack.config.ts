import { resolve } from "path"
import { Configuration } from "webpack"

const config: Configuration = {
    entry: {
        "sidechain-compressor": resolve("src", "sidechain-compressor.ts"),
        // "processor": resolve("src", "processor.ts")
    },
    output: {
        filename: '[name].js',
        path: resolve('dist'),
        // libraryTarget: "amd",
        // library: "sidechain-compressor",
        // umdNamedDefine: true,
        // globalObject: "this",
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
    plugins: [
        // creates the processor.js that we import as a blob and create a url out of
        // new ExecWebpackPlugin({before: "npm run build:processor"}),
    ],
    optimization: {
        minimize: true
    },
}

export default config

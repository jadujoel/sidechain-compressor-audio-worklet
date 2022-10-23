import CopyWebpackPlugin from "copy-webpack-plugin"
import { resolve } from "path"
import { Configuration } from "webpack"
const config: Configuration = {
  entry: {
    index: resolve("src", "index.ts"),
    'audio-worklet-polyfill/index': resolve("src", "audio-worklet-polyfill/index"),
  },
  output: {
    filename: '[name].js',
    path: resolve('dist'),
    libraryTarget: "umd",
    library: "audio-worklet-helpers",
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
    minimize: true
  },
  plugins: [
    new CopyWebpackPlugin({patterns: [
      {from: resolve("src", "declarations"), to: resolve("dist", "declarations")}
    ]})
  ]
}

export default config

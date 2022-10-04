
import webpackPreprocessor from '@cypress/webpack-preprocessor'
import {resolve } from "path"

const webpackOptions = {
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@src': resolve(resolve(), '../../src')
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    }
}

const options = {
    webpackOptions
}
export const cypressTypeScriptPreprocessor = webpackPreprocessor(options)

# sidechain-compressor-audio-worklet
A Sidechainable Compressor built on the WebAudio Audio Worklet API

## Quickstart
clone this repo
```
cd sidechain-compressor-audio-worklet
npm install
npm run build
npm run dev
```

# Packages
- app
    - contains a react app that is published to https://jadujoel.github.io/sidechain-compressor-audio-worklet/
- sidechain-compressor
    - An abstraction that loads and interfaces with the sidechain-compressor-processor
- sidechain-compressor-processor
    - The AudioWorkletProcessor that does the actual audio processing.
- audio-worklet-helpers
    - mainly polyfills so that we can have a unified WebAudio implementation and still have it work on older devices.
- audio-worklet-processor-types
    - Contains typescript types that are missing from the default ones in node/vscode

# Continous Integration
Uses Commitizen for commits, run `git commit` and follow the cli instructions.


[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

to use, either do
```js
import "audio-worklet-helpers/dist/audio-worklet-polyfill"
```
to install directly

or do
```js
import {audioWorkletPolyfill} from "audio-worklet-helpers"
// install even in polyfill is not needed, otherwise will only install if audioworklet is not available
const forceInstall = true
audioWorkletPolyfill(forceInstall)
```
to install at a certain point in your program

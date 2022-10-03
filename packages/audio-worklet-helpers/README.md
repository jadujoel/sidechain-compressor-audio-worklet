

Add to your tsconfig to get access to the missing typings for this part of the WebAudio API
```json
{
  "include": ["../audio-worklet-helpers/dist/declarations/AudioWorkletProcessor.d.ts"],
}
```
change the "../" part to whatever your relative path may be

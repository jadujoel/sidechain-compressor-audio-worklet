

Add to your tsconfig to get access to the missing typings for this part of the WebAudio API
```json
{
  "include": ["../audio-worklet-processor-types/AudioWorkletProcessor.d.ts"],
}
```
change the "../" part to whatever your relative path may be

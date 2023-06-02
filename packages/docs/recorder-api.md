---
outline: deep
---

# Recorder API Examples

本页是介绍`@pear-rec/recorder` 插件的`API`例子

本插件提供了录屏、录音和录像功能。

## 安装

```js
import { audio, video, screen } from "@pear-rec/recorder";
```

## 功能

### 录屏

```js
const screen = mediajs.screen();
screen.create();
```

### 录音

```js
const audio = mediajs.audio();
audio.create();
```

### 录像

```javascript
const video = mediajs.video();
video.create();
```

## SoundMeter

```javascript
soundMeter.prototype = {
  // return recording instant value
  getInstant: function () {},

  // return recording slow value
  getSlow: function () {},

  // return recording clip value
  getClip: function () {},
};
```

## Function

```javascript
mediajs.prototype = {
  // create the recording
  create: async function () {},

  // destroy the recording
  destroy: function () {},

  // start the recording
  start: function () {},

  // stop the recording
  stop: function () {},

  // pause the recording
  pause: function () {},

  // resume the recording
  resume: function () {},

  // return recorded Blob
  getBlob: function () {},

  // download recorded Blob
  downloadBlob: function (filename) {},

  // return recorded Blob-Url
  getBlobUrl: function () {},

  // return recorded duration (ms)
  getDuration: function () {},

  // return media state ("inactive" | "wait" | "ready")
  getMediaState: function () {},

  // return media type ("audio" | "video" | "screen")
  getMediaType: function () {},

  // return media stream
  getMedisStream: function () {},

  // return Recorder state ("inactive" | "paused" | "recording")
  getRecorderState: function () {},

  // return SoundMeter
  getSoundMeter: function () {},

  // return timeSlice (ms)
  getTimeSlice: function () {},

  // return boolean, which is true if media state is ready
  isReady: function () {},

  // return a list of the available media input and output devices
  _enumerateDevices: async function () {},

  // returns a Boolean which is true if the MIME type specified is one the user agent should be able to successfully record.
  _isTypeSupported: function (mimeType) {},
};
```

## Callback Function

```javascript
media
  .onerror((err) => {
    console.log(err);
  })
  .oncreate(() => {
    const stream = audio.getMedisStream();
    console.log(stream);
  })
  .ondestroy(() => {
    console.log("destroy");
  })
  .onstart(() => {
    console.log("start");
  })
  .onstop(() => {
    console.log("stop");
  })
  .onpause(() => {
    console.log("pause");
  })
  .onresume(() => {
    console.log("resume");
  })
  .ondataavailable(() => {
    console.log("dataavailable");
  });
```

## Configuration

**audio:**

```javascript
{
  audio: boolean | MediaTrackConstraints;
  mimeType: string;
  audioBitsPerSecond: number;
  sampleRate: number;
  timeSlice: number;
  echoCancellation: boolean;
}
```

**video and screen:**

```javascript
{
  audio: boolean | MediaTrackConstraints;

  video: boolean | MediaTrackConstraints;

  // audio/webm
  // audio/webm;codecs=pcm
  // video/mp4
  // video/webm;codecs=vp9
  // video/webm;codecs=vp8
  // video/webm;codecs=h264
  // video/x-matroska;codecs=avc1
  // video/mpeg -- NOT supported by any browser, yet
  // audio/wav
  // audio/ogg  -- ONLY Firefox
  mimeType: string;

  // only for audio track
  // ignored when codecs=pcm
  audioBitsPerSecond: number;

  // used by StereoAudioRecorder
  // the range 22050 to 96000.
  sampleRate: number;

  // get intervals based blobs, value in milliseconds
  timeSlice: number;

  // Echo cancellation
  echoCancellation: boolean;

  // only for video track
  videoBitsPerSecond: number;
  width: number;
  height: number;
  pan: boolean;
  tilt: boolean;
  zoom: boolean;
}
```

## Env APIs

```javascript
mediajs.Env = {
	isIOS: boolean,
	minChromeVersion: number,
	minFirefoxVersion: number,
	minSafariVersion: number,
	supportedBrowsers: array,
    prototype = {
        getBrowser: function() {},
        getVersion: function() {},
        isAudioContextSupported: function() {},
        isAudioWorkletNode: function() {},
        isBrowserSupported: function() {},
        isGetUserMediaSupported: function() {},
        isMediaDevicesSupported: function() {},
        isMediaRecorderSupported: function() {},
        isUnifiedPlanSupported: function() {},
        toString: function() {},
    }
};
```

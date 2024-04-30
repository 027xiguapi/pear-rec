<p align="center">
  <img src="https://027xiguapi.github.io/pear-rec/logo.png"  height="120">
  <h1 align="center">pear-rec</h1>
</p>
<p align="center">
<img src="https://img.shields.io/github/stars/027xiguapi/pear-rec" alt="stars">
<img src="https://img.shields.io/badge/react-v18-blue" alt="react">
<img src="https://img.shields.io/badge/electron-v26-blue" alt="electron">
<img src="https://img.shields.io/badge/nestjs-v3-blue" alt="nestjs">
<img src="https://img.shields.io/badge/-TypeScript-blue?logo=typescript&logoColor=white" alt="typescript">
<img src="https://img.shields.io/badge/-Vite-blue?logo=vite&logoColor=white" alt="vite">
</p>

---

## README

[中文](README.zh-CN.md) | [English](README.md) | [Deutsch](README.de-DE.md)

## 📖 Documentation

> pear-rec(pear rec) is a free and open-source cross-Platform screenshot, screen recording, audio recording, and video recording software.
>
> pear-rec(pear rec) is a project based on react + electron + vite + viewerjs + plyr + aplayer + react-screenshots + webav.
>
> More functions and APIs can be found on [the official website(https://027xiguapi.github.io/pear-rec)](https://027xiguapi.github.io/pear-rec) or [https://xiguapi027.gitee.io/pear-rec](https://xiguapi027.gitee.io/pear-rec).

## 🧱 Frameworks

<img src="https://027xiguapi.github.io/pear-rec/imgs/webav.png" />

The cross-Platform of `pear-rec` is based on `electronjs`, and the front-end is based on `reactjs`. The functions of screenshot, screen recording, recording, recording (dynamic image) gif are a project based on `webrtc` and `webcodecs`.

## 🖖 Vue

Screenshot implemented by community personnel based on `vue` 👉 [electron-screenshort](https://github.com/yejimeiming/electron-screenshort).

## 🌰 Example

[web pages](https://pear-rec-xiguapi.vercel.app/)

## 🧲 Repository

> gitee: https://gitee.com/xiguapi027/pear-rec
>
> github: https://github.com/027xiguapi/pear-rec

## 🔨 Usage

### Getting Started

To clone and run this repository you'll need [Git](https://git-scm.com) , [Node.js](https://nodejs.org/en/download/) (which comes with [npm](https://www.npmjs.com/)) and [pnpm](https://pnpm.io/) installed on your computer. From your command line:

```shell
# Clone this repository
git clone https://github.com/027xiguapi/pear-rec.git
# Go into the repository
cd pear-rec
# Install dependencies
pnpm install
# Run the web
pnpm run dev:web
# Run the server
pnpm run dev:server
# Run the desktop
pnpm run dev:desktop
# Run the web
pnpm run start:web
# Run the desktop
pnpm run start:desktop
# Build the web
pnpm run build:web
# Build the desktop
pnpm run build:desktop
# Clear node_modules
pnpm run clear
```

## 🥰 Functions

<center>
  <img src="https://027xiguapi.github.io/pear-rec/assets/home.7d9162cb.jpg" />
</center>

Features that have been ticked are the latest in the development process but may not have been released in the latest version

- [x] gif(gif.js)
  - [x] record
  - [x] edit
- [x] Screenshot(react-screenshots)
  - [x] Frame crop
  - [x] Resizable frame position
  - [x] Colour picker
  - [x] Magnifying glass
  - [x] Brush (freehand brush)
  - [x] Geometric shapes (border fill support adjustment)
  - [x] Advanced palette settings
  - [x] Image filters (local mosaic blur and colour adjustment supported)
  - [x] Customize what happens when the frame is released
  - [x] Map search by map
  - [x] QR code recognition
  - [x] Quick full screen capture to clipboard or custom directory
  - [x] Screenshot history
  - [ ] Window and control selection (using OpenCV edge recognition)
  - [ ] Long screen capture
  - [ ] Multi-screen
- [x] Record screen(WebRTC)
  - [x] Recording full screen
  - [x] Screenshot
  - [x] Customize size
  - [x] Mute
  - [ ] Key prompt
  - [ ] Cursor Location Tips
  - [ ] Recorder bar
  - [ ] Stream Write
- [x] Record audio(WebRTC)
  - [x] Setting
  - [x] Watch audio
  - [x] Download audio
  - [ ] Edit audio
- [x] Record video(WebRTC)
  - [ ] Custom bit rate
- [x] Picture Preview(viewerjs)
  - [x] Zoom in
  - [x] Zoom out
  - [x] Drag
  - [x] Flip
  - [x] Pin
  - [x] Watch local image
  - [x] Download
  - [x] Print
  - [ ] ocr
  - [x] Watch list
  - [x] Map search by map
  - [x] QR code recognition
- [x] edit image(tui-image-editor)
- [x] Video Preview(plyr)
- [x] Audio Previews(aplayer)
- [x] setting
  - [x] user uuid
  - [x] Save address
  - [x] Self-starting
  - [x] internationalization(zh,en,de)

## 🌍 Internationalization(I18n)

- [x] Chinese
- [x] English
- [x] German

## 👇 Download

| OS | Windows | Linux | Macos |
| --- | --- | --- | --- |
| Link | [Download](https://github.com/027xiguapi/pear-rec/releases) | [Download](https://github.com/027xiguapi/pear-rec/releases) | [Download](https://github.com/027xiguapi/pear-rec/releases) |

## 👨‍👨‍👦‍👦 Feedback

We recommend that [issue](https://github.com/027xiguapi/pear-rec/issues) be used for problem feedback.

## 🤝 License

[pear-rec is available under the Apache License V2.](LICENSE)

[Open source etiquette](https://developer.mozilla.org/en-US/docs/MDN/Community/Open_source_etiquette)

<p align="center">
  <img src="https://027xiguapi.github.io/pear-rec/logo.png"  height="120"  />
  <h1>pear-rec</h1>
  <p>
    <img src="https://img.shields.io/github/stars/027xiguapi/pear-rec" alt="stars">
    <img src="https://img.shields.io/badge/react-v18-blue" alt="react">
    <img src="https://img.shields.io/badge/electron-v26-blue" alt="react">
    <img src="https://img.shields.io/badge/express-v4-blue" alt="react">
    <img src="https://img.shields.io/badge/-TypeScript-blue?logo=typescript&logoColor=white" alt="typescript">
    <img src="https://img.shields.io/badge/-Vite-646cff?logo=vite&logoColor=white" alt="vite">
  </p>
</p>

---

## README

[中文](README.zh-CN.md) | [English](README.md) | [Deutsch](README.de-DE.md)

## 架构

<center>
  <img src="https://027xiguapi.github.io/pear-rec/imgs/1700442414996.jpg" />
</center>

## 简介

> pear-rec(梨子 rec) 是一个跨平台的截图、录屏、录音、录像软件。
>
> pear-rec(pear rec) 是基于 react + electron + vite + viewerjs + plyr + aplayer + react-screenshots 的一个项目。
>
> 更多功能和 api 可以查看[官网(https://027xiguapi.github.io/pear-rec)](https://027xiguapi.github.io/pear-rec) 或 [https://xiguapi027.gitee.io/pear-rec](https://xiguapi027.gitee.io/pear-rec)

## 例子

[网页](https://pear-rec-xiguapi.vercel.app/)

## 下载地址

```
gitee: https://gitee.com/xiguapi027/pear-rec
github: https://github.com/027xiguapi/pear-rec
```

## 源码运行&编译

编译需要`nodejs`和`pnpm`环境

### 测试环境

```
nodejs: 18
pnpm: 8
```

### 开始

```shell
# 拷贝代码
git clone https://gitee.com/xiguapi027/pear-rec.git
# 进入项目
cd pear-rec
# 安装依赖
pnpm install
# 重新打包 electron
pnpm run rebuild:desktop
# 调试页面
pnpm run dev:web
# 编译页面
pnpm run build:web
# 查看页面
pnpm run preview:web
# 调试服务
pnpm run dev:server
# 调试
pnpm run dev:desktop
# 编译
pnpm run build:desktop
```

## 功能

已经勾选的功能是开发过程最新功能，但可能还没发布在最新版本

- [x] 截屏(react-screenshots)
  - [x] 框选裁切
  - [x] 框选大小位置可调整
  - [x] 取色器
  - [x] 放大镜
  - [x] 画笔（自由画笔）
  - [x] 几何形状（边框填充支持调节）
  - [x] 高级画板设置
  - [x] 图像滤镜（支持局部马赛克模糊和色彩调节）
  - [x] 自定义框选松开后的操作
  - [x] 以图搜图
  - [x] 扫描二维码
  - [ ] 快速截取全屏到剪贴板或自定义的目录
  - [ ] 截屏历史记录
  - [ ] 窗口和控件选择（使用 OpenCV 边缘识别）
  - [ ] 长截屏
  - [ ] 多屏幕
- [x] 录屏(WebRTC)
  - [x] 录制全屏
  - [x] 截图
  - [x] 自定义大小
  - [x] 静音
  - [ ] 按键提示
  - [ ] 光标位置提示
  - [ ] 录制栏
  - [ ] 流写入
- [x] 录音(WebRTC)
  - [x] 录音设置
  - [x] 查看录音
  - [x] 下载录音
  - [ ] 编辑录音
- [x] 录像
  - [ ] 自定义比特率
- [x] 图片预览(viewerjs)
  - [x] 放大
  - [x] 缩小
  - [x] 拖拽
  - [x] 翻转
  - [x] 钉上层
  - [x] 查看
  - [x] 下载
  - [x] 打印
  - [ ] ocr
  - [x] 查看列表
  - [x] 以图搜图
  - [x] 扫描二维码
- [x] 图片编辑(tui-image-editor)
- [x] 视频预览(plyr)
- [x] 音频预览(aplayer)
- [x] 基本设置
  - [x] 用户 uuid
  - [x] 保存地址
  - [x] 开机自启动
  - [x] 国际化(中、英、德)
  - [x] 服务设置
  - [ ] 快捷键设置
  - [ ] 重置设置

## 国际化(I18n)

- [x] 简体中文
- [x] 英语
- [x] 德语

## 测试

| 系统 | Windows | Linux | Macos |
| ---- | ------- | ----- | ----- |
| 测试 | 🟢      | ◯     | ◯     |

## Download

| 系统 | Windows | Linux | Macos |
| --- | --- | --- | --- |
| 链接 | [下载](https://github.com/027xiguapi/pear-rec/releases/download/1.0.0-alpha/pear-rec_1.0.0-alpha.exe) | ◯ | ◯ |

国内可以用 [GitHub Proxy](https://ghproxy.com/) 加速下载

## 反馈和交流

我们推荐使用 [issue](https://github.com/027xiguapi/pear-rec/issues) 列表进行最直接有效的反馈，也可以下面的方式

- qq 群

<p align="center">
  <img src="https://027xiguapi.github.io/pear-rec/imgs/pear-rec_qq_qrcode.png" />
</p>

## 开源协议

[pear-rec(梨子 rec) 可在 Apache License V2 下使用。](LICENSE)

[开源项目礼节](https://developer.mozilla.org/zh-CN/docs/MDN/Community/Open_source_etiquette)

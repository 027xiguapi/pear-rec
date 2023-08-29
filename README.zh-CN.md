<p align="center">
  <img src="https://027xiguapi.github.io/pear-rec/logo.png"  height="120"  />
</p>

# pear-rec

(中文 | [English](README.md))

## 简介

> pear-rec 是一个跨平台的截图、录屏、录音、录像软件。
>
> 更多功能和 api 可以查看[官网](https://027xiguapi.github.io/pear-rec)

## 下载地址

```
gitee: https://gitee.com/xiguapi027/pear-rec
github: https://github.com/027xiguapi/pear-rec
```

## 源码运行&编译

编译需要`nodejs`和`pnpmp`环境

### 测试环境

```
nodejs: 18
pnpmp: 8
```

### 开始

```shell
# 拷贝代码
git clone https://gitee.com/xiguapi027/pear-rec.git
# 进入项目
cd pear-rec
# 安装依赖
pnpm install
# 打包依赖
pnpm run build:packages
# 重新打包 electron
pnpm run rebuild:desktop
# 调试
pnpm run dev:desktop
# 编译
pnpm run build:desktop
```

## 功能

已经勾选的功能是开发过程最新功能，但可能还没发布在最新版本

- [x] 截屏(react-screenshots)
  - [x] 基本实现
  - [x] 框选裁切
  - [x] 框选大小位置可调整
  - [x] 取色器
  - [x] 放大镜
  - [x] 画笔（自由画笔）
  - [x] 几何形状（边框填充支持调节）
  - [ ] 高级画板设置（使用 Fabric.js 的 api）
  - [ ] 图像滤镜（支持局部马赛克模糊和色彩调节）
  - [ ] 自定义框选松开后的操作
  - [ ] 快速截取全屏到剪贴板或自定义的目录
  - [ ] 截屏历史记录
  - [ ] 窗口和控件选择（使用 OpenCV 边缘识别）
  - [ ] 长截屏
  - [ ] 多屏幕
- [x] 录屏(ffmpeg)
  - [x] 录制全屏
  - [x] 截图
  - [x] 自定义大小
  - [ ] 按键提示
  - [ ] 光标位置提示
  - [ ] 录制栏
  - [ ] 流写入
- [x] 录音
- [x] 录像
  - [ ] 自定义比特率
- [x] 图片预览(viewerjs)
  - [x] 放大
  - [x] 缩小
  - [x] 拖拽
  - [x] 翻转
  - [x] 钉上层
  - [ ] 查看
  - [x] 下载
  - [x] 打印
  - [ ] ocr
  - [x] 查看列表
- [ ] 图片编辑
- [x] 视频预览(plyr)
- [x] 音频预览(aplayer)
- [x] 基本设置
  - [x] 用户 uuid
  - [x] 保存地址
  - [x] 开机自启动

## 国际化

- [x] 简体中文

## 测试

Windows10 测试通过

## 反馈和交流

- qq 群

<p align="center">
  <img src="https://027xiguapi.github.io/pear-rec/imgs/pear-rec_qq_qrcode.png" />
</p>

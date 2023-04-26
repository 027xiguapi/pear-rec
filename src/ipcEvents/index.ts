export enum IpcEvents {
  // 设置title
  EV_SET_TITLE = "ev:set-title",

  // 设置复制
  EV_SET_CLIPBOARD = "ev:set-clipboard",

  // 打开关闭截图窗口
  EV_OPEN_SHOT_SCREEN_WIN = "ev:open-shot-screen-win",
  EV_CLOSE_SHOT_SCREEN_WIN = "ev:close-shot-screen-win",

  // 获取窗口设备窗口
  EV_SEND_DESKTOP_CAPTURER_SOURCE = "ev:send-desktop-capturer_source",
  EV_SEND_DESKTOP_CAPTURER_IMAGE = "ev:send-desktop-capturer_image",
}
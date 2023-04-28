export enum IpcEvents {
	// 设置title
	EV_SET_TITLE = "ev:set-title",

	// 设置复制
	EV_SET_CLIPBOARD = "ev:set-clipboard",

	// 打开关闭主窗口
	EV_OPEN_MAIN_WIN = "ev:open-main-win",
	EV_HIDE_MAIN_WIN = "ev:hide-main-win",
	EV_CLOSE_MAIN_WIN = "ev:close-main-win",

	// 打开关闭录屏窗口
	EV_OPEN_RECORDER_SCREEN_WIN = "ev:open-recorder-screen-win",
	EV_CLOSE_RECORDER_SCREEN_WIN = "ev:close-recorder-screen-win",

	// 打开关闭录屏窗口
	EV_OPEN_SHOT_SCREEN_WIN = "ev:open-shot-screen-win",
	EV_CLOSE_SHOT_SCREEN_WIN = "ev:close-shot-screen-win",

	// 获取窗口设备窗口
	EV_SEND_DESKTOP_CAPTURER_SOURCE = "ev:send-desktop-capturer_source",
	EV_SEND_DESKTOP_CAPTURER_IMAGE = "ev:send-desktop-capturer_image",

	// 获取窗口设备窗口
	EV_GET_ALL_DESKTOP_CAPTURER_SOURCE = "ev:get-desktop-capturer_source",
}

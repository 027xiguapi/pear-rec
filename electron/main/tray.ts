import { Menu, Tray, app } from "electron";
import { join } from "node:path";
import { PUBLIC } from "./utils";
import { showMainWin } from "./mainWin";
import { openShotScreenWin } from "./shotScreenWin";
import { openRecorderScreenWin } from "./recorderScreenWin";
import { openViewImageWin } from "./viewImageWin";
import { openViewVideoWin } from "./viewVideoWin";

export function initTray() {
	let appIcon = new Tray(join(PUBLIC, "logo@2x.ico"));
	const contextMenu = Menu.buildFromTemplate([
		{
			label: "截图",
			click: () => {
				openShotScreenWin();
			},
		},
		{
			label: "录屏",
			click: () => {
				openRecorderScreenWin();
			},
		},
		{
			label: "录音",
			click: () => {},
		},
		{
			label: "录像",
			click: () => {},
		},
		{
			type: "separator",
		},
		{
			label: "查看图片",
			click: () => {
				openViewImageWin();
			},
		},
		{
			label: "查看视频",
			click: () => {
				openViewVideoWin();
			},
		},
		{
			type: "separator",
		},
		{
			label: "开机自启动",
			type: "checkbox",
			checked: true,
			click: (i) => {
				app.setLoginItemSettings({ openAtLogin: i.checked });
			},
		},
		{
			type: "separator",
		},
		{
			label: "主页面",
			click: () => {
				showMainWin();
			},
		},
		{
			label: "设置",
			click: () => {
				openViewImageWin();
			},
		},
		{
			label: "教程帮助",
			click: () => {
				// create_main_window("help.html");
			},
		},
		{
			type: "separator",
		},
		{
			label: "重启",
			click: () => {
				app.relaunch();
				app.exit(0);
			},
		},
		{
			label: "退出",
			click: () => {
				app.quit();
			},
		},
	]);
	appIcon.setToolTip("梨子REC");
	appIcon.setContextMenu(contextMenu);

	appIcon.addListener("click", function () {
		showMainWin();
	});

	return appIcon;
}

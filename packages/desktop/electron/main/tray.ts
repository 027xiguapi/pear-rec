import { Menu, Tray, app, shell } from "electron";
import { join } from "node:path";
import { ICON } from "./contract";
import { showMainWin } from "../win/mainWin";
import { openShotScreenWin } from "../win/shotScreenWin";
import { openClipScreenWin } from "../win/clipScreenWin";
import { openRecorderAudioWin } from "../win/recorderAudioWin";
import { openRecorderVideoWin } from "../win/recorderVideoWin";
import { openViewImageWin } from "../win/viewImageWin";
import { openViewVideoWin } from "../win/viewVideoWin";
import { openSettingWin } from "../win/settingWin";

export function initTray() {
	let appIcon = new Tray(ICON);
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
				openClipScreenWin();
			},
		},
		{
			label: "录音",
			click: () => {
				openRecorderAudioWin();
			},
		},
		{
			label: "录像",
			click: () => {
				openRecorderVideoWin();
			},
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
		// {
		// 	type: "separator",
		// },
		// {
		// 	label: "开机自启动",
		// 	type: "checkbox",
		// 	checked: true,
		// 	click: (i) => {
		// 		app.setLoginItemSettings({ openAtLogin: i.checked });
		// 	},
		// },
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
				openSettingWin();
			},
		},
		{
			label: "教程帮助",
			click: () => {
				shell.openExternal("https://027xiguapi.github.io/pear-rec/");
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

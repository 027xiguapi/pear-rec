import { Menu, Tray } from "electron";
import { join } from "node:path";
import { app } from "./index";
import { PUBLIC } from "./utils";
import { showMainWin } from "./mainWin";

export function initTray() {
	let appIcon = new Tray(join(PUBLIC, "logo@2x.ico"));
	const contextMenu = Menu.buildFromTemplate([
		{
			label: "自动识别",
			click: () => {
				// auto_open();
			},
		},
		{
			label: "截屏搜索",
			click: () => {
				// setTimeout(() => {
				// 	full_screen();
				// }, store.get("主搜索功能.截屏搜索延迟"));
			},
		},
		{
			label: "选中搜索",
			click: () => {},
		},
		{
			label: "剪贴板搜索",
			click: () => {},
		},
		{
			type: "separator",
		},
		{
			label: "OCR(文字识别)",
			click: () => {
				// let x = capture_all();
				// clip_window.webContents.send("reflash", x, null, null, "ocr");
				// x = null;
			},
		},
		{
			label: "以图搜图",
			click: () => {
				// let x = capture_all();
				// clip_window.webContents.send("reflash", x, null, null, "image_search");
				// x = null;
			},
		},
		{
			type: "separator",
		},
		{
			label: "浏览器打开",
			type: "checkbox",
			checked: true,
			click: (i) => {
				// store.set("浏览器中打开", i.checked);
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
				// Store.initRenderer();
				// create_main_window("setting.html");
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

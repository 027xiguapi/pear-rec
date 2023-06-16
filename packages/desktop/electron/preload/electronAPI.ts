import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
	setTitle: (title: any) => ipcRenderer.send("set-title", title),

	// mainWin
	sendMaMinimizeWin: () => ipcRenderer.send("ma:minimize-win"),
	sendMaHideWin: () => ipcRenderer.send("ma:hide-win"),
	sendMaOpenWin: () => ipcRenderer.send("ma:open-win"),

	//raWin
	sendRaOpenWin: () => ipcRenderer.send("ra:open-win"),
	sendRaDownloadRecord: (url: string) =>
		ipcRenderer.send("ra:download-record", url),

	//rsWin
	sendRsOpenWin: () => ipcRenderer.send("rs:open-win"),
	sendRsCloseWin: () => ipcRenderer.send("rs:close-win"),
	sendRsHideWin: () => ipcRenderer.send("rs:hide-win"),
	sendRsMinimizeWin: () => ipcRenderer.send("rs:minimize-win"),
	sendRsDownloadRecord: (url: string) =>
		ipcRenderer.send("rs:download-record", url),
	sendRsStartRecord: () => ipcRenderer.send("rs:start-record"),
	sendRsPauseRecord: () => ipcRenderer.send("rs:pause-record"),

	//rvWin
	sendRvOpenWin: () => ipcRenderer.send("rv:open-win"),
	sendRvDownloadRecord: (url: string) =>
		ipcRenderer.send("rv:download-record", url),

	//ssWin
	sendSsOpenWin: () => ipcRenderer.send("ss:open-win"),
	sendSsCloseWin: () => ipcRenderer.send("ss:close-win"),
	invokeSsGetShotScreenImg: () => ipcRenderer.invoke("ss:get-shot-screen-img"),
	sendSsDownloadImg: (url: string) => ipcRenderer.send("ss:download-img", url),
	sendSsSaveImg: (url: string) => ipcRenderer.send("ss:download-img", url),

	//viWin
	sendViOpenWin: (search?: any) => ipcRenderer.send("vi:open-win", search),
	invokeViGetImgs: () => ipcRenderer.invoke("vi:get-imgs", "选择图片"),
	invokeViSetAlwaysOnTop: (isAlwaysOnTop: boolean) =>
		ipcRenderer.send("vi:set-always-on-top", isAlwaysOnTop),
	invokeViSetImg: () => ipcRenderer.invoke("vi:set-img"),

	//vvWin
	sendVvOpenWin: (search?: any) => ipcRenderer.send("vv:open-win", search),
	invokeVvSetVideo: () => ipcRenderer.invoke("vv:set-video"),
	invokeVvGetVideo: () => ipcRenderer.invoke("vv:get-video"),

	//seWin
	sendSeOpenWin: () => ipcRenderer.send("se:open-win"),
	invokeSeGetUser: () => ipcRenderer.invoke("se:get-user"),
	invokeSeSetFilePath: () => ipcRenderer.invoke("se:set-filePath"),
	invokeSeGetFilePath: () => ipcRenderer.invoke("se:get-filePath"),
	sendSeSetOpenAtLogin: (isOpen: boolean) =>
		ipcRenderer.send("se:set-openAtLogin", isOpen),
	invokeSeGetOpenAtLogin: () => ipcRenderer.invoke("se:get-openAtLogin"),
});

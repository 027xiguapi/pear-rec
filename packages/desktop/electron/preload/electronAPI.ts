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
  sendRsStopRecord: () => ipcRenderer.send("rs:stop-record"),
  invokeRsPauseRecord: () => ipcRenderer.invoke("rs:close-record"),
  invokeRsGetDesktopCapturerSource: () => {
    return ipcRenderer.invoke("rs:get-desktop-capturer-source");
  },
  invokeRsGetCursorScreenPoint: () =>
    ipcRenderer.invoke("rs:get-cursor-screen-point"),
  invokeRsIsFocused: () => ipcRenderer.invoke("rs:is-focused"),
  sendRsFocus: () => ipcRenderer.send("rs:focus"),
  sendRsShotScreen: () => ipcRenderer.send("rs:shotScreen"),
  sendRsSetIgnoreMouseEvents: (ignore: boolean, options: any) => {
    ipcRenderer.send("rs:set-ignore-mouse-events", ignore, options);
  },
  handleRsGetSizeClipWin: (callback: any) =>
    ipcRenderer.on("rs:get-size-clip-win", callback),

  //csWin
  sendCsOpenWin: () => ipcRenderer.send("cs:open-win"),
  sendCsCloseWin: () => ipcRenderer.send("cs:close-win"),
  sendCsHideWin: () => ipcRenderer.send("cs:hide-win"),
  sendCsMinimizeWin: () => ipcRenderer.send("cs:minimize-win"),
  sendCsSetIgnoreMouseEvents: (ignore: boolean, options: any) => {
    ipcRenderer.send("cs:set-ignore-mouse-events", ignore, options);
  },
  invokeCsGetBounds: () => ipcRenderer.invoke("cs:get-bounds"),
  handleCsSetIsPlay: (callback: any) =>
    ipcRenderer.on("cs:set-isPlay", callback),
  sendCsSetBounds: (width: number, height: number) => {
    ipcRenderer.send("cs:set-bounds", width, height);
  },
  //rvWin
  sendRvOpenWin: () => ipcRenderer.send("rv:open-win"),
  sendRvDownloadRecord: (url: string) =>
    ipcRenderer.send("rv:download-record", url),

  //ssWin
  sendSsOpenWin: () => ipcRenderer.send("ss:open-win"),
  sendSsCloseWin: () => ipcRenderer.send("ss:close-win"),
  invokeSsGetShotScreenImg: () => ipcRenderer.invoke("ss:get-shot-screen-img"),
  sendSsDownloadImg: (imgUrl: string) => ipcRenderer.send("ss:download-img", imgUrl),
  sendSsSaveImg: (imgUrl: string) => ipcRenderer.send("ss:save-img", imgUrl),

  //viWin
  sendViOpenWin: (search?: any) => ipcRenderer.send("vi:open-win", search),
  invokeViSetIsAlwaysOnTop: () => ipcRenderer.invoke("vi:set-always-on-top"),
  invokeViGetHistoryImg: () => ipcRenderer.invoke("vi:get-historyImg"),
  invokeViGetImgs: (imgUrl: any) => ipcRenderer.invoke("vi:get-imgs", imgUrl),
  sendViDownloadImg: (img: any) => ipcRenderer.send("vi:download-img", img),
  sendViSetHistoryImg: (img: any) => ipcRenderer.send("vi:set-historyImg", img),

  //vvWin
  sendVvOpenWin: (search?: any) => ipcRenderer.send("vv:open-win", search),
  invokeVvGetHistoryVideo: () => ipcRenderer.invoke("vv:get-historyVideo"),
  invokeVvGetVideo: () => ipcRenderer.invoke("vv:get-video"),
  sendVvSetHistoryVideo: (img: any) => ipcRenderer.send("vv:set-historyVideo", img),

  //seWin
  sendSeOpenWin: () => ipcRenderer.send("se:open-win"),
  invokeSeGetUser: () => ipcRenderer.invoke("se:get-user"),
  invokeSeSetFilePath: () => ipcRenderer.invoke("se:set-filePath"),
  invokeSeGetFilePath: () => ipcRenderer.invoke("se:get-filePath"),
  sendSeSetOpenAtLogin: (isOpen: boolean) =>
    ipcRenderer.send("se:set-openAtLogin", isOpen),
  invokeSeGetOpenAtLogin: () => ipcRenderer.invoke("se:get-openAtLogin"),
});


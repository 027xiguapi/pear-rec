import { BrowserWindow, webContents, ipcMain, desktopCapturer } from "electron";
import { IpcEvents } from "../ipcEvents";
import { createShotScreenWindow } from './shotScreenWindow';
import { mainWindow } from './index';

let shotScreenWindow: BrowserWindow | null = null;
function closeCutWindow() {
  shotScreenWindow && shotScreenWindow.close()
  shotScreenWindow = null;
}

const selfWindws = async () =>
  await Promise.all(
    webContents
      .getAllWebContents()
      .filter((item) => {
        const win = BrowserWindow.fromWebContents(item);
        return win && win.isVisible();
      })
      .map(async (item) => {
        const win = BrowserWindow.fromWebContents(item);
        const thumbnail = await win?.capturePage();
        return {
          name:
            win?.getTitle() + (item.devToolsWebContents === null ? "" : "-dev"), // 给dev窗口加上后缀
          id: win?.getMediaSourceId(),
          thumbnail,
          display_id: "",
          appIcon: null,
        };
      })
  );


export function initIpcMain() {
  ipcMain.on(IpcEvents.EV_OPEN_SHOT_SCREEN_WIN, () => {
    closeCutWindow()
    mainWindow.hide();
    shotScreenWindow = createShotScreenWindow();
    shotScreenWindow.show()
  });

  ipcMain.on(IpcEvents.EV_CLOSE_SHOT_SCREEN_WIN, async () => {
    closeCutWindow()
    mainWindow.show()
  });

  ipcMain.handle(
    IpcEvents.EV_SEND_DESKTOP_CAPTURER_SOURCE,
    async (_event, _args) => {
      return [
        ...(await desktopCapturer.getSources({ types: ["screen"] })),
        ...(await selfWindws()),
      ];
    }
  );

  ipcMain.on(IpcEvents.EV_SET_TITLE, (event, title) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title);
  });

}
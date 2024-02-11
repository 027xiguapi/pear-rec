import { BrowserWindow } from 'electron';
import { join } from 'node:path';
import { ICON, preload, url, DIST, WEB_URL } from '../main/constant';
import { getAudiosByAudioUrl } from '../main/utils';

const viewAudioHtml = join(DIST, './viewAudio.html');
let viewAudioWin: BrowserWindow | null = null;

function createViewAudioWin(search?: any): BrowserWindow {
  viewAudioWin = new BrowserWindow({
    title: 'pear-rec 视频预览',
    icon: ICON,
    autoHideMenuBar: true, // 自动隐藏菜单栏
    webPreferences: {
      preload,
    },
  });

  if (url) {
    viewAudioWin.loadURL(WEB_URL + `viewAudio.html?audioUrl=${search?.audioUrl || ''}`);
    // Open devTool if the app is not packaged
    // viewAudioWin.webContents.openDevTools();
  } else {
    viewAudioWin.loadFile(viewAudioHtml, {
      search: `?audioUrl=${search?.audioUrl || ''}`,
    });
  }

  viewAudioWin.once('ready-to-show', async () => {
    viewAudioWin?.show();
  });

  return viewAudioWin;
}

function openViewAudioWin(search?: any) {
  if (!viewAudioWin || viewAudioWin?.isDestroyed()) {
    viewAudioWin = createViewAudioWin(search);
  }
  viewAudioWin.show();
}

function closeViewAudioWin() {
  if (!viewAudioWin?.isDestroyed()) {
    viewAudioWin?.close();
  }
  viewAudioWin = null;
}

async function getAudios(audioUrl?: any) {
  let audios = await getAudiosByAudioUrl(audioUrl);
  return audios;
}

export { createViewAudioWin, openViewAudioWin, closeViewAudioWin, getAudios };

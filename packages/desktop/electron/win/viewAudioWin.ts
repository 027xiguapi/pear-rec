import { BrowserWindow } from 'electron';
import { ICON, WEB_URL, WIN_CONFIG, preload, url } from '../main/constant';
import { getAudiosByAudioUrl } from '../main/utils';

let viewAudioWin: BrowserWindow | null = null;

function createViewAudioWin(search?: any): BrowserWindow {
  viewAudioWin = new BrowserWindow({
    title: 'pear-rec 音频',
    icon: ICON,
    width: WIN_CONFIG.viewAudio.width,
    height: WIN_CONFIG.viewAudio.height,
    autoHideMenuBar: WIN_CONFIG.viewAudio.autoHideMenuBar, // 自动隐藏菜单栏
    webPreferences: {
      preload,
    },
  });

  const audioUrl = search?.audioUrl || '';
  const recordId = search?.recordId || '';
  // Open devTool if the app is not packaged
  // viewAudioWin.webContents.openDevTools();

  if (url) {
    viewAudioWin.loadURL(
      WEB_URL +
        `viewAudio.html?${audioUrl ? 'audioUrl=' + audioUrl : ''}${
          recordId ? 'recordId=' + recordId : ''
        }`,
    );
  } else {
    viewAudioWin.loadFile(WIN_CONFIG.viewAudio.html, {
      search: `${audioUrl ? 'audioUrl=' + audioUrl : ''}${recordId ? 'recordId=' + recordId : ''}`,
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

export { closeViewAudioWin, createViewAudioWin, getAudios, openViewAudioWin };

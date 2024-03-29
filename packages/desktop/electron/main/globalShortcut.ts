import { globalShortcut } from 'electron';
import { openShotScreenWin, closeShotScreenWin } from '../win/shotScreenWin';
import { openRecorderAudioWin } from '../win/recorderAudioWin';
import { openClipScreenWin } from '../win/clipScreenWin';
import { openRecorderVideoWin } from '../win/recorderVideoWin';

function registerGlobalShortcut(data) {
  globalShortcut.register(data['screenshot'], () => {
    openShotScreenWin();
  });

  globalShortcut.register(data['screenRecording'], () => {
    openClipScreenWin();
  });

  globalShortcut.register(data['audioRecording'], () => {
    openRecorderAudioWin();
  });

  globalShortcut.register(data['videoRecording'], () => {
    openRecorderVideoWin();
  });

  globalShortcut.register('Esc', () => {
    console.log(55);
    closeShotScreenWin();
  });
}

function registerShotScreenShortcut(data) {
  globalShortcut.unregister(data.oldKey);
  globalShortcut.register(data.key, () => {
    openShotScreenWin();
  });
}

function registerRecorderScreenShortcut(data) {
  globalShortcut.unregister(data.oldKey);
  globalShortcut.register(data.key, () => {
    openClipScreenWin();
  });
}

function registerRecorderAudioShortcut(data) {
  globalShortcut.unregister(data.oldKey);
  globalShortcut.register(data.key, () => {
    openRecorderAudioWin();
  });
}

function registerRecorderVideoShortcut(data) {
  globalShortcut.unregister(data.oldKey);
  globalShortcut.register(data.key, () => {
    openRecorderVideoWin();
  });
}

function unregisterGlobalShortcut() {
  globalShortcut.unregister('Alt+Shift+q');
  globalShortcut.unregister('Alt+Shift+s');
  globalShortcut.unregister('Alt+Shift+a');
  globalShortcut.unregister('Alt+Shift+v');
  globalShortcut.unregister('Esc');
}

function unregisterAllGlobalShortcut() {
  globalShortcut.unregisterAll();
}

export {
  registerGlobalShortcut,
  unregisterGlobalShortcut,
  unregisterAllGlobalShortcut,
  registerShotScreenShortcut,
  registerRecorderScreenShortcut,
  registerRecorderAudioShortcut,
  registerRecorderVideoShortcut,
};

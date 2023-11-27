import { globalShortcut } from 'electron';
import { openShotScreenWin, closeShotScreenWin } from '../win/shotScreenWin';
import { openRecorderAudioWin } from '../win/recorderAudioWin';
import { openClipScreenWin } from '../win/clipScreenWin';
import { openRecorderVideoWin } from '../win/recorderVideoWin';

function registerGlobalShortcut() {
  globalShortcut.register('Alt+Shift+q', () => {
    openShotScreenWin();
  });

  globalShortcut.register('Alt+Shift+s', () => {
    openClipScreenWin();
  });

  globalShortcut.register('Alt+Shift+a', () => {
    openRecorderAudioWin();
  });

  globalShortcut.register('Alt+Shift+v', () => {
    openRecorderVideoWin();
  });

  globalShortcut.register('Esc', () => {
    closeShotScreenWin();
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

export { registerGlobalShortcut, unregisterGlobalShortcut, unregisterAllGlobalShortcut };

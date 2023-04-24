import { app, screen, BrowserWindow, desktopCapturer, ipcMain } from 'electron';
export const isDev = process.env.NODE_ENV === 'development';

function getScreenSize() {
  const { size, scaleFactor } = screen.getPrimaryDisplay();
  return {
    width: size.width * scaleFactor,
    height: size.height * scaleFactor
  }
}

export { getScreenSize } 
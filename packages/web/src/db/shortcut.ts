// shortcut.ts

export interface Shortcut {
  id?: number;

  screenshot: string;

  videoRecording: string;

  screenRecording: string;

  audioRecording: string;

  userId: number;

  createdAt?: Date;

  createdBy?: number;

  updatedAt?: Date;

  updatedBy?: number;
}

export const defaultShortcut = {
  screenshot: 'Alt+Shift+Q',
  videoRecording: 'Alt+Shift+V',
  screenRecording: 'Alt+Shift+S',
  audioRecording: 'Alt+Shift+A',
  createdAt: new Date(),
  updatedAt: new Date(),
};

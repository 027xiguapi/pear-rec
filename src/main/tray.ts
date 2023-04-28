import { Menu, Tray } from 'electron';
import path from 'path';
import { mainWindow } from './index';

export function initTray () {
    let appIcon = new Tray(path.join(__dirname, '../renderer/assets/imgs/logo@2x.ico'));
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Item1', type: 'radio' },
        { label: 'Item2', type: 'radio' },
        { label: 'Item3', type: 'radio', checked: true },
        { label: 'Item4', type: 'radio' }
    ])
    appIcon.setToolTip('梨子REC');
    appIcon.setContextMenu(contextMenu);

    appIcon.addListener("click", function () {
        mainWindow.show();
    });

    return appIcon;
}
import { ipcRenderer } from "electron";

const setTitle = (title: string) => {
    ipcRenderer.send('set-title', title);
}

export { setTitle }
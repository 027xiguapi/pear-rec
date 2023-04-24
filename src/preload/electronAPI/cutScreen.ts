import { ipcRenderer } from "electron";

const openCutScreen = async () => {
    await ipcRenderer.send("OPEN_CUT_SCREEN");
    // ipcRenderer.off("GET_CUT_INFO", getCutInfo);
    ipcRenderer.on("GET_CUT_SCREEN", (e, pic) => {
        console.log("GET_CUT_SCREEN", e, pic);
    });
}

const closeCutScreen = () => {
    ipcRenderer.send("CLOSE_CUT_SCREEN");
}

const setCutScreen = (pic: any) => {
    ipcRenderer.send("SET_CUT_SCREEN", pic);
}

const getCutScreen = async (callback: any) => {
    await ipcRenderer.send("GET_SCREEN_IMAGE");
    ipcRenderer.on('GET_SCREEN_IMAGE', async (e, source) => {
        const { thumbnail } = source;
        const bg = await thumbnail.toDataURL();
        callback(bg)
    })
}

export { openCutScreen, closeCutScreen, setCutScreen, getCutScreen };

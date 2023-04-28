import { ipcRenderer, IpcRendererEvent } from "electron";
import { IpcEvents } from "@/ipcEvents";
export type Channels = `${IpcEvents}`;

function send(channel: Channels, args: unknown[]) {
	ipcRenderer.send(channel, args);
}

function sendSync(channel: Channels, args: unknown[]) {
	return ipcRenderer.sendSync(channel, args);
}

function on(channel: Channels, func: (...args: unknown[]) => void) {
	const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
		func(...args);
	ipcRenderer.on(channel, subscription);

	return () => ipcRenderer.removeListener(channel, subscription);
}

function once(channel: Channels, func: (...args: unknown[]) => void) {
	ipcRenderer.once(channel, (_event, ...args) => func(...args));
}

function invoke(channel: Channels, ...args: unknown[]) {
	return ipcRenderer.invoke(channel, ...args);
}

export { send, sendSync, on, once, invoke };

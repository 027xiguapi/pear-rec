import { globalShortcut } from "electron";
import { openShotScreenWin, closeShotScreenWin } from "./shotScreenWin";

function registerGlobalShortcut() {
	globalShortcut.register("Alt+q", () => {
		openShotScreenWin();
	});

	globalShortcut.register("Esc", () => {
		closeShotScreenWin();
	});
}

function unregisterGlobalShortcut() {
	globalShortcut.unregister("Alt+q");
	globalShortcut.unregister("Esc");
}

function unregisterAllGlobalShortcut() {
	globalShortcut.unregisterAll();
}

export {
	registerGlobalShortcut,
	unregisterGlobalShortcut,
	unregisterAllGlobalShortcut,
};

import { createRoot } from "react-dom/client";
import { initI18n } from "../i18n";
import "./index.scss";

export default function initApp(App) {
	const userAgent = navigator.userAgent.toLowerCase();
	if (userAgent.indexOf(" electron/") > -1) {
		window.isElectron = true;
	} else {
		window.isElectron = false;
	}
	const container = document.getElementById("root") as HTMLElement;
	const root = createRoot(container);
	initI18n();
	root.render(<App />);
}

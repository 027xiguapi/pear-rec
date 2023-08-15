import { createRoot } from "react-dom/client";
import "../index.scss";
import App from "./App";

export default function initApp() {
	const userAgent = navigator.userAgent.toLowerCase();
	if (userAgent.indexOf(" electron/") > -1) {
		window.isElectron = true;
	} else {
		window.isElectron = false;
	}
	const container = document.getElementById("root") as HTMLElement;
	const root = createRoot(container);
	root.render(<App />);
}

initApp();

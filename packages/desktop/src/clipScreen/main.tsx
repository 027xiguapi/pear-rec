import { createRoot } from "react-dom/client";
import ClipScreen from "@pear-rec/web/es/pages/clipScreen/App";
import "@pear-rec/web/es/style.css";

var userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf(" electron/") > -1) {
	window.isElectron = true;
} else {
	window.isElectron = false;
}
const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(<ClipScreen />);

postMessage({ payload: "removeLoading" }, "*");

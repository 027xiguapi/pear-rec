// import { createRoot } from "react-dom/client";
import initApp from "@pear-rec/web/es/pages/setting/main";
import "@pear-rec/web/es/style.css";

initApp();
// var userAgent = navigator.userAgent.toLowerCase();
// if (userAgent.indexOf(" electron/") > -1) {
// 	window.isElectron = true;
// } else {
// 	window.isElectron = false;
// }
// const container = document.getElementById("root") as HTMLElement;
// const root = createRoot(container);
// root.render(<Home />);

postMessage({ payload: "removeLoading" }, "*");

import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "@/router";
import "./samples/node-api";
import "./index.scss";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(
	<HashRouter>
		<App />
	</HashRouter>,
);

postMessage({ payload: "removeLoading" }, "*");

import { loading } from "./electronAPI/loading";

loading();

import { ipcRenderer, contextBridge } from "electron";
import { send, sendSync, on, once, invoke } from "./electronAPI/ipcRenderer";
import { setTitle } from "./electronAPI/app";
// import { store } from "../stores";

// import { increment, decrement, selectCount } from "../stores/reducer/counter";
// import { updateUser, selectUser } from "../stores/reducer/user";

// const dispatch = useDispatch();
// console.log("dispatch", dispatch);
// let counter = useSelector(state=>state.rootCouter.counter)
// const counter = useSelector(selectCount);

// const user = useSelector(selectUser);

const constraints = {
	audio: {
		mandatory: {
			chromeMediaSource: "desktop",
		},
	},
	video: {
		mandatory: {
			chromeMediaSource: "desktop",
		},
	},
};

ipcRenderer.on("SET_SOURCE", async (event, sourceId) => {
	console.log("SET_SOURCE", event, sourceId);
	try {
		//   const stream = await navigator.mediaDevices.getUserMedia({
		//     audio: false,
		//     video: {
		//       mandatory: {
		//         chromeMediaSource: 'desktop',
		//         chromeMediaSourceId: sourceId,
		//         minWidth: 1280,
		//         maxWidth: 1280,
		//         minHeight: 720,
		//         maxHeight: 720
		//       }
		//     }
		//   })
		//   handleStream(stream)
	} catch (e) {
		console.log(e);
	}
});

function handleStream(stream: MediaProvider) {
	const video = document.querySelector("video");
	video!.srcObject = stream;
	video!.onloadedmetadata = () => video!.play();
}

// contextBridge.exposeInMainWorld("electronAPI", {
// 	setTitle,

// 	openCutScreen,
// 	closeCutScreen,
// 	setCutScreen,
// 	getCutScreen,

// 	ipcRenderer: {
// 		send,
// 		sendSync,
// 		on,
// 		once,
// 		invoke,
// 	},

// 	handleStore: () => {
// 		// const { getState, dispatch, subscribe } = store;
// 		// console.log(
// 		// 	"preload---subscribe:",
// 		// 	subscribe(() => {
// 		// 		console.log(1231, getState().rootCounter);
// 		// 	}),
// 		// );
// 		// console.log("preload---rootCounter:", getState().rootCounter);
// 		// dispatch(increment());
// 		// console.log("preload---rootCounter:", getState().rootCounter);
// 	},
// });

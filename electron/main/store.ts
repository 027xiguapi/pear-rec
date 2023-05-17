import Store from "electron-store";

const store = new Store();

function setHistory(history: any) {
	store.set("history", history);
}

function setHistoryImg(img: any) {
	store.set("history.img", img);
}

function setHistoryVideo(video: any) {
	store.set("history.video", video);
}

function getHistory() {
	return store.get("history");
}

function getHistoryImg() {
	return store.get("history.img");
}

function getHistoryVideo() {
	return store.get("history.video");
}

export {
	setHistory,
	setHistoryImg,
	setHistoryVideo,
	getHistory,
	getHistoryImg,
	getHistoryVideo,
};

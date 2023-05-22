import Store from "electron-store";

const store = new Store();

function setUser(user: any) {
	store.set("user", user);
}

function getUser() {
	return store.get("user");
}

function setUserUuid(userUuid: any) {
	store.set("user.uuid", userUuid);
}

function getUserUuid() {
	return store.get("user.uuid");
}

function setUserCreatedTime(createdTime: any) {
	store.set("user.createdTime", createdTime);
}

function getUserCreatedTime() {
	return store.get("user.createdTime");
}

function setFilePath(filePath: string) {
	store.set("filePath", filePath);
}

function getFilePath() {
	return store.get("filePath") || "";
}

// history
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
	setUser,
	getUser,
	setUserUuid,
	getUserUuid,
	setUserCreatedTime,
	getUserCreatedTime,
	setFilePath,
	getFilePath,
	setHistory,
	setHistoryImg,
	setHistoryVideo,
	getHistory,
	getHistoryImg,
	getHistoryVideo,
};

import { VITE_API_URL } from "./contract";

export async function getCurrentUser() {
	try {
		const rsp = await fetch(`${VITE_API_URL}/getCurrentUser`, {
			method: "get",
		});
		const response = await rsp.json();
		if (response.code == 0) {
			return response.data || "";
		}
	} catch (err) {
		console.log(err);
	}
}

export async function getHistoryImg() {
	try {
		const rsp = await fetch(`${VITE_API_URL}/getHistoryImg`, {
			method: "get",
		});
		const response = await rsp.json();
		if (response.code == 0) {
			return response.data || "";
		}
	} catch (err) {
		console.log(err);
	}
}

export async function setHistoryImg(historyImg: string) {
	try {
		const rsp = await fetch(`${VITE_API_URL}/setHistoryImg`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: `historyImg=${historyImg}`,
		});
		const response = await rsp.json();
		if (response.code == 0) {
			return response.data;
		}
	} catch (err) {
		console.log(err);
	}
}

export async function getHistoryVideo() {
	try {
		const rsp = await fetch(`${VITE_API_URL}/getHistoryVideo`, {
			method: "get",
		});
		const response = await rsp.json();
		if (response.code == 0) {
			return response.data;
		}
	} catch (err) {
		console.log(err);
	}
}

export async function setHistoryVideo(historyVideo: string) {
	const data = {
		historyVideo: historyVideo,
	};
	try {
		const rsp = await fetch(`${VITE_API_URL}/setHistoryVideo`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		const response = await rsp.json();
		if (response.code == 0) {
			return response.data;
		}
	} catch (err) {
		console.log(err);
	}
}

export async function getHistoryAudio() {
	try {
		const rsp = await fetch(`${VITE_API_URL}/getHistoryAudio`, {
			method: "get",
		});
		const response = await rsp.json();
		if (response.code == 0) {
			return response.data;
		}
	} catch (err) {
		console.log(err);
	}
}

export async function setHistoryAudio(historyAudio: string) {
	try {
		const rsp = await fetch(`${VITE_API_URL}/setHistoryAudio`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: `historyAudio=${historyAudio}`,
		});
		const response = await rsp.json();
		if (response.code == 0) {
			return response.data;
		}
	} catch (err) {
		console.log(err);
	}
}

export async function setFilePath(filePath: string) {
	try {
		const rsp = await fetch(`${VITE_API_URL}/setFilePath`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: `filePath=${filePath}`,
		});
		const response = await rsp.json();
		if (response.code == 0) {
			return response.data;
		}
	} catch (err) {
		console.log(err);
	}
}

export async function getUser() {
	try {
		const rsp = await fetch(`${VITE_API_URL}/getUser`, {
			method: "get",
		});
		const response = await rsp.json();
		if (response.code == 0) {
			return response.data;
		}
	} catch (err) {
		console.log(err);
	}
}

export async function getFilePath() {
	try {
		const rsp = await fetch(`${VITE_API_URL}/getFilePath`, {
			method: "get",
		});
		const response = await rsp.json();
		if (response.code == 0) {
			return response.data;
		}
	} catch (err) {
		console.log(err);
	}
}

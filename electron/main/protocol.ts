import { protocol } from "electron";

export function registerFileProtocol() {
	protocol.registerFileProtocol("pearrec", (request, callback) => {
		const url = request.url.replace(/^pearrec:\/\//, ""); // 去掉协议头 'pearrec://'
		const decodedUrl = decodeURIComponent(url); // 解码 URL
		console.log("decodedUrl", decodedUrl);
		try {
			// 返回图片的本地路径
			console.log("decodedUrl", decodedUrl);
			return callback(decodedUrl);
		} catch (error) {
			console.error("Failed to register protocol", error);
		}
	});
}

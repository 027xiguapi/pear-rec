import { protocol } from "electron";

export function registerFileProtocol() {
	protocol.registerFileProtocol("pearrec", (request, callback) => {
		const url = request.url.replace(/^pearrec:\/\//, ""); // 去掉协议头 'pearrec://'
		const decodedUrl = decodeURIComponent(url); // 解码 URL
		try {
			// 返回图片的本地路径
			return callback(decodedUrl);
		} catch (error) {
			console.error("Failed to register protocol", error);
		}
	});
}

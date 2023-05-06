import { protocol } from "electron";

export function registerFileProtocol() {
	protocol.registerFileProtocol("myapp", (request, callback) => {
		const url = request.url.substr(8); // 去掉协议头 'myapp://'
		const decodedUrl = decodeURIComponent(url); // 解码 URL
		try {
			// 返回图片的本地路径
			return callback(decodedUrl);
		} catch (error) {
			console.error("Failed to register protocol", error);
		}
	});
}

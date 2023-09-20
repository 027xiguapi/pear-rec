import { searchBaidu } from "./baidu";
import { searchGoogleLens } from "./google";

function checkInternetConnection() {
	return new Promise(function (resolve, reject) {
		var img = new Image();
		img.src = "https://www.google.com/images/phd/px.gif";
		img.onload = resolve;
		img.onerror = reject;
	});
}

export async function searchImg(blob, isProxy) {
	if (isProxy) {
		console.log("可以访问 Google");
		const rsp = await searchGoogleLens(blob);
		return rsp;
	} else {
		console.log("无法访问 Google");
		const rsp = await searchBaidu(blob);
		return rsp;
	}
}

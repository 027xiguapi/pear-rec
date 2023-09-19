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

export function searchImg(blob) {
	checkInternetConnection()
		.then(async () => {
			console.log("可以访问 Google");
			return await searchGoogleLens(blob);
		})
		.catch(async () => {
			console.log("无法访问 Google");
			return await searchBaidu(blob);
		});
}

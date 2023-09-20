export function isURL(str) {
	// 匹配常见的链接格式
	const urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i;
	return urlPattern.test(str);
}

export function isProxy() {
	return new Promise(function (resolve, reject) {
		var img = new Image();
		img.src = "https://www.google.com/images/phd/px.gif";
		img.onload = resolve;
		img.onerror = reject;
	});
}

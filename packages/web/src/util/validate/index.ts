export function isURL(str) {
	// 匹配常见的链接格式
	const urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i;
	return urlPattern.test(str);
}

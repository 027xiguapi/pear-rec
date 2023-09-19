export async function searchGoogleLens(imageBlob: Blob) {
	const data = new FormData();
	data.append("encoded_image", imageBlob, "pear-rec.png");

	const rsp = await fetch(
		`http://localhost:7896/apiGoogle/upload?ep=ccm&s=&st=${Date.now()}`,
		{
			referrer: "",
			mode: "cors",
			method: "POST",
			body: data,
		},
	);
	if (rsp && rsp.status !== 200) {
		throw new Error(`API response: ${rsp.status}, ${await rsp.text()}`);
	}
	const response = await rsp.text();
	const tabUrl = response.match(/<meta .*URL=(https?:\/\/.*)"/)?.[1];
	return tabUrl;
}

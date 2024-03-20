const baseURL = import.meta.env.VITE_API_URL;

export async function searchBaidu(imageBlob: Blob) {
  const data = new FormData();
  data.append('image', imageBlob, 'pear-rec.png');
  data.append('tn', 'pc');
  data.append('from', 'pc');
  data.append('image_source', 'PC_UPLOAD_SEARCH_FILE');
  console.log(baseURL);
  const rsp = await fetch(`${baseURL}apiBaidu/upload`, {
    referrer: '',
    mode: 'cors',
    method: 'POST',
    body: data,
  });
  if (rsp && rsp.status !== 200) {
    throw new Error(`API response: ${rsp.status}, ${await rsp.text()}`);
  }
  const response = await rsp.json();
  if (response.status == 0) {
    return response.data.url;
  } else {
    return '';
  }
}

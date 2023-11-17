export function urlToBlob(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(new Error(`urlToBlob: Request failed with status ${xhr.status}`));
      }
    };
    xhr.onerror = () => {
      reject(new Error('urlToBlob: Request failed'));
    };
    xhr.send();
  });
}

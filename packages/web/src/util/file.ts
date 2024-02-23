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

export async function saveImageToFile(imageBlob, suggestedFileName) {
  try {
    const opts = {
      types: [
        {
          description: 'Image files',
          accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
          },
        },
      ],
      suggestedName: suggestedFileName,
    };

    const fileHandle = await window.showSaveFilePicker(opts);
    const writable = await fileHandle.createWritable();
    await writable.write(imageBlob);
    await writable.close();
  } catch (error) {
    console.error('Error saving image:', error);
  }
}

export async function saveVideoToFile(videoBlob, suggestedFileName) {
  try {
    const opts = {
      types: [
        {
          description: 'Video files',
          accept: {
            'video/*': ['.mp4', '.webm', '.mkv'],
          },
        },
      ],
      suggestedName: suggestedFileName,
    };

    const fileHandle = await window.showSaveFilePicker(opts);
    const writable = await fileHandle.createWritable();
    await writable.write(videoBlob);
    await writable.close();

    console.log('Video saved successfully!');
  } catch (error) {
    console.error('Error saving video:', error);
  }
}

export async function saveAudioToFile(audioBlob, suggestedFileName) {
  try {
    const opts = {
      types: [
        {
          description: 'Audio files',
          accept: {
            'audio/*': ['.mp3', '.wav', '.ogg'],
          },
        },
      ],
      suggestedName: suggestedFileName,
    };

    const fileHandle = await window.showSaveFilePicker(opts);
    const writable = await fileHandle.createWritable();
    await writable.write(audioBlob);
    await writable.close();

    console.log('Audio saved successfully!');
  } catch (error) {
    console.error('Error saving audio:', error);
  }
}

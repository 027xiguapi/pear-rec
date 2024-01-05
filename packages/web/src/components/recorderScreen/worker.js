/*
 *  Copyright (c) 2021 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

let x = 0;
let y = 0;
let width = 0;
let height = 0;
let type = '';
let num = 0;
let videoFrames = [];

function transform(frame, controller) {
  const newFrame = new VideoFrame(frame, {
    visibleRect: {
      x: x,
      width: width,
      y: y,
      height: height,
    },
  });
  num++;
  if (type == 'gif' && num % 3 == 0) {
    saveImg(newFrame);
  }
  controller.enqueue(newFrame);
  frame.close();
}

async function saveImg(videoFrame) {
  const canvas = new OffscreenCanvas(videoFrame.displayWidth, videoFrame.displayHeight);
  const context = canvas.getContext('2d');
  context.drawImage(videoFrame, 0, 0);
  canvas.convertToBlob({ type: 'image/jpeg' }).then((blob) => {
    uploadFile(blob);
  });
}

async function uploadFile(blob) {
  let formData = new FormData();
  formData.append('type', 'cg');
  formData.append('file', blob);

  const rsp = await fetch('http://localhost:9190/file/cache', {
    method: 'POST',
    body: formData,
  });
  const res = await rsp.json();
  if (res.code == 0) {
    videoFrames.push({
      url: `http://localhost:9190/file?url=${res.data}`,
      filePath: res.data,
      index: num / 3,
      duration: 100,
    });
  }
}

onmessage = async (event) => {
  const { operation, size, status } = event.data;
  type = event.data.type;
  num = 0;
  if (operation === 'crop' && status == 'start') {
    const { readable, writable } = event.data;
    x = size.x;
    y = size.y;
    width = size.width;
    height = size.height;
    if (x < 0) {
      width = width + x;
      x = 0;
    } else {
      x = x % 2 == 0 ? x + 2 : x + 1;
    }
    if (y < 0) {
      height = height + y;
      y = 0;
    } else {
      y = y % 2 == 0 ? y + 2 : y + 1;
    }
    width = width % 2 == 0 ? width - 4 : width - 3;
    height = height % 2 == 0 ? height - 4 : height - 3;

    readable.pipeThrough(new TransformStream({ transform })).pipeTo(writable);
  } else if (status == 'stop') {
    self.postMessage([...videoFrames]);
  } else {
    console.error('Unknown operation', operation);
  }
};

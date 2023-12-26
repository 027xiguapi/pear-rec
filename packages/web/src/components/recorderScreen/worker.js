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

// 上传函数
function uploadFile(blob) {
  // 获取表单数据
  var formData = new FormData();
  formData.append('type', 'cg');
  formData.append('file', blob);

  fetch('http://localhost:9190/file/cache', {
    method: 'POST',
    body: formData,
  });
}

onmessage = async (event) => {
  const { operation, size } = event.data;
  type = event.data.type;
  num = 0;
  if (operation === 'crop') {
    const { readable, writable } = event.data;
    x = size.x % 2 == 0 ? size.x + 2 : size.x + 1;
    y = size.y % 2 == 0 ? size.y + 2 : size.y + 1;
    width = size.width % 2 == 0 ? size.width - 4 : size.width - 3;
    height = size.height % 2 == 0 ? size.height - 4 : size.height - 3;
    readable.pipeThrough(new TransformStream({ transform })).pipeTo(writable);
  } else {
    console.error('Unknown operation', operation);
  }
};

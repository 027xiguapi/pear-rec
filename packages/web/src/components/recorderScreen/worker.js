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
  controller.enqueue(newFrame);
  frame.close();
}

onmessage = async (event) => {
  const { operation, size, status } = event.data;
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

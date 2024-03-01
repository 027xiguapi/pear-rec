class Canvas2DRenderer {
  #canvas = null;
  #ctx = null;

  constructor(canvas) {
    this.#canvas = canvas;
    this.#ctx = canvas.getContext('2d');
  }

  draw(frame) {
    this.#canvas.width = frame.displayWidth;
    this.#canvas.height = frame.displayHeight;
    this.#ctx.drawImage(frame, 0, 0, frame.displayWidth, frame.displayHeight);
    frame.close();
    this.#canvas.convertToBlob({ type: 'image/png' }).then((blob) => {
      let videoFrame = {
        fileName: `pear-rec_${+new Date()}.png`,
        fileData: blob,
        frameDuration: (frame.duration / 1000).toFixed(0),
      };
      self.postMessage({ videoFrame });
    });
  }
}

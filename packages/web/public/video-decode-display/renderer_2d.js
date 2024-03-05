class Canvas2DRenderer {
  #canvas = null;
  #ctx = null;
  #timeStart = 0;
  #timeEnd = 0;
  #num = 0;
  #index = 0;

  constructor(canvas, option) {
    this.#canvas = canvas;
    this.#ctx = canvas.getContext('2d');
    this.#timeStart = option.timeStart;
    this.#timeEnd = option.timeEnd;
    this.#num = option.num;
  }

  draw(frame) {
    if (
      (this.#index < this.#num || !this.#num) &&
      ((this.#timeStart == 0 && this.#timeEnd == 0) ||
        (this.#timeStart <= frame.timestamp && this.#timeEnd > frame.timestamp))
    ) {
      this.#index++;
      this.#canvas.width = frame.displayWidth;
      this.#canvas.height = frame.displayHeight;
      this.#ctx.drawImage(frame, 0, 0, frame.displayWidth, frame.displayHeight);
      this.#canvas.convertToBlob({ type: 'image/png' }).then((blob) => {
        let videoFrame = {
          fileName: `pear-rec_${+new Date()}.png`,
          fileData: blob,
          frameDuration: (frame.duration / 1000).toFixed(0),
        };
        self.postMessage({ videoFrame, index: this.#index });
      });
    }
    frame.close();
  }
}

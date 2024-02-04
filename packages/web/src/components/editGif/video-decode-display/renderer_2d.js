class Canvas2DRenderer {
  #canvas = null;
  #ctx = null;
  imgs = [];

  constructor(canvas) {
    this.#canvas = canvas;
    this.#ctx = canvas.getContext('2d');
    this.imgs = [];
  }

  async draw(frame) {
    this.#canvas.width = frame.displayWidth;
    this.#canvas.height = frame.displayHeight;
    this.#ctx.drawImage(frame, 0, 0, frame.displayWidth, frame.displayHeight);
    frame.close();
    await this.#canvas.convertToBlob({ type: 'image/jpeg' }).then((blob) => {
      let url = URL.createObjectURL(blob);
      let duration = frame.duration;
      this.imgs.push({ index: this.imgs.length, url, duration });
    });
  }

  getImgs() {
    return this.imgs;
  }
}

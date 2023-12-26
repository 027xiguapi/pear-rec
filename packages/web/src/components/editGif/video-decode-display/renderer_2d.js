class Canvas2DRenderer {
  #canvas = null;
  #ctx = null;
  imgs = [];

  constructor(canvas) {
    this.#canvas = canvas;
    this.#ctx = canvas.getContext('2d');
    this.imgs = [];
  }

  async draw(frame, isSetImg) {
    this.#canvas.width = frame.displayWidth;
    this.#canvas.height = frame.displayHeight;
    this.#ctx.drawImage(frame, 0, 0, frame.displayWidth, frame.displayHeight);
    frame.close();
    if (isSetImg) {
      await this.#canvas.convertToBlob({ type: 'image/jpeg' }).then((blob) => {
        this.imgs.push(URL.createObjectURL(blob));
      });
    }
  }

  getImgs() {
    return this.imgs;
  }
}

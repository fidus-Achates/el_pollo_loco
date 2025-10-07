class DrawableObject {
  x = 0;
  y = 280;
  img;
  width = 100;
  height = 150;
  currentImage = 0; // wer bracht das gerade?

  // structure: key = path-string, value = image
  imageCache = {};

  /**
   * create a single image Object (start image or permanent image)
   * @param {string} path
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * create image Objects for animation; structure of imageCache see above.
   * @param {*} arr - path collection for animation (stored in "constants")
   */
  loadImages(arr) {
    arr.forEach(path => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * helper function for dev: make image frame visible
   * @param {method} ctx - context method of "canvas"
   */
  drawFrame(ctx) {
    if(this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof Babychicken || this instanceof CollectableObject) {
      ctx.beginPath();
      ctx.lineWidth = '2';
      ctx.strokeStyle = 'blue';
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  /**
   * helper function for dev: make offset frame visible (used for collision detection)
   * @param {method} ctx - context method of "canvas"
   */
  drawInnerFrame(ctx) {
    if(this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof Babychicken || this instanceof CollectableObject) {
      ctx.beginPath();
      ctx.lineWidth = '2';
      ctx.strokeStyle = 'red';
      ctx.rect(this.x + this.offset.left, 
        this.y + this.offset.top, 
        this.width - this.offset.right, 
        this.height - this.offset.bottom);
      ctx.stroke();
    }
  }

  /**
   * standard drawing function, uses canvas' context-method "drawImage"
   * @param {method} ctx - context method of "canvas"
   */
  draw(ctx) {
    ctx.drawImage(
      this.img,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
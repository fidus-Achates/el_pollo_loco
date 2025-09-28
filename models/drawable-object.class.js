class DrawableObject {
  x = 0;
  y = 280;
  img;
  width = 100;
  height = 150;
  currentImage = 0;

  imageCache = {};

  loadImage(path) {
    this.img = new Image();  // Alternative: schon oben img = new Image(); schreiben
    this.img.src = path;
  }

  loadImages(arr) {
    arr.forEach(path => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

    drawFrame(ctx) {
    // if(this instanceof Character || this instanceof Chicken || this instanceof Babychicken) {
      ctx.beginPath();
      ctx.lineWidth = '2';
      ctx.strokeStyle = 'blue';
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    // }
  }

  drawInnerFrame(ctx) {
    // if(this instanceof Character || this instanceof Chicken || this instanceof Babychicken) {
      ctx.beginPath();
      ctx.lineWidth = '2';
      ctx.strokeStyle = 'red';
      ctx.rect(this.x + this.offset.left, 
        this.y + this.offset.top, 
        this.width - this.offset.right, 
        this.height - this.offset.bottom);
      ctx.stroke();
    // }
  }

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
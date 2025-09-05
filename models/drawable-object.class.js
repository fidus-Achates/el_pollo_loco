class DrawableObject {
  x = 0;
  y = 280;
  img;
  width = 100;
  height = 150;
  speed = 0.15;
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
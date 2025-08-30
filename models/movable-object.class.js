class MovableObject {
  x = 0;
  y = 280;
  img;
  width = 100;
  height = 150;
  speed = 0.15;
  currentImage = 0;
  otherDirection = false;
  speed_Y = 0;
  acceleration = 2.5;

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

  drawFrame(ctx) {
    if(this instanceof Character || this instanceof Chicken || this instanceof Babychicken) {
      ctx.beginPath();
      ctx.lineWidth = '2';
      ctx.strokeStyle = 'blue';
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  moveRight() {
    this.x += this.speed;
  }

  applyGravity() {
    setInterval(() => {
    if(this.isAboveGround() || this.speed_Y > 0) {
      this.y -= this.speed_Y;
      this.speed_Y -= this.acceleration;
      }
    }, 50);
  }

  isAboveGround() {
    return this.y < 140;
  }

  jump() {
    this.speed_Y = 30;
  }
}
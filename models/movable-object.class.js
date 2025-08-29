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
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(arr) {
    arr.forEach(path => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
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
      // if(this.speed_Y >= 140) {
      //   this.speed_Y = 140;
      //   }
      }
    }, 50);
  }

  isAboveGround() {
    return this.y < 140;
  }

  jump(){
    this.speed_Y = 20;
  }
}
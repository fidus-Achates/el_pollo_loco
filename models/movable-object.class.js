class MovableObject {
  x = 120;
  y = 280;
  img;
  width = 100;
  height = 150;
  speed = 0.15;
  currentImage = 0;
  otherDirection = false;

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

  moveLeft() {
    setInterval( () => {
      this.x -= this.speed;
    }, 1000 / 60);
  }

  moveRight() {
    console.log("move right");
  }
}
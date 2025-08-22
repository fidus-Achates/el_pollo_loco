class MovableObject {
  x = 120;
  y = 10; // bei Junus: 250
  img;
  width = 100;
  height = 150;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  moveRight() {
    console.log("move right");
  }
}
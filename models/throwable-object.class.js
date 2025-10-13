class ThrowableObject extends MovableObject {

  width = 75;
  height = 75;
  missileActive = false;
  missileLaunched = false;

  constructor() {
    super();
    this.imagesArray = ROTATING_BOTTLE;
    this.loadImages(this.imagesArray);
    this.loadImage(this.imagesArray[0]);
    // this.animate();
  }

  // egal, wo animate steht: die Intervalle kollidieren, es geht alles viel zu schnell.

  throw(x, y) {
    this.x = x;
    this.y = y;
    this.speed_Y = 30;
    this.applyGravity();
    this.animate();
  
    setInterval(() => {
      this.x += 10;
    }, 50);
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.imagesArray);
    }, 30);
  }
}
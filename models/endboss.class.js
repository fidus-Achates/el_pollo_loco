class Endboss extends MovableObject {

  x = 2500;
  y = 40;
  width = 300;
  height = 420;

  constructor() {
    super();
    this.imagesArray = ENEMIES_IMAGES['endboss_angry'];
    this.loadImage(this.imagesArray[0]);
    this.loadImages(this.imagesArray);
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.imagesArray);
    }, 200);
  }
}
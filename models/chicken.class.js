class Chicken extends MovableObject {

  y = 339;
  width = 90;
  height = 100; 
  
  offset = {
    top: 7,
    right: 12,
    bottom: 18,
    left: 4
  }

  constructor() {
    super();
    this.imagesArray = ENEMIES_IMAGES['chicken_walking'];
    this.loadImages(this.imagesArray);
    this.loadImage(this.imagesArray[0]);

    // this.x = 400 + Math.random() * 500;
    this.speed = 0.5 + Math.random() * 1.5;
    this.animate();
  }

  /**
   * constantly move Chicken to left, move its feets and beak
   */
  animate() {
    setInterval( () => {
      this.moveLeft();
    }, 1000 / 60);
  
    setInterval(() => {
      this.playAnimation(this.imagesArray);
    }, 100);
  }
}
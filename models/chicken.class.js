class Chicken extends MovableObject {
  width = 90;
  height = 100; 
  y = 339;
  
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
    // this.loadImage(this.imagesArray[0]);

    this.x = 400 + Math.random() * 500;
    this.speed = 0.15 + Math.random() * 0.5;
    this.animate();
  }

  animate() {
    setInterval( () => {
      this.moveLeft();
    }, 1000 / 60);
  
    setInterval(() => {
      this.playAnimation(this.imagesArray);
    }, 100);
  }
}
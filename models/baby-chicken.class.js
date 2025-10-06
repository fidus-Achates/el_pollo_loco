class Babychicken extends MovableObject {

  y = 385;
  width = 55;
  height = 55; 
  
  offset = {
    top: 7,
    right: 14,
    bottom: 16,
    left: 8
  }

  constructor() {
    super();
    this.imagesArray = ENEMIES_IMAGES['baby_chicken_walking'];
    this.loadImages(this.imagesArray);
    this.loadImage(this.imagesArray[0]);

    // this.x = 400 + Math.random() * 500;
    // this.speed = 0.15 + Math.random() * 0.5;
    this.speed = 0.6 + Math.random() * 2.5;
    this.animate();
  }

  animate() {
    setInterval( () => {
      this.moveLeft();
    }, 1000 / 60);
    
    setInterval(() => {
      this.playAnimation(this.imagesArray);
    }, 90);
  }
}
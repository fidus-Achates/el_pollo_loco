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

  // canHurt = true; // schon in Oberklasse
  neutralized = 1000;
  isActive = true;
  moveInterval = null; // Neu
  animationInterval = null; // Neu

  constructor() {
    super();
    this.imagesArray = ENEMIES_IMAGES['chicken_walking'];
    this.loadImages(this.imagesArray);
    this.loadImage(this.imagesArray[0]);

    this.speed = 0.5 + Math.random() * 1.5;
    this.startAnimating(100);
  }

}
class Chicken extends MovableObject {
  // überschreibt Werte von Movable Object
  width = 90;
  height = 100; 
  y = 335;

  constructor() {
    super().loadImage('./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');

    this.x = 200 + Math.random() * 500; // vid 1.12
  }
}
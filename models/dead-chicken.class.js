class DeadChicken extends DrawableObject {

  y = 360;
  width = 90;  
  height = 90;

  constructor(x) {
    super();
    this.loadImage('./img/3_enemies_chicken/chicken_normal/2_dead/dead.png');
    this.x = x;
  }
}

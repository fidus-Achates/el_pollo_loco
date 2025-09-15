class DeadChicken extends DrawableObject {
  constructor(x) {
    super();
    this.loadImage('./img/3_enemies_chicken/chicken_normal/2_dead/dead.png');
    this.x = x;
    this.y = 360;
    this.width = 90;  
    this.height = 90;
  }
}

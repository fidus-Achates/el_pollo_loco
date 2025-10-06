class DeadBabyChicken extends DrawableObject {

  y = 370;
  width = 75;
  height = 75;

  constructor(x) {
    super();
    this.loadImage('./img/3_enemies_chicken/chicken_small/2_dead/dead.png');
    this.x = x;
  }
}
class DeadBabyChicken extends DrawableObject {
  constructor(x) {
    super();
    this.loadImage('./img/3_enemies_chicken/chicken_small/2_dead/dead.png');

    this.x = x;
    this.y = 370;
    this.width = 75;   // Maße an Babychicken anpassen
    this.height = 75;
  }
}
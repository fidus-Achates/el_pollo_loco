class Bottle extends CollectableObject {

  constructor() {
    super(BOTTLE_IMAGES);
    // this.x = 400 + Math.random() * 700;
    this.y = 360;
    this.loadImage("img/6_salsa_bottle/2_salsa_bottle_on_ground.png");
    this.width = 100;
    this.height = 90;
  }
}
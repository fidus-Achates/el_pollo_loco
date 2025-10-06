class Bottle extends CollectableObject {

  y = 360;
  width = 100;
  height = 90;

  offset = {
    top: 20,
    right: 60,
    bottom: 30,
    left: 30
  }

  constructor() {
    super();
    this.imagesArray = BOTTLE_IMAGES;   
    this.loadImages(this.imagesArray);
    this.loadImage("img/6_salsa_bottle/2_salsa_bottle_on_ground.png");
  }
}
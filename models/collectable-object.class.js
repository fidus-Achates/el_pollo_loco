class CollectableObject extends DrawableObject {
  constructor(imagesArray) {
    super();
    this.imagesArray = imagesArray;   
    this.loadImages(imagesArray);
    this.x = 600 + Math.random() * 1100;
    this.y = 50 + Math.random() * 70;
  }
}

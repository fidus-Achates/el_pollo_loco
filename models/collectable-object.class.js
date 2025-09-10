class CollectableObject extends DrawableObject {
  constructor() {
    super();
    this.x = 600 + Math.random() * 1100;
    this.y = 50 + Math.random() * 70;
  }
}

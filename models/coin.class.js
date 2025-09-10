class Coin extends CollectableObject {

  constructor() {
    super();
    this.imagesArray = COIN_IMAGES;   
    this.loadImages(this.imagesArray);
    this.loadImage("./img/8_coin/coin_1.png");

    this.width = 150;
    this.height = 150;
    this.intervalTime = 400 + Math.random() * 600;
    this.blink();
  }

  blink() {
    let toggle = true;
    setInterval(() => {
      this.img = this.imageCache[toggle ? this.imagesArray[0] : this.imagesArray[1]];
      toggle = !toggle; // cf. Mathematik: Multiplikation mit -1

        // this.currentImage = (this.currentImage + 1) % this.imagesArray.length;
        // const path = this.imagesArray[this.currentImage];
        // this.img = this.imageCache[path];

    }, this.intervalTime);
  }
}
class Coin extends CollectableObject {

  width = 150;
  height = 150;

  offset = {
    top: 55,
    right: 110,
    bottom: 110,
    // right: 55,
    // bottom: 55,
    left: 55
  }

  constructor() {
    super();
    this.imagesArray = COIN_IMAGES;   
    this.loadImages(this.imagesArray);
    this.loadImage("./img/8_coin/coin_1.png");
    this.y = 70 + Math.random() * 160;
    this.blinkInterval = 400 + Math.random() * 600;
    this.blink();
  }

  /**
   * make randomly blinking the coins; key of imageCache-entry (string) is set by ternary operator
   */
  blink() {
    let toggle = true;
    setInterval(() => {
      this.img = this.imageCache[toggle ? this.imagesArray[0] : this.imagesArray[1]];
      toggle = !toggle;
    }, this.blinkInterval);
  }
}
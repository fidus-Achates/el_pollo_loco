class statusBar extends MovableObject {
  COIN_IMAGES = [
    './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
    './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
    './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
    './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
    './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
    './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
  ];

  ENERGY_IMAGES = [
    './img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
    './img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
    './img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
    './img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
    './img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
    './img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
  ];

  BOTTLE_IMAGES = [
    './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
    './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
    './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
    './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
    './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
    './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png'
  ];

  percentage = 100;

  constructor() {
    super();
    this.loadImages(this.ENERGY_IMAGES);
    this.setPercentage(100);
    this.x = 30;
    this.y = 0;
    this.width = 200;
    this.height = 60;
  }

  // setPercentage(50)
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.ENERGY_IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    if(this.percentage == 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}

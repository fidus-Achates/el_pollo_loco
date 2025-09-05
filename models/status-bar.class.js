  const COIN_IMAGES = [
    './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
    './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
    './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
    './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
    './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
    './img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
  ];

  const ENERGY_IMAGES = [
    './img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
    './img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
    './img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
    './img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
    './img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
    './img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
  ];

  const BOTTLE_IMAGES = [
    './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
    './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
    './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
    './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
    './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
    './img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png'
  ];

  class statusBar extends MovableObject {
    x = 30;
    width = 200;
    height = 60;

  constructor(imagesArr, percentage, y) {
    super();
    this.imagesArr = imagesArr;   
    this.loadImages(imagesArr);
    this.startValue = percentage;
    this.setPercentage(percentage);
    this.y = y;
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.imagesArr[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    if(this.percentage == 100) return 5;
    else if (this.percentage > 80) return 4;
    else if (this.percentage > 60) return 3;
    else if (this.percentage > 40) return 2;
    else if (this.percentage > 20) return 1;
    else return 0;
  }
}

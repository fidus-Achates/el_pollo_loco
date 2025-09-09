  class StatusBar extends DrawableObject {
    x = 30;
    width = 200;
    height = 60;

  constructor(barType, percentage, y) {
    super();
    this.imagesArr = STATUS_BAR_IMAGES[barType];   
    this.loadImages(this.imagesArr);
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

// nur loadImages aus der Superklasse.
// neue Objekte werden in world erzeugt, bekommen drei Werte

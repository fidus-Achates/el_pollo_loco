  class StatusBar extends DrawableObject {

    x = 30;
    width = 200;
    height = 60;
    percentage;

  constructor(barType, percentage, y) {
    super();
    this.imagesArr = STATUS_BAR_IMAGES[barType];   
    this.loadImages(this.imagesArr);
    this.setPercentage(percentage);
    this.y = y;
  }

  /**
   * set current percentage for status bar, connected to some image in the status bar images array
   * @param {number} percentage - current percentage (energy, collected coins / bottles)
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.imagesArr[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * helper function for "setPercentage"; determine image of status bar to display
   * @returns index for images array
   */
  resolveImageIndex() {
    if(this.percentage == 100) return 5;
    else if (this.percentage > 79) return 4;
    else if (this.percentage > 59) return 3;
    else if (this.percentage > 39) return 2;
    else if (this.percentage > 19) return 1;
    else return 0;
  }
}

class Cloud extends MovableObject {

  y = 10;
  height = 300;
  width = 500;
  // isActive = true; // hat schon die Obkerklasse

  constructor(start_X) {
    super();
    this.loadImage('img/5_background/layers/4_clouds/2.png');
    this.x = start_X + Math.random() * 500;
    this.animateCloud();
  }

  /**
   * constantly move cloud to left
   */
  animateCloud() {
    if(this.isActive) {
      this.animate();
    }
  }
}
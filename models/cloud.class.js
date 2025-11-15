class Cloud extends MovableObject {

  y = 10;
  height = 300;
  width = 500;

  animationInterval = null;

  constructor(start_X) {
    super();
    this.loadImage('img/5_background/layers/4_clouds/2.png');
    this.x = start_X + Math.random() * 500;
    this.animateCloud();
  }

  /**
   * constantly move cloud to left, if game is running (otherwise: function is called, but blocked)
   */
  animateCloud() {
    this.animationInterval = setInterval(() => {
    if (!this.isActive  || !this.world?.gameRunning) {
      return;
    }
    this.moveLeft()}, 1000 / 60);
  }
}
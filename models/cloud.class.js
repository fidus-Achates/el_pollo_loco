class Cloud extends MovableObject {

  y = 10;
  height = 300;
  width = 500;
  isActive = true;

  constructor(start_X) {
    super().loadImage('img/5_background/layers/4_clouds/2.png');
    this.x = start_X + Math.random() * 500;
    this.animateCloud();
    // this.animate();
  }

  /**
   * constantly move cloud to left
   */
  animateCloud() {
    if(this.isActive) {
    this.animate() 
//     setInterval( () => {
//       this.moveLeft();
//     }, 1000 / 60);
    }
  }
}
class Cloud extends MovableObject {
  y = 10;
  height = 300;
  width = 500;

  constructor(start_X) {
    super().loadImage('img/5_background/layers/4_clouds/2.png');
    this.x = start_X + Math.random() * 500;

    this.animate();
  }

  // nach einem Umbau; nicht sicher ob ok.
  animate() {
    setInterval( () => {
      this.moveLeft();
    }, 1000 / 60);
  }
}
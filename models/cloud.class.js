class Cloud extends MovableObject {
  y = 10;
  height = 300;
  width = 500;

  constructor() {
    super().loadImage('img/5_background/layers/4_clouds/2.png');

    this.x = Math.random() * 500; // vid 1.13
    this.animate(); // vid 2.1
  }

  animate() {
    setInterval( () => {
      this.x -= 0.15;
    }, 1000 / 60);
  }
}
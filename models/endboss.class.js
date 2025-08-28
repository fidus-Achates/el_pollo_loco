class Endboss extends MovableObject {
  width = 300;
  height = 420;
  x = 2500;
  y = 40;

  IMAGES_WALKING = [
    'img/4_enemie_boss_chicken/2_alert/G5.png',
    'img/4_enemie_boss_chicken/2_alert/G6.png',
    'img/4_enemie_boss_chicken/2_alert/G7.png',
    'img/4_enemie_boss_chicken/2_alert/G8.png',
    'img/4_enemie_boss_chicken/2_alert/G9.png',
    'img/4_enemie_boss_chicken/2_alert/G10.png',
    'img/4_enemie_boss_chicken/2_alert/G11.png',
    'img/4_enemie_boss_chicken/2_alert/G12.png'
  ]

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);

    // this.x = 200 + Math.random() * 500; // vid 1.12
    // this.speed = 0.15 + Math.random() * 0.5;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
      // let i = this.currentImage % this.IMAGES_WALKING.length;
      // let path = this.IMAGES_WALKING[i];
      // this.img = this.imageCache[path];
      // this.currentImage++;
    }, 200);
  }
}
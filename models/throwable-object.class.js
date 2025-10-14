class ThrowableObject extends MovableObject {

  width = 75;
  height = 75;
  groundLevel = 375;

  rotateMissile = false;

  constructor(soundManager) {
    super();
    this.imagesRotate = ROTATING_BOTTLE;
    this.imagesSplash = BOTTLE_SPLASH;
    this.loadImages(this.imagesRotate);
    this.loadImage(this.imagesRotate[0]);
    this.loadImages(this.imagesSplash);
    this.soundManager = soundManager;
  }

  throw(x, y) {
    this.x = x;
    this.y = y;
    this.speed_Y = 32 ;
    this.applyGravity();
    this.animate();
    this.moving = true;
    this.soundManager.playSound('whistle');
    this.moveInterval = setInterval(() => {
      if (this.moving) {
        this.x += 10;
      }
    }, 80); // 50
  }

  applyGravity() {
  this.gravityInterval = setInterval(() => {
    if (this.isAboveGround() || this.speed_Y > 0) {
      this.y -= this.speed_Y;
      this.speed_Y -= this.acceleration;
    } else {
      this.y = this.groundLevel;
      this.speed_Y = 0;
      clearInterval(this.gravityInterval);
      this.rotateMissile = false;
      clearInterval(this.rotationInterval);
      this.moving = false;
      clearInterval(this.moveInterval);
      this.animateSplash();
    }
  }, 50); // 50
}

  animate() {
    this.rotateMissile = true; 
    this.rotationInterval = setInterval(() => {
      if(this.rotateMissile) {
      this.playAnimation(this.imagesRotate);
      }
    }, 30);
  }

  // animation läuft viel zu schnell. 
    animateSplash() {
      this.playAnimation(this.imagesSplash);
      // this.playAnimation(this.imagesSplash, 200);
      this.soundManager.playSound('bottleSmash');

      // wenn der Fleck weg soll:
      setTimeout(() => {
        this.destroyed = true;
      }, 500);
    }
}
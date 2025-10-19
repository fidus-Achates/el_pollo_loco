class ThrowableObject extends MovableObject {

  width = 75;
  height = 75;
  groundLevel = 375;

  // moving = false; // neu
  moveInterval; // für die Flugphase
  rotationInterval;
  rotateMissile = false;
  hitTarget = false;

  constructor(soundManager) {
    super();
    this.imagesRotate = ROTATING_BOTTLE;
    this.imagesSplash = BOTTLE_SPLASH;
    this.loadImages(this.imagesRotate);
    this.loadImage(this.imagesRotate[0]);
    this.loadImages(this.imagesSplash);
    this.soundManager = soundManager;
  }

  /**
   * launch missile (moves, sound while flying)
   * @param {number} x - start x-coordinate, depending on current position of character
   * @param {number} y - start v-coordinate, depending on current position of character
   */
  throw(x, y) {
    this.x = x;
    this.y = y;
    this.speed_Y = 32 ;
    this.moveMissile();
    this.animate();
    this.soundManager.playSound('whistle');
    // this.moving = true;
  }

  /**
   * define behaviour of Missile (flying or splashing)
   */
  moveMissile() {
    this.moveInterval = setInterval(() => {
      if (this.isAboveGround() || this.speed_Y > 0) {
        this.flyingBottle();
      } else {
        this.bottleOnGround();
      }
    }, 50);
  }

  /**
   * define curve of flying bottle
   */
  flyingBottle() {
    this.y -= this.speed_Y;
    this.speed_Y -= this.acceleration;
    // if (this.moving) {
      this.x += 10;
    // }
  }

  /**
   * stop flying and rotating by clearing intervals; start splash
   */
  bottleOnGround() {
    this.y = this.groundLevel;
    this.speed_Y = 0;
    // this.moving = false;
    clearInterval(this.moveInterval);
    this.rotateMissile = false;
    clearInterval(this.rotationInterval);
    this.animateSplash();
  }

  markAsHit() {
    this.hasHitTarget = true;
    clearInterval(this.moveInterval);
    this.rotateMissile = false;
    clearInterval(this.rotationInterval);
    this.animateSplash();
  }

  /**
   * rotate bottle while flying (flag: rotateMissile)
   */
  animate() {
    this.rotateMissile = true; 
    this.rotationInterval = setInterval(() => {
      if(this.rotateMissile) {
      this.playAnimation(this.imagesRotate);
      }
    }, 30);
  }

  /**
   * play once animation and sound; remove crushed bottle
   */

  // !! animation läuft VIEL ZU SCHNELL. 
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
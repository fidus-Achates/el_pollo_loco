class ThrowableObject extends MovableObject {

  width = 75;
  height = 75;
  groundLevel = 375;

  offset = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }

  moveInterval; // für die Flugphase
  rotationInterval;
  rotateMissile = false;
  hitTarget = false;

  constructor() {
    super();
    this.imagesRotate = ROTATING_BOTTLE;
    this.imagesSplash = BOTTLE_SPLASH;
    this.loadImages(this.imagesRotate);
    this.loadImage(this.imagesRotate[0]);
    this.loadImages(this.imagesSplash);
  }

  /**
   * throw missile (moves, sound while flying)
   * @param {number} x - start x-coordinate, depending on current position of character
   * @param {number} y - start v-coordinate, depending on current position of character
   */
  throw(x, y) {
    this.x = x;
    this.y = y;
    this.speed_Y = 25 + Math.random() * 10;
    this.moveMissile();
    this.animate();
    this.world.level.soundManager.playSound('whistle');
  }

  // FUNCTIONS FOR MOVING MISSILE: FLYING AND TOUCH GROUND

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
   * evaluate state of missile (i.e. is it flying or splashing)
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
   * define curvey of flying bottle
   */
  flyingBottle() {
    this.y -= this.speed_Y;
    this.speed_Y -= this.acceleration;
    this.x += 11;
  }

  /**
   * avoid bouncing when bottle touches ground
   */
  bottleOnGround() {
    this.y = this.groundLevel;
    this.stopBottleFlight();
  }

  /**
   * mark bottle as hit to avoid multiple damage points; called in world's collision checker
   */
  markAsHit() {
    this.hasHitTarget = true;
    this.stopBottleFlight();
  }

  /**
   * stop flying and rotating by clearing intervals; prepare splash
   */
  stopBottleFlight() {
    clearInterval(this.moveInterval);
    this.rotateMissile = false;
    clearInterval(this.rotationInterval);
    this.evaluateSplash();
  }

  // FINAL FUNCTIONS FOR SPLASH: HANDLING AND GAME OVER CHECK

  /**
   * main function for splash handling
   */
  evaluateSplash() {
    this.animateSplash();
    this.checkIfGameOver();
    this.deleteStain();
  }

  /**
   * play animation and sound, hold last image of splash
   */
  animateSplash() {
    this.world.level.soundManager.playSound('bottleSmash');
    this.loadImage(this.imagesSplash[1]); // kleiner Bschiss
    this.splashInterval = setInterval(() => {
      this.playAnimationWithInterval(this.imagesSplash, 90);
      }, 90);
    setTimeout(() => {
      clearInterval(this.splashInterval);
      this.loadImage(this.imagesSplash[this.imagesSplash.length - 1]);
    }, 800);
  }

  /**
   * check if game over conditions are met after splash
   */
  checkIfGameOver() {
    if(this.world.level.endboss.energy == 0) {
      this.gameOverAfterFiveShots('./assets/You_won.png', 'winner', 3000);
    }
    else if(this.world.level.endboss.energy > 0 
      && this.world.level.bottlesPower == 0 
      && this.world.level.bottlesCollected == 5) {
        this.gameOverAfterFiveShots('./assets/outOfBottle.png', 'gameover', 1500);
      }
  }

  /**
   * activate game over scenario after fifth shot: "victory" or "out of bottle power"
   * @param {string} screenPath - image path of game over screen
   * @param {string} soundPath - sound path of game over sound
   * @param {number} delay - delay until game over screen appears 
   */
  gameOverAfterFiveShots(screenPath, soundPath, delay) {
    this.world.setGameRunning(false);
    gameover = true;
    setTimeout(() => {
      this.world.gameover(screenPath, soundPath);
    }, delay);
  }

  /**
   * remove stain (of splash)
   */
  deleteStain() {
    setTimeout(() => {
      this.destroyed = true;
    }, 1000);
  }
}
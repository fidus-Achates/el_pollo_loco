class MovableObject extends DrawableObject {
  
  speed_Y = 0;
  speed = 0.15;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  otherDirection = false;
  
  canHurt = true;
  currentAnimationInterval = null;
  jumpAnimationRunning = false;
  deathSequenceStarted = false; // gehört eig. in world?
  
  offset = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }

  /**
   * ordinary animation function for permanent loops, used in world's "draw"-method
   * @param {array} images - array containing animation images
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /** play animation in a loop. call in a "setInterval"-context; stop it by clearing this interval. 
   * @param {array} images - array containing animation images
   * @param {number} frameDelay - delay between frames
   * function is more precise than "stoppableAnimation" (Date.now() instead of setInterval)
  */
  playAnimationWithInterval(images, frameDelay = 30) {
    const now = Date.now();
    if (!this.lastFrameTime) this.lastFrameTime = now;

    if (now - this.lastFrameTime > frameDelay) {
      let i = this.currentImage % images.length;
      let path = images[i];
      this.img = this.imageCache[path];
      this.currentImage++;
      this.lastFrameTime = now;
    }
  }
  // used in: "animateSplash()" of ThrowableObject, "playDeathSequence()" of Character

  // OBSOLET (ex "deathSequence")
  /**
   * play animation in a loop. call in a "setInterval"-context; stop it by clearing this interval. 
   * @param {array} images - array containing animation images
   * @param {number} intervalTime - interval for calling "playAnimation"
   */
  stoppableAnimation(images, intervalTime) {
    this.currentAnimationInterval = setInterval(() => {
      this.playAnimation(images);
    }, intervalTime);
  }

  // OBSOLET
  /**
   * helper function for "stoppableAnimation"; stop animation and reset interval of "stoppabeAnimation"
   */
  stopAnimation() {
    if (this.currentAnimationInterval) {
      console.log("stop animation");
      clearInterval(this.currentAnimationInterval);
      this.currentAnimationInterval = null;
    }
  }


  /**
   * function plays image-sequence only once, with its own interval, and then displays last image.
   */
  playJumpAnimation(images, frameDelay = 150) {
    if (this.jumpAnimationRunning) return;

    this.jumpAnimationRunning = true;
    let frame = 0;

    const interval = setInterval(() => {
      this.img = this.imageCache[images[frame]];
      frame++;

      if (frame >= images.length) {
        clearInterval(interval);
        this.img = this.imageCache[images[images.length - 1]];
        // NICHT sofort freigeben – erst beim Landen
        const checkLanding = setInterval(() => {
          if (!this.isAboveGround()) {
            this.jumpAnimationRunning = false;
            clearInterval(checkLanding);
          }
        }, 100);
      }
    }, frameDelay);
  }

  moveLeft() {
    this.x -= this.speed;
  }

  moveRight() {
    this.x += this.speed;
  }

  applyGravity() {
    setInterval(() => {
    if(this.isAboveGround() || this.speed_Y > 0) {
      this.y -= this.speed_Y;
      this.speed_Y -= this.acceleration;
      } else {
        this.y = 140;
        this.speed_Y = 0;
      }
    }, 50);
  }

  isAboveGround() {
    if(this instanceof ThrowableObject) {
      return this.y < this.groundLevel;
    } else {
      return this.y < 140;
    }
  }

  jump() {
    this.speed_Y = 30;
  }

  // mo ist ein chicken oder baby-chicken; this ist der character
//   isColliding(mo) {
//     return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
//           this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
//           this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
//           this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
//   }
// }

  // hat noch kein offset
  isCrushing(mo) {
    return this.y + this.height > mo.y &&
          this.x < mo.x &&
          this.x + this.width > mo.x + mo.width;    
  }

  isColliding(mo) {
    return this.x + this.width > mo.x &&
          this.y + this.height > mo.y &&
          this.x < mo.x + mo.width &&
          this.y < mo.y + mo.height;

    // return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
    //       this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
    //       this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
    //       this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
  }

  /**
   * temporarily neutralize ability as zoon as character is hurt
   * @param {string} flag - name of status flag (canHurt, canCollectObject)
   * @param {number} duration - how long ability is blocked
   */
  disableAbility(flag, duration) {
    this[flag] = false;
    setTimeout(() => {
      this[flag] = true}, duration);  
  }

  hit() {
    this.energy -= 5;
    if(this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime(); // Zeitpunkt des Treffers
    }
  }

  // this.world.level.soundManager.playSound('characterHurt'); // dürfte es gar nicht kennen!
  isHurt() { 
    let timePassed = new Date().getTime() - this.lastHit; // Aktueller Zeitpunkt - Zeitpunkt des Treffers
    timePassed = timePassed / 1000;
    return timePassed < 1;
  }

  isDead() {
    return this.energy == 0;
  }
}
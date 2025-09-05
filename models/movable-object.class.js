class MovableObject extends DrawableObject {
  otherDirection = false;
  speed_Y = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  
  offset = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }

  drawFrame(ctx) {
    if(this instanceof Character || this instanceof Chicken || this instanceof Babychicken) {
      ctx.beginPath();
      ctx.lineWidth = '2';
      ctx.strokeStyle = 'blue';
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  drawInnerFrame(ctx) {
    if(this instanceof Character || this instanceof Chicken || this instanceof Babychicken) {
      ctx.beginPath();
      ctx.lineWidth = '2';
      ctx.strokeStyle = 'red';
      ctx.rect(this.x + this.offset.left, 
        this.y + this.offset.top, 
        this.width - this.offset.right, 
        this.height - this.offset.bottom);
      ctx.stroke();
    }
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
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
      }
    }, 50);
  }

  isAboveGround() {
    return this.y < 140;
  }

  jump() {
    this.speed_Y = 30;
  }

  // mo ist ein chicken oder baby-chicken
//   isColliding(mo) {
//     return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
//           this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
//           this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
//           this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
//   }
// }

  isColliding(mo) {
    return this.x + this.width > mo.x &&
          this.y + this.height > mo.y &&
          this.x < mo.x + mo.width &&
          this.y < mo.y + mo.height;
  }

  hit() {
    this.energy -= 2;
    if(this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timePassed = new Date().getTime();
    timePassed = timePassed / 1000;
    return timePassed < 2;
  }

  isDead() {
    return this.energy == 0;
  }
}
class Character extends MovableObject {
  // überschreibt Werte von Movable Object
  width = 160;
  height = 300;
  y = 140;
  speed = 5;

  IMAGES_WALKING = [
    './img/2_character_pepe/2_walk/W-21.png',
    './img/2_character_pepe/2_walk/W-22.png',
    './img/2_character_pepe/2_walk/W-23.png',
    './img/2_character_pepe/2_walk/W-24.png',
    './img/2_character_pepe/2_walk/W-25.png',
    './img/2_character_pepe/2_walk/W-26.png'
  ];

  IMAGES_JUMPING = [
    './img/2_character_pepe/3_jump/J-31.png',
    './img/2_character_pepe/3_jump/J-32.png',
    './img/2_character_pepe/3_jump/J-33.png',
    './img/2_character_pepe/3_jump/J-34.png',
    './img/2_character_pepe/3_jump/J-35.png',
    './img/2_character_pepe/3_jump/J-36.png',
    './img/2_character_pepe/3_jump/J-37.png',
    './img/2_character_pepe/3_jump/J-38.png',
    './img/2_character_pepe/3_jump/J-39.png',
  ];

  world; // damit können wir auf das keyboard von world zugreifen.

  constructor() {
    super().loadImage('./img/2_character_pepe/2_walk/W-21.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.animate();
    this.applyGravity();
  }

  // Z.3: i ist index des obigen array (0 bis 5); dessen length ist 6.
  // i kann unendlich wachsen, aber modulo bleibt immer zwischen 0 und 5:
  // 0 : 6 = m. 0; 1 : 6 = m 1; 5 : 6 = m. 5; 6 (schon länger als length) : 6 = m. 0. Neuer Zyklus startet.
  // Z.4: die Pfade aus "IMAGES.." entsprechen den keys im "imageCache". currentImage = index im array
  // Z.5: der value (imageCache[pth]) ist das eigentliche Bild; wird img zugewiesen
  // Z.6: index von "IMAGES.." wird hochgezählt.
  animate() { 
    setInterval(() => {
      if(this.world.keyboard.RIGHT && this.x < 2160) {
        // this.x += this.speed;
        this.otherDirection = false;
        this.moveRight();
      }
      if(this.world.keyboard.LEFT && this.x > -1440) {
        this.x -= this.speed;
        this.otherDirection = true;
      }
      if(this.world.keyboard.UP && !this.isAboveGround()) {
        this.jump();
      }
      this.world.camera_x = -this.x; // Figur bleibt an derselben Stelle stehen
    }, 1000 / 60);

    setInterval(() => {
      if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else {
        if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          this.playAnimation(this.IMAGES_WALKING);
          }
        }
    }, 50);
  }
  
}
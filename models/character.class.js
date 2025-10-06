class Character extends MovableObject {
  
  x = 50;
  y = 140;
  width = 160;
  height = 300;
  speed = 5;

  offset = {
    top: 140,
    right: 76,
    bottom: 155,
    left: 30
  }

  world; // damit können wir auf das keyboard von world zugreifen.

  constructor() {
    super();
    this.imagesWalking = CHARACTER_IMAGES['character_walking'];
    this.imagesJumping = CHARACTER_IMAGES['character_jumping'];
    this.imagesHurt = CHARACTER_IMAGES['character_hurt'];
    this.imagesDead = CHARACTER_IMAGES['character_dead'];
    this.imagesIdle = CHARACTER_IMAGES['character_idle'];
    
    this.loadImages(this.imagesWalking);
    this.loadImages(this.imagesJumping);
    this.loadImages(this.imagesHurt);
    this.loadImages(this.imagesDead);
    this.loadImages(this.imagesIdle);
    
    this.loadImage('./img/2_character_pepe/2_walk/W-21.png')

    this.dead = false;
    this.animate();
    this.applyGravity(); // startet die F. aus der Superklasse. Ohne das kann nicht gehüpft werden.
  }

  // Z.3: i ist index des obigen array (0 bis 5); dessen length ist 6.
  // i kann unendlich wachsen, aber modulo bleibt immer zwischen 0 und 5:
  // 0 : 6 = m. 0; 1 : 6 = m 1; 5 : 6 = m. 5; 6 (schon länger als length) : 6 = m. 0. Neuer Zyklus startet.
  // Z.4: die Pfade aus "IMAGES.." entsprechen den keys im "imageCache". currentImage = index im array
  // Z.5: der value (imageCache[pth]) ist das eigentliche Bild; wird img zugewiesen
  // Z.6: index von "IMAGES.." wird hochgezählt.
  // 2. if-Klausel: die 50 sind das camera-offset, das Pepe 50 nach rechts rücken läßt
  animate() { 
    
    setInterval(() => {
      // console.log("isDead?", this.isDead());
      // console.log("tot?", this.dead);
      if (this.dead) return;

        if(this.world.keyboard.RIGHT && this.x < 2160) {
          this.otherDirection = false;
          this.moveRight();
        }
        if(this.world.keyboard.LEFT && this.x > 0 + 50) {
          this.otherDirection = true;
          this.moveLeft();
        }
        if(this.world.keyboard.UP && !this.isAboveGround()) {
          this.jump();
        }
        this.world.camera_x = -this.x + 50; // Figur bleibt an derselben Stelle stehen
      }, 1000 / 60);
  


    // ACHTUNG: für das Gehen ist das Intervall gut, für das Springen etc. nicht. Da reicht 100
    setInterval(() => {
      if(this.isDead()) {
        this.dead = true;
        // playDeathSequence();
        this.playAnimation(this.imagesDead);
        // this.loadImage('./img/2_character_pepe/4_hurt/H-43.png');
        return;

      } if (this.isHurt()) {
          this.playAnimation(this.imagesHurt);

      } else if (this.isAboveGround()) {
          this.playAnimation(this.imagesJumping);
          // crush-Detector

      } else if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          this.playAnimation(this.imagesWalking);

      // default: er steht einfach rum
      } else {
        this.loadImage('./img/2_character_pepe/1_idle/idle/I-1.png');
      }

      // } else {
            // if(!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) {
            //   this.playAnimation(this.IMAGES_IDLE);
            // }
          // }
        
    }, 50);
  }

  isFalling() {
    return this.speed_Y < 0;
  }

  playDeathSequence() {
    // 1. Todes-Animation starten
    this.playAnimation(this.imagesDead);

    // 2. Nach 1 Sekunde das finale Bild laden
    // setTimeout(() => {
    //   this.loadImage('./img/2_character_pepe/4_hurt/H-43.png');
    // }, 1000);
  }

  
}
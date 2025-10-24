class Character extends MovableObject {
  
  x = 60;
  y = 140;
  width = 160;
  height = 300;
  speed = 5;
  world; // damit können wir auf das keyboard von world zugreifen.

  canCollectObject = true;
  attackPaused = false; // für Wurfverzögerung (1 sec)
  dead = false;

  offset = {
    top: 140,
    right: 76,
    bottom: 155,
    left: 30
  }

  constructor() {
    super();
    this.imagesWalking = CHARACTER_IMAGES['character_walking'];
    this.imagesJumping = CHARACTER_IMAGES['character_jumping'];
    this.imagesHurt = CHARACTER_IMAGES['character_hurt'];
    this.imagesDead = CHARACTER_IMAGES['character_dead'];
    // this.imagesIdle = CHARACTER_IMAGES['character_idle'];
    
    this.loadImages(this.imagesWalking);
    this.loadImages(this.imagesJumping);
    this.loadImages(this.imagesHurt);
    this.loadImages(this.imagesDead);
    // this.loadImages(this.imagesIdle);
    
    this.loadImage('./img/2_character_pepe/2_walk/W-21.png');
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
          this.world.level.soundManager.playSound('jump');
        }

        if (this.world.keyboard.SPACE 
          && !this.attackPaused
          && this.otherDirection == false
          && !this.world.level.bottlesPower == 0) {
          // Wurfbild Pepe? Bei splash: normales Bild
            this.attackPaused = true; // blockiert nächsten Wurf;
            this.handleBottle();
            this.updateStatusBar();
            setTimeout(() => {
              this.attackPaused = false; // nach 1 sec nächster Wurf möglich
            }, 1000);
        }

        // Fast identischer Code; refactoring nötig
        if (this.world.keyboard.L && this.world.level.coinsPower > 0) {
          console.log("L pressed");
          if (this.energy < 20) { // auch in die if Klausel nehmen
            console.log("nearly dead");

            this.world.level.coinsPower -= 20;
            this.world.level.statusBars[1].setPercentage(this.world.level.coinsPower);
            console.log("remaining coin power: ", this.world.level.coinsPower)
            
            this.energy += 20;
            console.log('new energy level: ', this.energy);
            this.world.level.statusBars[0].setPercentage(this.energy);
            }
          }

        if (this.world.keyboard.B && this.world.level.bottlesPower == 0 && this.world.level.coinsPower > 0) {
          console.log("B pressed");
            console.log("out of bottles");

            this.world.level.coinsPower -= 20;
            this.world.level.statusBars[1].setPercentage(this.world.level.coinsPower);
            console.log("remaining coin power: ", this.world.level.coinsPower)
            
            this.world.level.bottlesPower += 20;
            console.log('new bottle power: ', this.world.level.bottlesPower);
            this.world.level.statusBars[2].setPercentage(this.world.level.bottlesPower);
          }


        this.world.camera_x = -this.x + 50; // Kamera FOLGT Figur bleibt an derselben Stelle stehen; das Plus ist um 10 tiefer als character.x
      }, 1000 / 60);
  

    // ACHTUNG: für das Gehen ist das Intervall gut, für das Springen etc. nicht. Da reicht 100
    setInterval(() => {
      if(this.isDead()) {
        this.dead = true;
        this.playDeathSequence();
        return;

      } if (this.isHurt()) {
          this.playAnimation(this.imagesHurt);

      } else if (this.isAboveGround()) {
        // INTERVALL TESTWEISE LANGSAM GEMACHT

        // this.world.level.soundManager.playSound('jump'); // ABLAUF STIMMT NICHT

          // this.playAnimation(this.imagesJumping);
          // this.junpInterval = setInterval(() => {
          this.playAnimationWithInterval(this.imagesJumping, 150);
          // }, 90);
          // setTimeout(() => {
          //   clearInterval(this.jumpInterval);
          //   this.loadImage(this.imagesJumping[this.imagesJumping.length - 1]);
          //   }, 800);
          

      } else if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && this.x < 2160) {
          this.playAnimation(this.imagesWalking);

      // default: er steht einfach rum
      } else {
        this.loadImage('./img/2_character_pepe/1_idle/idle/I-1.png');
      }        
    }, 50);
  }

  /**
   * create new ThrowableObject and call throw-function
   */
  handleBottle() {
    const bottleWeapon = new ThrowableObject(this.world.level.soundManager);
    this.world.missiles.push(bottleWeapon);
    bottleWeapon.throw(this.x + 95, this.y + 120);

    // this.loadImage('./assets/bottle_throw.png'); // Wurfbild Pepe
  }

  /**
   * update bottle-statusbar; value decreaeses at each throw
   */
  updateStatusBar() {
    this.world.level.bottlesPower -= 20;
    console.log('bottle power: ', this.world.level.bottlesPower);
    this.world.level.statusBars[2].setPercentage(this.world.level.bottlesPower);
  }

  isFalling() {
    return this.speed_Y < 0;
  }

  /**
   * play animation using "imagesDead", then stop it and show picture of pale character
   */
  playDeathSequence() {
    if (this.deathSequenceStarted) return;
    this.deathSequenceStarted = true;

    // console.log("death sequence started!");
    this.world.level.soundManager.playSound('characterDead'); // Timing von Sound und Bildern passt noch nicht recht
    this.stoppableAnimation(this.imagesDead, 150);

    setTimeout(() => {
      this.stopAnimation();
      this.loadImage('./img/2_character_pepe/4_hurt/H-43.png');
    }, 1000);

    setTimeout(() => {
      this.world.gameover('./img/endscreens/gameover_pepe.png', 'gameover');
      // this.world.gameover('./assets/You_won.png', 'winner');
    }, 2500);
  }
  
}
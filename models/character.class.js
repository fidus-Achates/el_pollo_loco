class Character extends MovableObject {
  
  x = 60;
  y = 140;
  width = 160;
  height = 300;
  speed = 5;

  canCollectObject = true;
  attackPaused = false;
  isCrushingEnemy = false;

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

    this.imageThrowing = this.imageCache['./assets/bottle_throw.png'] || this.loadImage('./assets/bottle_throw.png');
    
    this.loadImages(this.imagesWalking);
    this.loadImages(this.imagesJumping);
    this.loadImages(this.imagesHurt);
    this.loadImages(this.imagesDead);
    
    this.loadImage('./img/2_character_pepe/2_walk/W-21.png');
    this.animate();
    this.applyGravity(); // Aus der Superklasse. Ohne diesen Aufruf kann nicht gehüpft werden.
  }

  /**
   * main function for controling character's movements and the corresponding animations
   */
  animate() {
    this.checkKeyboardInputs();
    this.playCharacterAnimations();
  }

  // FIRST ANIMATE-FUNCTION 

  /**
   * check keyboard events and state(s) of character; call corresponding action
   */
  checkKeyboardInputs() {
    setInterval(() => {
      if (this.isDead()) return;
      if (this.x == 1950) {
        if (!this.world.level.statusBars[3]) {
          this.world.level.statusBars.push(new StatusBar('endboss', 100, 485, 7));
        }
        this.world.level.endboss.endbossSpawns();
      } 

      if (this.world.keyboard.RIGHT && this.x < 2200 && !this.isHurt()) {
        this.characterToRight();
      }
      if (this.world.keyboard.LEFT && this.x > 0 + 50 && !this.isHurt()) {
        this.characterToLeft();
      }
      if (this.world.keyboard.UP && !this.isAboveGround()) {
        this.characterJump();
      }
      if (this.world.keyboard.SPACE && !this.attackPaused && this.otherDirection == false && !this.world.level.bottlesPower == 0) {
        this. characterThrowBottle();
      }
      if (this.world.keyboard.L && this.world.level.coinsPower > 0 && this.energy < 20) {
        this.buyEnergy();
      }
      this.world.camera_x = -this.x + 50; // Kamera FOLGT Figur bleibt an derselben Stelle stehen; das Plus ist um 10 tiefer als character.x. if-Klausel: die 50 sind das camera-offset, das Pepe 50 nach rechts rücken läßt
    }, 1000 / 60);
  }

  // HELPER FUNCTIONS FOR "checkKeyboardInputs()"

  /**
   * move character to right
   */
  characterToRight() {
    this.otherDirection = false;
    this.moveRight();
  }

  /**
   * move character to left
   */
  characterToLeft() {
    this.otherDirection = true;
    this.moveLeft();
  }

  /**
   * make character jump
   */
  characterJump() {
    this.jump();
    this.world.level.soundManager.playSound('jump');
  }

  /**
   * make character throw bottle
   */
  characterThrowBottle() {
    this.controlAttackInterval();
    this.handleBottle();
    this.world.level.bottlesPower -= 20;
    this.world.level.statusBars[2].setPercentage(this.world.level.bottlesPower);
  }

  /**
   * helper function for "characterThrowBottle": block attack for 1 second
   */
  controlAttackInterval() {
    this.attackPaused = true;
    setTimeout(() => {
      this.attackPaused = false;
    }, 1200);
  }

  /**
   * helper function for "characterThrowBottle": create new ThrowableObject and call throw-function; 
   */
  handleBottle() {
    const bottleWeapon = new ThrowableObject();
    bottleWeapon.world = this.world; // bekommt Zugriff auf world, wegen Endszenarien
    this.world.missiles.push(bottleWeapon);
    bottleWeapon.throw(this.x + 95, this.y + 120);
  }

  /**
   * joker function when character is near to death but has coins
   */
  buyEnergy() {
    // console.log("L pressed");
    this.world.level.coinsPower -= 20;
    this.world.level.statusBars[1].setPercentage(this.world.level.coinsPower);    
    this.energy += 20;
    // console.log('new energy level: ', this.energy);
    this.world.level.statusBars[0].setPercentage(this.energy);
  }


  // SECOND ANIMATE-FUNCTION
  // check keyboard events and state(s) of character; call corresponding animation (methods of MovableObject)
      // ANSCHAUEN Manche Animationen werden in der checkCollisions-Methode aufgerufen, das ist nicht ganz konsistent.
  playCharacterAnimations() {
    setInterval(() => {
      if (this.isDead()) {
        this.runCharacterDeathSequence(3000);
        return;

      } else if ((this.isHurt() && !this.isDead())|| (this.isHurt() && this.isCrushingEnemy)) {
        this.playAnimation(this.imagesHurt);

      } else if (this.isAboveGround()) {
        this.playJumpAnimation(this.imagesJumping);

      } else if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && this.x < 2200 && !this.dead) {
        this.playAnimation(this.imagesWalking);

      } else if (this.attackPaused) {
        this.img = this.imageThrowing;
      
      } else if (!this.isDead()) {
        this.loadImage('./img/2_character_pepe/1_idle/idle/I-1.png');
      }        
    }, 50);
  }


  // SPECIFIC ACTIONS OF CHARACTER

 /**
  * return necessary condition for crushing enemies by jumping on them (see "world")
  * @returns boolean
  */
  isFalling() {
    return this.speed_Y < 0;
  }

  /**
   * handle collision with coin and bottle (-> category): remove item from array of drawable objects,
   * increase category-power, update status bar, play sound.
   * @param {string} category - "coins" or "bottles"
   * @param {number} gain - amount to increase category power
   * @param {number} statusBar - index of status bar to update
   * @param {string} sound - path of sound to play
   */
  grabObject(category, gain, statusBar, sound) {
    this.world.level[category].forEach((item, index) => {
      if(this.isColliding(item)) {
        this.world.level.soundManager.playSound(sound);
        this.world.level[category].splice(index, 1);
        this.world.level[category + "Power"] += gain;
        this.world.level.statusBars[statusBar].setPercentage(this.world.level[category + "Power"]);
        this.countCollectedBottles(category);
      }
    });
  }

  /**
   * helper function for "grabObject()": count for checking whether all 5 bottles have been collected;
   * number is important for "gameover when out of bottles"
   * @param {string} category - only "bottles" is relevant here
   */
  countCollectedBottles(category) {
    if(category == "bottles") {
      this.world.level.bottlesCollected++;
      console.log("bottles collected: ", this.world.level.bottlesCollected); 
    }
  }

  /**
   * start final animation sequence, stop running game's state
   * @param {number} delay - delay for gameover-animation
   */
  runCharacterDeathSequence(delay) {
    if (this.deathSequenceStarted) return;
    this.deathSequenceStarted = true;
    this.world.level.soundManager.playSound('characterDead'); // Timing von Sound und Bildern passt noch nicht recht
    this.world.setGameRunning(false);
    this.playDeadCharacterAnimations(delay);
  }

  /**
   * helper function for "runCharacterDeatSequence()": play death-animation, stop it and show picture of pale character; gameover
   */
  playDeadCharacterAnimations(delay) {
    this.deathInterval = setInterval(() => {
    this.playAnimationWithInterval(this.imagesDead, 90);
    }, 90);
    setTimeout(() => {
      clearInterval(this.deathInterval);
      this.loadImage('./assets/Pepe_dead.png');
    }, 2000);
    setTimeout(() => {
      this.world.gameover('./img/endscreens/gameover_pepe.png', 'gameover');
    }, delay);
  }
}

// 145, 220, console logs, dt. Kommentare

// 55ff.: eigene F machen, kommentieren
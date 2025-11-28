class World {
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  character = new Character();
  level = level1; // enthält die "Bestandteile" der anderen Obj. (enemies, clouds...)
  gameRunning = false;
  gameOver = false;
  spawnIntervalId = null;
  backgroundObjects = [];

  constructor(canvas) {
    this.ctx = canvas.getContext('2d'); // das Werkzeug zum canvas; ctx initialisieren
    this.canvas = canvas; // das 'Argument-canvas' wird nach aussen in das 'world-canvas' übertragen.
    this.keyboard = keyboard;
    this.setWorld();
    this.setBackgroundLayers();
    this.missiles = [];

    this.spawnIntervalId = null;
    this.draw();
    this.run();
  };

  setGameRunning(state) {
    this.gameRunning = state;
    this.updateAnimationsState(state);
    if (state == false) {
      clearInterval(this.spawnIntervalId);
    } else {
      this.spawnIntervalId = null;
      this.handleEnemySpawning();
    }
  }

  updateAnimationsState(state) {
    console.log("state update triggered");
    this.level.enemies.forEach(enemy => {
      if(enemy instanceof Chicken || enemy instanceof Babychicken)
        enemy.isActive = state;
    });

    this.level.clouds.forEach(cloud => {
      cloud.isActive = state;
    });
  }
  
  /**
   * allow to use world's functions (esp. parameter "gameRunning" for animated enemies, clouds)
   */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach(enemy => {
      enemy.world = this;
    });
    this.level.clouds.forEach(cloud => {
      cloud.world = this;
    });
  }

  /**
   * create array containing all background-elements (drawBackground() see "background-object")
   */
  setBackgroundLayers() {
    const blockWidth = 1438;
    this.level.backgroundLayers.forEach(layerGroup => {
      const parallax = layerGroup[0].parallax; // Parallaxe (steht in beiden Segmenten, braucht sie nur 1x, daher [0])
      for (let i = 0; i < 2;  i++) {
        layerGroup.forEach(line => {
          const x = line.xOffset + i * blockWidth;
          this.backgroundObjects.push(new BackgroundObject(line.path, x, parallax));
        });
      }
      this.addParallaxCompensation(layerGroup, blockWidth, parallax);
    });
  }

  /**
   * extend layers 2 and 3 by one element (necessary for parallax, because these layers are moving)
   * @param {array} layerGroup - array containing 2 background objects (left and right part of layer)
   * @param {number} blockWidth - width of two combined background elements
   * @param {number} parallax - value between 0 (static) and 1 (moving as fast as camera)
   */
  addParallaxCompensation(layerGroup, blockWidth, parallax) {
    if (parallax > 0) {
      const firstElement = layerGroup[0];
      const x = firstElement.xOffset + 2 * blockWidth;
      this.backgroundObjects.push(new BackgroundObject(firstElement.path, x, parallax));
    }
  }

  /**
   * spawn enemies; stop it, when character is near endboss, resume spawning when character moves away
   */
  handleEnemySpawning() {
    if(this.spawnIntervalId) return;
    this.spwanPaused = false;
    this.spawnIntervalId = setInterval(() => {
      if(this.character.x < 1850) {
        this.createNewEnemy();
      } else if(this.character.x >= 1800 && !this.spawnPaused) {
        this.spawnPaused = true;
      }
    }, 1200);
  }

  /**
   * helper function for "handleEnemySpawning"; create new enemy and set it to active, if gameRunning in "world" is "true"
   */
  createNewEnemy() {
    const enemy = Math.random() < 0.5 ? new Chicken() : new Babychicken();
    enemy.x = this.character.x + 650 + Math.random() * 200;
    enemy.world = this;
    enemy.isActive = this.gameRunning;
    this.level.enemies.push(enemy);
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkMuteShortcut();
    }, 200);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // canvas clearen

    // snapshot machen, Kamera verschieben(camera_x ist null, bis sich character bewegt)
    this.ctx.save();
    this.ctx.translate(this.camera_x, 0);

    // fertige Elemente einzeln einfügen (in world, tw. über level, definiert, also "this")
    this.addObjectsToMap(this.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.missiles);

      this.ctx.save();
      this.ctx.translate(-this.camera_x, 0);
      this.addObjectsToMap(this.level.statusBars);
      this.ctx.restore();

    this.addObjectsToMap(this.level.coins);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.bottles);
    // Zustand wiederherstellen (2 Alternativen)
    this.ctx.restore();
    // this.ctx.translate(-this.camera_x, 0);

    // draw immer wieder aufrufen. "self": kleiner Hack, weil "this" in der function nicht mehr gekannt wird.
    let self = this;
    requestAnimationFrame(function() {
      self.draw();
    })
  }
  // NB: mit arrow-function geht es ohne hack: requestAnimationFrame(() => this.draw());


  // Hilfsfunktionen für draw() und addObjectsToMap()
  // zeichne das einzelne Objekt (für charcter: nur diese)
  addToMap(mo) {
    if(mo.otherDirection) {
      this.flipImage(mo);
    }

    // has its own drawing method (because of parallax)
    if(mo instanceof BackgroundObject) {
      mo.drawBackground(this.ctx, this.camera_x);
    } else {
      mo.draw(this.ctx);
    }

    if(mo instanceof MovableObject) {
      mo.drawFrame(this.ctx);
      mo.drawInnerFrame(this.ctx, this.offset);
    }

    if(mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  // Hilfsfunktion für addObjectsToMap(): für bottles und coins
  addStaticToMap(obj) {
    obj.draw(this.ctx);
    obj.drawFrame(this.ctx);
    obj.drawInnerFrame(this.ctx, this.offset);
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  addObjectsToMap(objects) {
    objects.forEach(obj => {
      if (obj instanceof CollectableObject) {
        this.addStaticToMap(obj);
      } else if (!obj.destroyed) {
        this.addToMap(obj);
      }
      // nichts zeichnen, wenn destroyed = true
    });
  }

  /**
   * shortcut for mute or play background music and sounds during the game
   */
  checkMuteShortcut() {
    if(this.keyboard.M) {
      // console.log("m pressed");
      backgroundMusicOnOff('muteBtn');
      const muted = this.level.soundManager.toggleGameSounds();
      muteBtn.src = muted ? "./assets/volume_off.png" : "./assets/volume_up.png";
      this.keyboard.M = false;
    };
  }

  checkCollisions() {
    if (this.character.deathSequenceStarted) return;

    this.level.enemies.forEach((enemy, index) => {

      if (enemy instanceof DeadChicken || enemy instanceof DeadBabyChicken) {
        return; // Tote Gegner sind harmlos
      }

      if(this.character.isCrushing(enemy) 
        && !(enemy instanceof DeadChicken) 
        && !(enemy instanceof DeadBabyChicken)
        && this.character.isFalling() 
      ) {
        this.character.isCrushingEnemy = true;
        this.level.soundManager.playSound('crushChicken');

        if (enemy instanceof Chicken) {
          this.level.enemies.splice(index, 1, new DeadChicken(enemy.x));
          if(this.character.energy < 100) this.character.energy += 2;
          console.log("new energy: ", this.character.energy);
        } else if (enemy instanceof Babychicken) {
          this.level.enemies.splice(index, 1, new DeadBabyChicken(enemy.x));
          if(this.character.energy < 100) this.character.energy += 5;
          console.log("new energy: ", this.character.energy)
        }
        setTimeout (() => {
          this.character.isCrushingEnemy = false;
        }, 500);
        return;
      }

      if (this.character.isColliding(enemy)
        && enemy.canHurt
        && !(enemy instanceof DeadChicken) 
        && !(enemy instanceof DeadBabyChicken)
        && !(enemy instanceof Endboss)
      ) {
        enemy.disableAbility('canHurt', 1000);
        this.character.disableAbility('canCollectObject', 1000);
        this.character.hit();
        this.level.soundManager.playSound('characterHurt');
        this.level.statusBars[0].setPercentage(this.character.energy);
        console.log("energy: ", this.character.energy);
        }

      // aufgeräumt
      if (enemy instanceof Endboss && this.character.isColliding(enemy)) {
        this.character.energy = 0;
        this.character.runCharacterDeathSequence(3200);
        this.level.endboss.playEndbossVictorySequence();
        }
      });

            // collision with coin or bottle
      if(this.character.canCollectObject && this.character.energy > 0) {
        if(this.level.coins.length > 0) {
          this.character.grabObject("coins", 20, 1, 'coinClink');
        };
        if(this.level.bottles.length > 0) {
          this.character.grabObject("bottles", 20, 2, 'bottleClink');
        };
      };
      
      this.missiles.forEach(missile => {
        if (missile.destroyed || missile.hasHitTarget) return; 
        this.level.enemies.forEach(enemy => {
          if (enemy instanceof Endboss && missile.isColliding(enemy)) {
            this.level.endboss.takeDamage();
            missile.markAsHit();
            this.level.statusBars[3].setPercentage(this.level.endboss.strength);
            console.log("Endboss hurt!", this.level.endboss.strength);
          };          
        });
      });   
    }

  // für den Fall, dass Pepe sich mal zusätzlich Munition holen kann, sobald er wieder unter 5 Flaschen ist
  provisionsComplete(category) {
    if(this.level[category + "Power"] >= 100) {
      console.log(category, "is complete, collecting stopped");
      return true;
    }
  }

  // bedürfte in grabObject dieser Kontrolle: 
  // if(!this.world.provisionsComplete(category)) {...
    // if(this.world.level[category + "Power"] > 100) {
        //   this.world.level[category + "Power"] = 100;
        // }
  // }

  /**
   * main function for handling game over (called functions: see also game.js, section 6).
   * functin is async, because it has to wait until fullscreen mode is left.
   * @param {string} endImage - path of image (of Pepe)
   * @param {string} sound - name of gameover sound
   */
  async gameover(endImage, sound) {
    await fullscreenChecker();
    showEndscreen(endImage);
    this.handleGameOverAudio(sound);
    arrangeButtonsAtGameover();
  }

  /**
   * helper function for "gameover": stop background music and all game sounds, then play gameover-sound.
   * @param {string} sound - name of gameover sound
   */
  handleGameOverAudio(sound) {
    this.level.soundManager.toggleGameSounds();
    stopCurrentMusic();
    if (soundOn) {
      this.level.soundManager.sounds[sound].muted = false;
      this.level.soundManager.playSound(sound);
    }
  }

  resetGame() {
    console.log("restarting game...");
    this.level.reset(); // enemies, clouds, coins, bottles neu erstellen, statusBars zurücksetzen, Zählungen von coins, bottles, collected auf  0
    this.character = new Character();
    this.camera_x = 0;
    this.missiles = [];
    this.spawnIntervalId = null;

    this.setWorld();  // wozu brauchbt es den gleich?
    this.gameOver = false; // als letzter Punkt vor "startGame()"
    
    console.log("Character startet bei x:", this.character.x); // WEGEN RESTART-PROBLEM
  }
}

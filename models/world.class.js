class World {
  ctx;
  canvas;
  keyboard;

  camera_x = 0;
  character = new Character();
  level = level1; // enthält die "Bestandteile" der anderen Obj. (enemies, clouds...)
  
  // weapon = new ThrowableObject(this.level.soundManager);

  constructor(canvas) {
    this.ctx = canvas.getContext('2d'); // das Werkzeug zum canvas; ctx initialisieren
    this.canvas = canvas; // das 'Argument-canvas' wird nach aussen in das 'world-canvas' übertragen.
    this.keyboard = keyboard;
    this.setWorld();
    this.setBackgroundLayers();
    this.missiles = [];

    this.spawnIntervalId = null; // die id setzt der Browser durch "setInterval" (ist normalerweise eine Zahl)
    this.startEnemySpawning();
    this.draw();
    this.run();
  };

  // Zugriff auf die Variablen von "world" ermöglichen für die diversen Objekte.
  setWorld() {
    this.character.world = this;
  }

  backgroundObjects = [];

  // Hintergrundobjekte erstellen. see also drawBackground in background-object class.
  setBackgroundLayers() {
    const blockWidth = 1438; // Breite eines Blocks (zwei Teile zusammen)
    this.level.backgroundLayers.forEach(layerGroup => {
      const parallax = layerGroup[0].parallax; // Parallaxe für die Layer (steht in beiden Segmenten, brauche es nur 1x, daher [0])
      for (let i = 0; i < 2;  i++) {
        layerGroup.forEach(line => {
          const x = line.xOffset + i * blockWidth;
          this.backgroundObjects.push(new BackgroundObject(line.path, x, parallax));
        });
      }
      this.addParallaxCompensation(layerGroup, blockWidth, parallax);
    });
  }

  // Landschaft für layer 2 und 3 um ein Element nach rechts verlängern.
  addParallaxCompensation(layerGroup, blockWidth, parallax) {
    if (parallax > 0) {
      const firstElement = layerGroup[0];
      const x = firstElement.xOffset + 2 * blockWidth; // an die richtige Position hängen
      this.backgroundObjects.push(new BackgroundObject(firstElement.path, x, parallax));
    }
  }

  startEnemySpawning() {
    if(this.spawnIntervalId) return;
    this.spwanPaused = false;
    // this.chickenCluking.play();

    this.spawnIntervalId = setInterval(() => {
      if(this.character.x < 1800) {
        // console.log("spwan new enemy.");
        const enemy = Math.random() < 0.5 ? new Chicken() : new Babychicken();
        enemy.x = this.character.x + 650 + Math.random() * 200;
        this.level.enemies.push(enemy);
      } else if(this.character.x >= 1800 && !this.spawnPaused) {
          // console.log("spawning stopped, character near endboss.");
          this.spawnPaused = true;
        }
    }, 1000);
  }

  draw() {
    // canvas clearen
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // snapshot machen, Kamera verschieben(camera_x ist null, bis sich character bewegt)
    this.ctx.save();
    this.ctx.translate(this.camera_x, 0);

    // fertige Elemente einzeln einfügen (in world, tw. über level, definiert, also "this")
    this.addObjectsToMap(this.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.missiles);
    // this.addToMap(this.weapon);
    // if (this.weapon.missileVisible == true) this.addToMap(this.weapon);

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
  // NB: mit arrow-function geht es ohne hack: 
  // requestAnimationFrame(() => this.draw());


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

  // iteriere über Objekt-array und zeichne die einzelnen Objekte. enemies, clouds, bkg-objects.
  // addObjectsToMap(objects) {
  //   objects.forEach(obj => {
  //     if (obj instanceof CollectableObject) {
  //       this.addStaticToMap(obj);
  //     } else if (!obj.destroyed) {
  //       this.addToMap(obj);
  //     } else {
  //       this.addToMap(obj);
  //   };});
  // }

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

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkMuteShortcut();
    }, 200);
  }

  checkMuteShortcut() {
    if(this.keyboard.M) {
      // console.log("m pressed");
      const muted = this.level.soundManager.toggleMute();
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
        // console.log("enemy crushed!");
        this.level.soundManager.playSound('crushChicken');

        if (enemy instanceof Chicken) {
          this.level.enemies.splice(index, 1, new DeadChicken(enemy.x));
          if(this.character.energy < 100) this.character.energy += 2;
          // console.log("+2 points.");
        } else if (enemy instanceof Babychicken) {
          this.level.enemies.splice(index, 1, new DeadBabyChicken(enemy.x));
          if(this.character.energy < 100) this.character.energy += 5;
          // console.log("+5 points.");
        }
        return;
      }

      else if (this.character.isColliding(enemy)
        && enemy.canHurt
        && !(enemy instanceof DeadChicken) 
        && !(enemy instanceof DeadBabyChicken)
      ) {
        enemy.disableAbility('canHurt', 1000);
        this.character.disableAbility('canCollectObject', 1000);

        this.character.playAnimation(this.character.imagesHurt);
        this.character.hit();
        this.level.soundManager.playSound('characterHurt');
        this.level.statusBars[0].setPercentage(this.character.energy);
        console.log("energy: ", this.character.energy);
        }
      });


      this.missiles.forEach(missile => {
        if (missile.destroyed || missile.hasHitTarget) return; 
        this.level.enemies.forEach(enemy => {
          if (enemy instanceof Endboss && missile.isColliding(enemy)) {
            missile.markAsHit();
            this.level.endboss.takeDamage();
            console.log("💥 Endboss hurt!", this.level.endboss.strength);

            // checkCollisions deaktivieren: wenn Pepe weit genug links steht beim Sieg, spwanen Hühner und kollidieren mit ihm.
            if(this.level.endboss.strength == 0) {
              setTimeout(() => {
                this.gameover('./assets/You_won.png', 'winner');
                }, 3000);
              }
          };          
        });
      });
        
      if(this.character.canCollectObject && this.character.energy > 0) {
        if(this.level.coins.length > 0) {
          this.grabObject("coins", 20, 1, 'coinClink');
        };
        if(this.level.bottles.length > 0) {
          this.grabObject("bottles", 20, 2, 'bottleClink');
        };
      };
  }


  grabObject(category, gain, statusBar, sound) {
    if(!this.provisionsComplete(category)) {
      this.level[category].forEach((item, index) => {
      if(this.character.isColliding(item)) {
        this.level.soundManager.playSound(sound);
        this.level[category].splice(index, 1);
        this.level[category + "Power"] += gain;
        if(this.level[category + "Power"] > 100) {
          this.level[category + "Power"] = 100;
        }
        this.level.statusBars[statusBar].setPercentage(this.level[category + "Power"]);
        }
      });
    }
  }

  // für den Fall, dass Pepe sich mal zusätzlich Munition holen kann, sobald er wieder unter 5 Flaschen ist
  provisionsComplete(category) {
    if(this.level[category + "Power"] >= 100) {
      console.log(category, "is complete, collecting stopped");
      return true;
    }
  }


  gameover(endImage, sound) {
    this.showEndscreen(endImage);
    this.handleGameOverAudio(sound);
    this.toggleButtons();
    }

    // const endscreen = this.getFinalImage('./img/5_background/first_half_background.png');
  showEndscreen(endImage) {
    const endscreen = this.getFinalImage(endImage);
    const gamescreen = document.getElementById('canvas');
    gamescreen.replaceWith(endscreen);
  }

  getFinalImage(endImage) {
    const div = document.createElement('div');
    div.classList.add('gameover');
    div.innerHTML = `
      <img src="./img/5_background/first_half_background.png" alt="image of desert landscape" class="finalBackground">
      <img src=${endImage} class="overlay">
    `;
    return div;
  }

  toggleButtons() {
    document.querySelectorAll(".gameBtn").forEach(element => {
      element.classList.toggle("d-none");
    });
    document.querySelector(".big").classList.toggle("d-none");
  }

  handleGameOverAudio(sound) {
    muteBtn.removeEventListener('click', handleMuteClick);
    this.level.soundManager.toggleMute();
    this.level.soundManager.sounds[sound].muted = false;
    this.level.soundManager.playSound(sound);
  }
}
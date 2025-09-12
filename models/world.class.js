class World {
  ctx;
  canvas;
  keyboard;
  width = 4200;

  // sollte das nicht auch in das Level?
  statusBars = [
    new StatusBar('energy', 100, 0),
    new StatusBar('coin', 0, 50),
    new StatusBar('bottle', 0, 100)
  ];

  // nicht im constructor
  camera_x = 0;
  character = new Character();
  level = level1; // enthält die "Bestandteile" der anderen Obj. (enemies, clouds...)

  constructor(canvas) {
    this.ctx = canvas.getContext('2d'); // das Werkzeug zum canvas; ctx initialisieren
    this.canvas = canvas; // das 'Argument-canvas' wird nach aussen in das 'world-canvas' übertragen.
    this.keyboard = keyboard;
    this.setWorld();
    this.setBackgroundLayers();

    this.spawnIntervalId = null; // die id setzt der Browser durch "setInterval" (ist normalerweise eine Zahl)
    this.startEnemySpawning();
    this.draw();
    this.checkCollisions();
  };

  // Zugriff auf die Variablen von "world" ermöglichen für die diversen Objekte.
  setWorld() {
    this.character.world = this;
  }

  backgroundObjects = [];

  // Hintergrundobjekte erstellen.
  setBackgroundLayers() {
    const blockWidth = 1438; // Breite eines Blocks (zwei Teile zusammen)
    this.level.backgroundLayers.forEach(group => {
      const parallax = group[0].parallax; // Parallaxe für die Layer (steht in beiden Segmenten, brauche es nur 1x, daher [0])
      for (let i = -1; i < 2;  i++) {
        group.forEach(line => {
          const x = line.xOffset + i * blockWidth;
          this.backgroundObjects.push(new BackgroundObject(line.path, x, parallax));
        });
      }
    });
    // console.log("Hintergrundteile: ", this.backgroundObjects); // 0-5: Himmel. 6-11: Berg. 12-17: rote Kakteen. 18-23: Vordergrund.
  }

  startEnemySpawning() {
    if(this.spawnIntervalId) return;
    this.spawnIntervalId = setInterval(() => {
      if(this.character.x >= 1800) {
        clearInterval(this.spawnIntervalId);
        this.spawnIntervalId = null;
        console.log("spawning stopped, character near endboss.");
        return;
      }
      console.log("spwan new enemy.");
      const enemy = Math.random() < 0.5 ? new Chicken() : new Babychicken();
      enemy.x = this.character.x + 650 + Math.random() * 200;
      this.level.enemies.push(enemy);
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

      this.ctx.save();
      this.ctx.translate(-this.camera_x, 0);
      this.addObjectsToMap(this.statusBars);
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


  // Hilfsfunktionen für draw()
  // zeichne das einzelne Objekt (für charcter: nur diese)
  addToMap(mo) {
    if(mo.otherDirection) {
      this.flipImage(mo);
    }

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

  addStaticToMap(obj) {
    obj.draw(this.ctx);
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
  addObjectsToMap(objects) {
    //   if (!objects) {
    // console.warn("addObjectsToMap: objects ist undefined!");
    // return;
  // }
    objects.forEach(obj => {
      if (obj instanceof CollectableObject) {
        this.addStaticToMap(obj);
      } else {
        this.addToMap(obj);
      }
  });
  }

  checkCollisions() {
    setInterval(() => {
      let canCollectObject = true;

      this.level.enemies.forEach(enemy => {
      if(this.character.isColliding(enemy)) {
        canCollectObject = false;
        this.character.playAnimation(this.character.imagesHurt);
        this.character.hit();
        this.statusBars[0].setPercentage(this.character.energy);
        console.log("energy: ", this.character.energy);
        }
      });
        
      if(canCollectObject && this.character.energy > 0) {
        if(this.level.coins.length > 0) {
          this.grabObject("coins", 20, 1);
        };
        if(this.level.bottles.length > 0) {
          this.grabObject("bottles", 20, 2);
        };
      };
    }, 200);
  }

  grabObject(category, gain, statusBar) {
    if(!this.provisionsComplete(category)) {
      this.level[category].forEach((item, index) => {
      if(this.character.isColliding(item)) {
        this.level[category].splice(index, 1);
        this.level[category + "Power"] += gain;
        if(this.level[category + "Power"] > 100) {
          this.level[category + "Power"] = 100;
        }
        this.statusBars[statusBar].setPercentage(this.level[category + "Power"]);
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


}
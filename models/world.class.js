class World {
  // im constructor erscheinende Variablen
  ctx;
  canvas;
  keyboard;

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
    this.draw();
  }

  // Zugriff auf die Variablen von "world" ermöglichen für die diversen Objekte.
  setWorld() {
    this.character.world = this;
  }

  backgroundObjects = [
  ];

  // Hintergrundobjekte erstellen.
  setBackgroundLayers() {
    const blockWidth = 1440; // Breite eines Blocks (zwei Teile zusammen)
    this.level.backgroundLayers.forEach(group => {
      const parallax = group[0].parallax; // Parallaxe für die Layer (steht in beiden Segmenten, brauche es nur 1x, daher [0])
      for (let i = -1; i < 2;  i++) {
        group.forEach(line => {
          const x = line.xOffset + i * blockWidth;
          this.backgroundObjects.push(new BackgroundObject(line.path, x, parallax));
        });
      }
    });
    console.log("Hintergrundteile: ", this.backgroundObjects); // 0-5: Himmel. 6-11: Berg. 12-17: rote Kakteen. 18-23: Vordergrund.
  }


  draw() {
    // canvas clearen
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // snapshot machen, Kamera verschieben(camera_x ist null, bis sich character bewegt)
    this.ctx.save();
    this.ctx.translate(this.camera_x, 0);

    // fertige Elemente einzeln einfügen (in world, tw. über level, definiert, also "this")
    this.addObjectsToMap(this.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);

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
    // mo.drawFrame(this.ctx);

    if(mo.otherDirection) {
      this.flipImageBack(mo);
    }
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
    objects.forEach(obj => {
      this.addToMap(obj);
    })
  }
}
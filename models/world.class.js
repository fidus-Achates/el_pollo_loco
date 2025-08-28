class World {
  canvas; // für erste Zeile von "draw" (Argumente)
  ctx; // wird eine solche Variable aufgerufen, muß immer "this." davorstehen.
  keyboard;
  camera_x = 0;
  character = new Character();
  level = level1;

  // world zeichnen (an sich, nicht ihre Details)
  constructor(canvas) {
    this.ctx = canvas.getContext('2d'); // das Werkzeug zum canvas; ctx initialisieren
    this.canvas = canvas; // das 'Argument-canvas' wird nach aussen in das 'world-canvas' übertragen.
    this.draw(); // Achtung, die Regel mit "this" gilt auch für Funktionen.
    this.keyboard = keyboard;
    this.setWorld();
    this.setBackgroundLayers();
  }


  // Zugriff auf die Variablen von "world" ermöglichen für die diversen Objekte.
  setWorld() {
    this.character.world = this;
  }

  backgroundObjects = [
  ];

  setBackgroundLayers() {
    const width = 720;
    const offsets = [-2 * width, 0, 2 * width]; 

    this.level.backgroundLayers.forEach(layer => {
      offsets.forEach(offset => {
      this.backgroundObjects.push(new BackgroundObject(layer.path, layer.xOffset + offset));
      })
    })
  }

  draw() {
    // canvas clearen
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // snapshot machen, Kamera verschieben(ihr Wert kommt vom character)
    this.ctx.save();
    this.ctx.translate(this.camera_x, 0);

    // Elemente einzeln einfügen (in world definiert, also "this")
    this.addObjectsToMap(this.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);

    // Zustand wiederherstellen ( 2 Alternativen)
    this.ctx.restore();
    // this.ctx.translate(-this.camera_x, 0);

    // draw immer wieder aufrufen. "self": kleiner Hack, weil "this" in der function nicht mehr gekannt wird.
    let self = this;
    requestAnimationFrame(function() {
      self.draw();
    })
  }

  // Hilfsfunktionen für draw()
  // zeichne das einzelne Objekt (für charcter: nur diese)
  addToMap(mo) {
    if(mo.otherDirection) {
      this.ctx.save();
      this.ctx.translate(mo.width, 0);
      this.ctx.scale(-1, 1);
      mo.x = mo.x * -1;
    }

    this.ctx.drawImage(
      mo.img,
      mo.x,
      mo.y,
      mo.width,
      mo.height
    );

    if(mo.otherDirection) {
      this.ctx.restore();
      mo.x = mo.x * -1;
    }
  }

  // iteriere über Objekt-array und zeichne die einzelnen Objekte. enemies, clouds, bkg-objects.
  addObjectsToMap(objects) {
    objects.forEach(obj => {
      this.addToMap(obj);
    })
  }
}
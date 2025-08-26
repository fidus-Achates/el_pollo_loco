class World {
  canvas; // für erste Zeile von "draw" (Argumente)
  ctx; // wird eine solche Variable aufgerufen, muß immer "this." davorstehen.
  keyboard;

  // world zeichnen (an sich, nicht ihre Details)
  constructor(canvas) {
    this.ctx = canvas.getContext('2d'); // das Werkzeug zum canvas; ctx initialisieren
    this.canvas = canvas; // das 'Argument-canvas' wird nach aussen in das 'world-canvas' übertragen.
    this.draw(); // Achtung, die Regel mit "this" gilt auch für Funktionen.
    this.keyboard = keyboard;
    this.setWorld();
  }
  
  character = new Character();
  enemies = [
    new Chicken(),
    new Chicken(),
    new Chicken()
  ];

  clouds = [
    new Cloud()
  ]

  // hinterste Bildschicht zuerst, vorderste zuletzt
  backgroundObjects = [
    new BackgroundObject('img/5_background/layers/air.png', 0),
    new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
    new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
    new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
  ]

  
  // Zugriff auf die Variablen von "world" ermöglichen für die diversen Objekte.
  setWorld() {
    this.character.world = this;
  }

  draw() {
    // canvas clearen
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Elemente einzeln einfügen (charackter etc.: in world definiert, also "this")
    this.addObjectsToMap(this.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.clouds);
    this.addObjectsToMap(this.enemies);

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
class World {
  character = new Character();
  
  enemies = [
    new Chicken(),
    new Chicken(),
    new Chicken()
  ];

  canvas; // für erste Zeile von "draw" (Argumente)
  ctx;

  // wird eine solche Variable aufgerufen, muß immer "this." davorstehen.
  constructor(canvas) {
    this.ctx = canvas.getContext('2d'); // das Werkzeug zum canvas
    this.canvas = canvas; // das 'Argument-canvas' wird nach aussen in das 'world-canvas' übertragen.
    this.draw(); // Achtung, die Regel mit "this" gilt auch für Funktionen.
  }

  draw() {
    // canvas clearen
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Zeichnen: character (in world definiert, also "this")
    this.ctx.drawImage(
      this.character.img,
      this.character.x,
      this.character.y,
      this.character.width,
      this.character.height
    )

    // Zeichnen: enemies (in world definiert, also "this"). ABER NICHT FÜR EINZELNE "ENEMY"
    this.enemies.forEach(enemy => {
      this.ctx.drawImage(
        enemy.img,
        enemy.x,
        enemy.y,
        enemy.width,
        enemy.height
      )
    })

    // draw immer wieder aufrufen. "self": kleiner Hack, weil "this" in der function nicht mehr gekannt wird.
    let self = this;
    requestAnimationFrame(function() {
      self.draw();
    })
  }
}
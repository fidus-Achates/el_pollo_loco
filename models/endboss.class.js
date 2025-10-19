class Endboss extends MovableObject {

  x = 2500;
  y = 40;
  width = 300;
  height = 420;

  offset = {
    top: 120,
    right: 100,
    bottom: 180,
    left: 45
  }

  strength = 5;

  constructor() {
    super();
    this.imagesEndboss = ENEMIES_IMAGES['endboss_angry'];
    this.imagesEndbossHurt = ENEMIES_IMAGES['endboss_hurt'];
    this.imagesFlapping = ENEMIES_IMAGES['endboss_flapping'];
    this.imagesAttacking = ENEMIES_IMAGES['endboss_attacking'];
    this.loadImage(this.imagesEndboss[0]);
    this.loadImages(this.imagesEndboss);
    this.loadImages(this.imagesEndbossHurt);
    this.loadImages(this.imagesFlapping);
    this.loadImages(this.imagesAttacking);
    this.animate();
  }

  /**
   * constantly move Endboss (head, wing)
   */
  animate() {
    setInterval(() => {
      this.playAnimation(this.imagesEndboss);
    }, 200);
  }

  takeDamage() {
    this.strength--;
    const reaction = Math.random() < 0.4 ? this.flappingEndboss : this.attackingEndboss; // hier ja keine Klammern schreiben!!

    const endbossInjured = setInterval(() => {
    this.playAnimation(this.imagesEndbossHurt);
    }, 100);
    setTimeout(() => {
      clearInterval(endbossInjured);
      reaction.call(this); // ohne "call(this)" geht der Kontext (this) verloren; dann ist this undefiniert
    }, 500);

    // if (this.injuries == 0) {
    //   this.deadEndboss();
    // }
  }

  flappingEndboss() {
    console.log("flap");
    // this.world.level.soundManager.playSound('flapping'); // geht nicht
    const endbossFlapping = setInterval(() => {
    this.playAnimation(this.imagesFlapping);
    }, 100);
    setTimeout(() => {
      clearInterval(endbossFlapping);
    }, 1000);
  }

  attackingEndboss() {
    console.log("attack");
    const endbossAttacking = setInterval(() => {
      this.x -= 15;
    this.playAnimation(this.imagesAttacking);
        }, 100);
    setTimeout(() => {
      clearInterval(endbossAttacking);
    }, 1000);
  }

  deadEndboss() {
    console.log("💀 Endboss defeated!");
    this.playAnimation(this.imagesDead);
    this.soundManager.playSound('bossDie');
  }


}
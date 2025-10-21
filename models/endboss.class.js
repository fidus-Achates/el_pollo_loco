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

  isDead = false;
  animationInterval = null; // um die Daueranimation stoppen zu können

  constructor(soundManager) {
    super();
    this.soundManager = soundManager;
    this.imagesEndboss = ENEMIES_IMAGES['endboss_angry'];
    this.imagesEndbossHurt = ENEMIES_IMAGES['endboss_hurt'];
    this.imagesEndbossDead = ENEMIES_IMAGES['endboss_dead'];
    this.imagesFlapping = ENEMIES_IMAGES['endboss_flapping'];
    this.imagesAttacking = ENEMIES_IMAGES['endboss_attacking'];
    this.loadImage(this.imagesEndboss[0]);
    this.loadImages(this.imagesEndboss);
    this.loadImages(this.imagesEndbossHurt);
    this.loadImages(this.imagesEndbossDead);
    this.loadImages(this.imagesFlapping);
    this.loadImages(this.imagesAttacking);
    this.animate();
  }

  /**
   * move waiting Endboss (head, wing)
   */
  animate() {
    if (this.animationInterval) return;
    this.animationInterval = setInterval(() => {
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

      if (this.strength > 0) {
        reaction.call(this); // ohne "call(this)" geht der Kontext (this) verloren; dann ist this undefiniert
      } else {
        console.log("Endboss defeated!");
        this.isDead = true;
        this.soundManager.playSound('endbossDead');

        if (this.animationInterval) {
          clearInterval(this.animationInterval);
          this.animationInterval = null;
        }

        const endbossDead = setInterval(() => {
          this.playAnimationWithInterval(this.imagesEndbossDead, 90);
          }, 90);
          setTimeout(() => {
            clearInterval(endbossDead);
            this.loadImage(this.imagesEndbossDead[2]);
            }, 1000);}
    }, 500);
  }

  // Die zwei folgenden Funktionen sind fast gleich; nur die Bewegung bei "attacking" kommt hinzu
  flappingEndboss() {
    console.log("flap");
    this.soundManager.playSound('flapping');
    const endbossFlapping = setInterval(() => {
    // this.playAnimation(this.imagesFlapping);
    this.playAnimationWithInterval(this.imagesFlapping, 80);
    }, 80);
    setTimeout(() => {
      clearInterval(endbossFlapping);
    }, 1200);
  }

  attackingEndboss() {
    console.log("attack");
    this.soundManager.playSound('attacking');
    const endbossAttacking = setInterval(() => {
      this.x -= 25;
    this.playAnimation(this.imagesAttacking);
    // this.playAnimationWithInterval(this.imagesAttacking, 100); // diese Sequenz zuckt immer noch
        }, 120);
    setTimeout(() => {
      clearInterval(endbossAttacking);
    }, 1000);
  }

  // deadEndboss() {
  //   console.log("Endboss defeated!");
  //   this.playAnimation(this.imagesDead);
  //   this.soundManager.playSound('endbossDead');
  // }


}
class Endboss extends MovableObject {

  x = 2500;
  y = 40;
  width = 300;
  height = 420;

  offset = {
    top: 155,
    right: 50,
    bottom: 170,
    // bottom: 100,
    // left: 55
    left: 33
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
   * continuous animation: move waiting Endboss (head, wing)
   */
  animate() {
    if (this.animationInterval) return;
    this.animationInterval = setInterval(() => {
      this.playAnimation(this.imagesEndboss);
    }, 200);
  }

  // OK, aufgeräumt
  takeDamage() {
    this.strength--;
    const endbossInjured = setInterval(() => {
      this.playAnimation(this.imagesEndbossHurt);
    }, 100);
    setTimeout(() => {
      clearInterval(endbossInjured);
      this.behaviourInjuredEndboss()
    }, 500);
  }

  // OK, aufgeräumt
  behaviourInjuredEndboss() {
    const reaction = Math.random() < 0.4 ? this.flappingEndboss : this.attackingEndboss; // hier ja keine Klammern schreiben!!
    if (this.strength > 0) {
      reaction.call(this); // ohne "call(this)" geht der Kontext (this) verloren; dann ist this undefiniert
    } else {
      this.isDead = true; // nötig?

      this.stopContinuousAnimation();
      this.dyingEndboss();
    }
  }

  // OK, aufgeräumt
  flappingEndboss() {
    console.log("flap");
    this.soundManager.playSound('flapping');
    const endbossFlapping = setInterval(() => {
      this.playAnimationWithInterval(this.imagesFlapping, 80);
    }, 80);
    this.stopEndbossReaction(endbossFlapping);
  }

  // OK, aufgeräumt
  attackingEndboss() {
    console.log("attack");
    this.soundManager.playSound('attacking');
    const endbossAttacking = setInterval(() => {
      this.x -= 25;
      this.playAnimationWithInterval(this.imagesAttacking, 100); // diese Sequenz zuckt immer noch
    }, 120);
    this.stopEndbossReaction(endbossAttacking);
  }

  // OK, aufgeräumt
  stopEndbossReaction(intervalName) {
    setTimeout(() => {
      clearInterval(intervalName);
    }, 1200);
  }

  // OK, aufgeräumt. Prepares dying-endboss animation by stopping continuous animation first
  stopContinuousAnimation() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }

  // OK, aufgeräumt
  dyingEndboss() {
    this.soundManager.playSound('endbossDead');
    const endbossDead = setInterval(() => {
    this.playAnimationWithInterval(this.imagesEndbossDead, 90);
    }, 90);
    setTimeout(() => {
      clearInterval(endbossDead);
      this.loadImage('./assets/explosion.png');
    }, 1000);
  }

  // OK, aufgeräumt
  playEndbossVictorySequence() {
    setTimeout(() => {
      this.soundManager.playSound('rooster');
    }, 600);
    const endbossWinInterval = setInterval(() => {
      this.playAnimationWithInterval(this.imagesFlapping, 80);
    }, 80);

    setTimeout(() => {
      clearInterval(endbossWinInterval);
    }, 3200);
  }

}
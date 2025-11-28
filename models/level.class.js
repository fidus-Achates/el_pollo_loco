class Level {

  enemies;
  clouds;
  backgroundLayers;
  coins;
  bottles;
  soundManager;
  statusBars;
  
  coinsPower = 0;
  bottlesPower = 0;
  bottlesCollected = 0;

  // all parameters come from level1.js
  constructor(enemies, clouds, backgroundLayers, coins, bottles, soundManager, statusBars) {
    this.enemies = enemies;
    this.endboss = enemies.find(e => e instanceof Endboss);
    this.clouds = clouds;
    this.backgroundLayers = backgroundLayers;
    this.coins = coins;
    this.bottles = bottles;
    this.soundManager = soundManager;
    this.statusBars = statusBars;
  }

  /**
   * reset level to initial state
   */
  reset() {
    // this.enemies = [];

    console.log("neue enemies before: ", this.enemies);
    this.enemies = createEnemies();
    console.log("neue enemies after: ", this.enemies);
    this.clouds = createClouds();
    this.coins = createCoins();
    this.bottles = createBottles();
    this.coinsPower = 0;
    this.bottlesPower = 0;
    this.bottlesCollected = 0;
    this.statusBars[0].setPercentage(100); // energy
    this.statusBars[1].setPercentage(0); // coins
    this.statusBars[2].setPercentage(0); // bottles
    if (this.statusBars.length > 3) {
      this.statusBars = this.statusBars.slice(0, 3);  // remove endboss-statusbar
    }

    // console.log("endboss is at: ", this.endboss.x);
    // this.endboss.reset();
    // console.log("endboss is now at: ", this.endboss.x);

  }
}
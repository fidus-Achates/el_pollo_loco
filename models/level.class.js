class Level {

  enemies;
  clouds;
  backgroundLayers;
  coins;
  bottles;
  soundManager;
  statusBars;
  
  //level_start_x = 0; // wo werden die beiden abgefragt?
  //level_end_x = 2160; // wo werden die beiden abgefragt?
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
}
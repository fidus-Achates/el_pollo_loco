class Level {

  enemies;
  clouds;
  backgroundLayers;
  coins;
  bottles;
  soundManager;
  statusBars;
  
  // level_start_x = -1440;
  level_start_x = 0;
  level_end_x = 2160;
  coinsPower = 0;
  bottlesPower = 0;

  // all parameters come from level1.js
  constructor(enemies, clouds, backgroundLayers, coins, bottles, soundManager, statusBars) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundLayers = backgroundLayers;
    this.coins = coins;
    this.bottles = bottles;
    this.soundManager = soundManager;
    this.statusBars = statusBars;
  }
}
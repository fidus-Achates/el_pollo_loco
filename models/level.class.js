class Level {
  enemies;
  clouds;
  backgroundLayers;
  coins;
  bottles;
  soundManager;
  level_start_x = -1440;
  level_end_x = 2160;
  coinsPower = 0;
  bottlesPower = 0;

  constructor(enemies, clouds, backgroundLayers, coins, bottles, soundManager) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundLayers = backgroundLayers;
    this.coins = coins;
    this.bottles = bottles;
    this.soundManager = soundManager;
  }
}
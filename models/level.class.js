class Level {
  enemies;
  clouds;
  backgroundLayers;
  coins;
  bottles;
  level_start_x = -1440;
  level_end_x = 2160;

  constructor(enemies, clouds, backgroundLayers, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundLayers = backgroundLayers;
    this.coins = coins;
    this.bottles = bottles;
  }
}
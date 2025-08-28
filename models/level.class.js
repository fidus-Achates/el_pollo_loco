class Level {
  enemies;
  clouds;
  backgroundObject;
  level_start_x = -1440;
  level_end_x = 2160;

  constructor(enemies, clouds, backgroundLayers) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundLayers = backgroundLayers;
  }
}
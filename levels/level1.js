// prepare all objects - except for character - for this level and use them as arguments
// for a new Level Object

let clouds =   [
  new Cloud(280),
  new Cloud(1300),
  new Cloud(2000),
];

let coins = [
  new Coin(),
  new Coin(),
  new Coin(),
  new Coin(),
  new Coin()
];

coins = distributeItems(coins, 500, 200, 350);

let bottles = [
  new Bottle(),
  new Bottle(),
  new Bottle(),
  new Bottle(),
  new Bottle()
];

bottles = distributeItems(bottles, 600, 200, 100);

let chicken = [
  new Chicken(),
  // new Chicken(),
];

chicken = distributeItems(chicken, 500, 300, 500);

let babyChicken = [
  new Babychicken(),
  // new Babychicken(),
];

babyChicken = distributeItems(babyChicken, 700, 100, 500);

let enemies = [...chicken, ...babyChicken, new Endboss()];

/**
 * set horizontal gaps between objects of the same type by random, 
 * but avoid clustering by providing a minimal gap
 * @param {array} arr - array of objects (enemies, clouds etc.) to be positioned
 * @param {number} startX - x value for the first object
 * @param {number} minGap - minimum distance between two objects (x value)
 * @param {number} factor - increases Random()-number
 * @returns array of objects which are at an irregular distance from each other
 */
function distributeItems(arr, startX, minGap, factor) {
  let currentX = startX;
  arr.forEach(item => {
    item.x = currentX;
    let gap = Math.round(minGap + Math.random() * factor);
    currentX += gap;
    if (currentX > 2000)
      {currentX = 2000};
    // console.log(currentX);
  });
  return arr;
}

const soundManager = new SoundCollection();
// soundManager.addSound('clukingLoop', "./audio/chicken-cluking.mp3", true);
soundManager.addSound('clukingLoop', "./audio/chicken-noise.mp3", true);
soundManager.addSound('crushChicken', "./audio/chicken-crash.mp3");
soundManager.addSound('bottleClink', "./audio/bottle-clink.mp3");
soundManager.addSound('coinClink', "./audio/get-coin.mp3");
soundManager.addSound('bottleSmash', "./audio/glass-bottle-smash.mp3");
soundManager.addSound('characterHurt', "./audio/male-scream.mp3");
soundManager.addSound('gameover', "./audio/gameover.mp3");
soundManager.addSound('winner', "./audio/victory.mp3");

// base for world's method "setBackgroundLayers()"
const backgroundLayers = [
  [
    {path: 'img/5_background/layers/air.png', xOffset: 0, parallax: 0},
    {path: 'img/5_background/layers/air.png', xOffset: 719, parallax: 0},
  ],
  [
    {path: 'img/5_background/layers/3_third_layer/1.png', xOffset: 0, parallax: 0.08},
    {path: 'img/5_background/layers/3_third_layer/2.png', xOffset: 719, parallax: 0.08},
  ],
  [
    {path: 'img/5_background/layers/2_second_layer/1.png', xOffset: 0, parallax: 0.15},
    {path: 'img/5_background/layers/2_second_layer/2.png', xOffset: 719, parallax: 0.15},
  ],
  [
    {path: 'img/5_background/layers/1_first_layer/1.png', xOffset: 0, parallax: 0},
    {path: 'img/5_background/layers/1_first_layer/2.png', xOffset: 719, parallax: 0}
  ]
];

// arguments: name of status bar, percentage at start, y (for positioning)
statusBars = [
  new StatusBar('energy', 100, 0),
  new StatusBar('coin', 0, 50),
  new StatusBar('bottle', 0, 100)
];


const level1 = new Level(
  enemies,
  clouds,
  backgroundLayers,
  coins,
  bottles,
  soundManager,
  statusBars
);
// Preparation (coins, bottles): set horizontal gaps by random, but avoid clustering by providing a minimal gap

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

function distributeItems(arr, startX, minGap, maxPlus) {
  let currentX = startX;
  arr.forEach(item => {
    item.x = currentX;
    let gap = minGap + Math.random() * maxPlus;
    currentX += gap;
    if (currentX > 2000)
      {currentX = 2000};
    console.log(currentX);
  });
  return arr;
}


const level1 = new Level(
  enemies,
  [
    new Cloud(-1000),
    new Cloud(280),
    new Cloud(1600),
  ],
  [
    [
      {path: 'img/5_background/layers/air.png', xOffset: 0, parallax: 0},
      {path: 'img/5_background/layers/air.png', xOffset: 719, parallax: 0},
    ],
    [
      {path: 'img/5_background/layers/3_third_layer/1.png', xOffset: 0, parallax: 0.05},
      {path: 'img/5_background/layers/3_third_layer/2.png', xOffset: 719, parallax: 0.05},
    ],
    [
      {path: 'img/5_background/layers/2_second_layer/1.png', xOffset: 0, parallax: 0.15},
      {path: 'img/5_background/layers/2_second_layer/2.png', xOffset: 719, parallax: 0.15},
    ],
    [
      {path: 'img/5_background/layers/1_first_layer/1.png', xOffset: 0, parallax: 0},
      {path: 'img/5_background/layers/1_first_layer/2.png', xOffset: 719, parallax: 0}
    ]
  ],
  coins,
  bottles,
);
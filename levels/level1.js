const level1 = new Level(
  [
    new Chicken(),
    new Chicken(),
    new Chicken(),
    new Babychicken(),
    new Babychicken(),
    new Babychicken(),
    new Endboss()
  ],
  [
    new Cloud(-1000),
    new Cloud(280),
    new Cloud(1600),
  ],
  // [
    // hinterste Bildschicht zuerst, vorderste zuletzt
  //   {path: 'img/5_background/layers/air.png', xOffset: 0, parallax: 0},
  //   {path: 'img/5_background/layers/3_third_layer/1.png', xOffset: 0, parallax: 0.3},
  //   {path: 'img/5_background/layers/2_second_layer/1.png', xOffset: 0, parallax: 0.6},
  //   {path: 'img/5_background/layers/1_first_layer/1.png', xOffset: 0, parallax: 1},

  //   {path: 'img/5_background/layers/air.png', xOffset: 720, parallax: 0},
  //   {path: 'img/5_background/layers/3_third_layer/2.png', xOffset: 720, parallax: 0.3},
  //   {path: 'img/5_background/layers/2_second_layer/2.png', xOffset: 720, parallax: 0.6},
  //   {path: 'img/5_background/layers/1_first_layer/2.png', xOffset: 720, parallax: 1}
  // ]

  [
    // hinterste Bildschicht zuerst, vorderste zuletzt
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
  ]
);
let canvas;
let world;
let keyboard = new Keyboard();

/**
 * launch building game world (executed in world.class.js), enable background-noise for game
 */
function init() {
  canvas = document.getElementById('canvas');
  world = new World(canvas);
  world.level.soundManager.startCluckingLoop();
  soundBtnHandler();
}

/**
 * play or mute background music on start page. onclick-function of btn
 * (function "toggleMute" see sounds.class.js)
 */
function soundBtnHandler() {
  const muteBtn = document.getElementById('muteBtn');
  muteBtn.addEventListener('click', () => {
    soundManager.toggleMute();
  });
}

// document.addEventListener('keydown', (e) => {
//   console.log(e);
// })

document.addEventListener("keydown", (e) => {
  if (e.code == "ArrowRight") keyboard.RIGHT = true;
  if (e.code == "ArrowLeft")  keyboard.LEFT = true;
  if (e.code == "ArrowUp")    keyboard.UP = true;
  // if (e.code == "ArrowDown")  keyboard.DOWN = true;
  if (e.code == "Space")      keyboard.SPACE = true;
  if (e.code == "KeyM")       keyboard.M = true;
});

document.addEventListener("keyup", (e) => {
  if (e.code == "ArrowRight") keyboard.RIGHT = false;
  if (e.code == "ArrowLeft")  keyboard.LEFT = false;
  if (e.code == "ArrowUp")    keyboard.UP = false;
  // if (e.code == "ArrowDown")  keyboard.DOWN = false;
  if (e.code == "Space")      keyboard.SPACE = false;
  if (e.code == "KeyM")       keyboard.M = false;
});

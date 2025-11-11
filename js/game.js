let canvas;
let world;
let keyboard = new Keyboard();

const muteBtn = document.getElementById('muteBtn');

/**
 * launch building game world (executed in world.class.js), enable background-noise for game
 */
function init() {
  canvas = document.getElementById('canvas');
  world = new World(canvas);
  playBackgroundMusic();
  // setBackgroundMusic('latinoMusic', 'soundIcon');
  // world.level.soundManager.startCluckingLoop();
  soundBtnHandler();
}

/**
 * onclick-function of sound-btn; (eventHandler will be desactivated at gameover).
 */
function soundBtnHandler() {
  muteBtn.addEventListener('click', handleMuteClick);
  console.log("soundBtnHandler");
}

/**
 * helper function for soundBtnHandler; play or mute background music on start page.
*/
function handleMuteClick() {
  soundManager.toggleMute();
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
  if (e.code == "KeyL")       keyboard.L = true;
  if (e.code == "KeyB")       keyboard.B = true;
});

document.addEventListener("keyup", (e) => {
  if (e.code == "ArrowRight") keyboard.RIGHT = false;
  if (e.code == "ArrowLeft")  keyboard.LEFT = false;
  if (e.code == "ArrowUp")    keyboard.UP = false;
  // if (e.code == "ArrowDown")  keyboard.DOWN = false;
  if (e.code == "Space")      keyboard.SPACE = false;
  if (e.code == "KeyM")       keyboard.M = false;
  if (e.code == "KeyL")       keyboard.L = false;
  if (e.code == "KeyB")       keyboard.B = false;
});

// function showStartPage() {
//   window.location.href="./title.html";
// }


// https://www.mediaevent.de/javascript/Extras-Javascript-Keycodes.html
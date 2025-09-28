let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById('canvas');
  world = new World(canvas);
  world.level.soundManager.startCluckingLoop();
  soundBtnHandler();
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

function soundBtnHandler() {
  const muteBtn = document.getElementById('muteBtn');
  muteBtn.addEventListener('click', () => {
    const muted = soundManager.toggleMute();
    muteBtn.src = muted ? "./assets/volume_off.png" : "./assets/volume_up.png";
  });
}

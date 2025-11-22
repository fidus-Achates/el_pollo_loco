let canvas;
let world;
let keyboard = new Keyboard();

const latinoMusic = new Audio("./audio/latin-pop.mp3");
latinoMusic.loop = true;
latinoMusic.volume = 0.8;

const cluckingSound = new Audio ("./audio/chicken-noise.mp3");
cluckingSound.loop = true;
// cluckingSound.volume = 0.1;

const canvasOverlay = document.getElementById('overlay');
const gameBtnDiv = document.getElementById('gameBtns');
const soundIcon = document.getElementById('soundIcon');
const muteBtn = document.getElementById('muteBtn');

let soundOn = false;
let currentLoopSound = null;
let gameover = false;

/**
 * start building game world (executed in world.class.js), call background-music initializer
 */
function init() {
  setStartMusic();
  canvas = document.getElementById('canvas');
  world = new World(canvas);
}

// 1) SOUND CONTROL: BACKGROUND-MUSIC ON / OFF

/**
 * choose Loop sound, add eventListeners to audio-button (function is called only once).
 */
function setStartMusic() {
  stopCurrentMusic(); // zur Sicherheit, aber wohl unnötig
  currentLoopSound = latinoMusic;
  soundIcon.addEventListener('click', () => backgroundMusicOnOff('soundIcon'));
  // muteBtn.addEventListener('click', handleMuteBtn); // ACHTUNG (eventHandler will be desactivated at gameover).
}

/**
 * play or mute all sounds and background-music; only used while game is running.
*/
function handleMuteBtn() {
  backgroundMusicOnOff('muteBtn');
  soundManager.toggleGameSounds();
}

// shortcut "M": see "world", checkMuteShortcut()

/**
 * turn background-music / clucking on or off; set state of sound-flag "soundOn", core of audio-management.
 * @param {string} soundIconId - "soundIcon" for btn on start-page, "muteBtn" for btn under canvas
 */
function backgroundMusicOnOff(soundIconId) {
  if (!currentLoopSound) return;
  if (soundOn) {
    currentLoopSound.muted = true;  
    currentLoopSound.pause();
    soundOn = false;
    // console.log("HG Sound ist ausgeschaltet, soundOn: ", soundOn);
  } else {
    currentLoopSound.muted = false;  
    currentLoopSound.play();
    soundOn = true;
    // console.log("HG Sound ist eingeschaltet, soundOn: ", soundOn);
  }
  toggleSoundIcon(soundIconId);
}

/**
 * helper function for backgroundMusicOnOff: set correspondig icon.
 * @param {string} soundIconId - "soundIcon" for btn on start-page, "muteBtn" for btn under canvas
 */
function toggleSoundIcon(soundIconId) {
  let icon = document.getElementById(soundIconId);
  icon.src = !soundOn ? "./assets/volume_off.png" : "./assets/volume_up.png";
}

// 2) SELECT BACKGROUND-MUSIC (home) OR CLUCKING-SOUND (game)

/**
 * main function for changing sound loop
 * called in "startGame()" and "interruptGame()"
 * @param {variable} selectedSound - name of audio-object, viz. latinoMusic / cluckingSound
 * @param {string} iconId - soundBtn ("soundIcon" / "MuteBtn")
 */
function changeLoop(selectedSound, iconId) {
  stopCurrentMusic();
  currentLoopSound = selectedSound;
  if (soundOn) startChangedSoundLoop();
  toggleSoundIcon(iconId)
}

/**
 * helper function for changeLoop; avoid -by replacement- synchronic playing of both background-sounds.
 * [Audio-object needs explicit "pause"; "currentLoopSound = null" is not sufficient.]
 */
function stopCurrentMusic() {
  if (currentLoopSound) {
    currentLoopSound.pause();        // stoppt den Sound
    currentLoopSound.currentTime = 0; // optional: auf Anfang
    currentLoopSound.muted = true;    // optional
    currentLoopSound = null;          // jetzt kann gelöscht werden
  }
}

/**
 * helper function for changeLoop; start new loop sound (if soundOn == true)
 */
function startChangedSoundLoop() {
  currentLoopSound.muted = false;
  currentLoopSound.play().catch(err => console.log('Play blocked:', err)); // test, da größtes audio file
}

// 3) NAVIGATION

/**
 * show title-image in overlay.
 */
function home() {
  canvasOverlay.innerHTML = '';
  const img = `<img src="./img/9_intro_outro_screens/start/startscreen_1.png" alt="start image El Pollo loco" class="overlay">`;
  canvasOverlay.innerHTML = img;
}

/**
 * change page design and background-music (setting for "game").
 */
function startGame() {
  world.setGameRunning(true);
  clearOverlay();
  addGameButtons(canvasOverlay, gameBtnDiv);
  toggleOverlay();
  toggleButtons();
  changeLoop(cluckingSound, 'muteBtn');
  soundManager.toggleGameSounds();
  // console.log("bei startGame ist soundOn: ", soundOn);
}

/**
 * interrupt game, change page design and background-music (setting for "home"), show start-image
 */
function interruptGame() {
  world.setGameRunning(false);
  changeLoop(latinoMusic, 'soundIcon');
  const canvas = document.getElementById("canvas");
  if (!canvas.classList.contains("d-none")) {
    toggleOverlay();
  }
  toggleButtons();
  if(gameover) {
    console.log("hier käme ein reset"); // DER FEHLT NOCH
  }
  clearGameButtonsDivs(); // neu
  home();
}

/**
 * show game-buttons, hide start-page-buttons
 */
function toggleButtons() {
  console.log("toggle Buttons");
  const title = document.querySelector('h1');
  const infoButtons = document.getElementById('infoBtns');
  title.classList.toggle('d-none');
  infoButtons.classList.toggle('d-none');
  gameBtnDiv.classList.toggle('d-none');
}

/**
 * show canvas, hide info-screen (overlay)
 */
function toggleOverlay() {
  const canvas = document.getElementById('canvas');
  canvasOverlay.classList.toggle('d-none');
  canvas.classList.toggle('d-none');
}

// 4) ADD EVENT-LISTENER TO KEYS USED IN THE GAME
// https://www.mediaevent.de/javascript/Extras-Javascript-Keycodes.html

document.addEventListener("keydown", (e) => {
  if (e.code == "ArrowRight") keyboard.RIGHT = true;
  if (e.code == "ArrowLeft")  keyboard.LEFT = true;
  if (e.code == "ArrowUp")    keyboard.UP = true;
  if (e.code == "Space")      keyboard.SPACE = true;
  if (e.code == "KeyM")       keyboard.M = true;
  if (e.code == "KeyL")       keyboard.L = true;
});

document.addEventListener("keyup", (e) => {
  if (e.code == "ArrowRight") keyboard.RIGHT = false;
  if (e.code == "ArrowLeft")  keyboard.LEFT = false;
  if (e.code == "ArrowUp")    keyboard.UP = false;
  if (e.code == "Space")      keyboard.SPACE = false;
  if (e.code == "KeyM")       keyboard.M = false;
  if (e.code == "KeyL")       keyboard.L = false;
});

// document.addEventListener('keydown', (e) => {
//   console.log(e);
// })

// 5) OVERLAY FUNCTIONS

/**
 * render selected template (arg) in infoscreen on start-page
 * @param {string} template - name of template (key in templates-object)
 */
function displayContent(template) {
  const templates = {
    story: getStory,
    controls: getControlButtons,
    credits: getCredits
  };
  const runTemplate = templates[template];
  canvasOverlay.innerHTML = runTemplate();
}

/**
 * at start of game: prepare overlay to receive game-buttons (in case of fullscreen-mode).
 */
function clearOverlay() {
  canvasOverlay.innerHTML = '';
}

/**
 * 
 * @param {variable name} divToClear - 
 * @param {variable name} divToFill - 
 */
function addGameButtons(divToClear, divToFill) {
  console.log("add buttons", divToFill);
  divToClear.innerHTML = '';
  divToFill.innerHTML = getGameBtns();
}

/**
 * clear both game-buttons-divs when leaving game (restaure initial state)
 */
function clearGameButtonsDivs() {
  canvasOverlay.innerHTML = '';
  gameBtnDiv.innerHTML = '';
}

/**
 * toggle buttons ad gameover: hide "fullscreen", "mute", show "restart"
 */
function showButtonsAtGameover() {
  document.querySelectorAll(".gameBtn").forEach(element => {
    element.classList.toggle("d-none");
  });
  document.querySelector(".restart").classList.toggle("d-none");
}

// 6) FULLSCREEN FUNCTIONS (on buttons and in gameover-function)

// nur aus dem fullscreen-modus herausgehen (kein toggle)
function exitFullscreenIfActive() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
}

// nur in den fullscreen-modus gehen (kein toggle)
function setToFullscreen() {
  let canvas = document.getElementById("canvas");
  canvas.requestFullscreen(); 
}

// DIESE IST IMPLEMENTIERT; funktioniert auch in Firefox
function toggleFullscreen() {
  const canvas = document.getElementById("canvas");
  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch(err => {
      console.warn("Fullscreen refused:", err);
    });
    addGameButtons(gameBtnDiv, canvasOverlay); // neu
    // canvasOverlay.classList.add('###');
  } else {
    document.exitFullscreen();
    addGameButtons(canvasOverlay, gameBtnDiv); // neu
    // canvasOverlay.classList.remove('###');
  }
}

// 7) GAMEOVER SEQUENCE (called in world, "gameover()")
  
/**
 * show overlay with final image, hide canvas.
 * @param {string} endImage - name of gameover-image
 */
function showEndscreen(endImage) {
  canvasOverlay.innerHTML = '';
  canvasOverlay.innerHTML = getFinalImage(endImage);
  canvasOverlay.classList.toggle('d-none'); 
  const canvas = document.getElementById('canvas');
  canvas.classList.toggle('d-none');
}

/**
 * helper function for "showEndscreen": return template
 * @param {string} endImage - name of gameover-image
 * @returns template to render in overlay.
 */
function getFinalImage(endImage) {
  return `
    <div class="gameover">
      <img src="./img/5_background/first_half_background.png" alt="image of desert landscape" class="finalBackground">
      <img src="${endImage}" class="final-image">
    </div>
  `;
}

// function showStartPage() {
//   window.location.href="./title.html";
// }
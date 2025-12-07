let canvas;
let world;
let keyboard = new Keyboard();

const latinoMusic = new Audio("./audio/latin-pop.mp3");
latinoMusic.loop = true;
latinoMusic.volume = 0.8;

const cluckingSound = new Audio ("./audio/chicken-noise.mp3");
cluckingSound.loop = true;
// cluckingSound.volume = 0.1;

let soundOn = false;
let currentLoopSound = null;
let gameover = false;

const canvasElement = document.getElementById('canvas');
const canvasOverlay = document.getElementById('overlay');
const gameBtnDiv = document.getElementById('gameBtns');
const soundIcon = document.getElementById('soundIcon');
const muteBtn = document.getElementById('muteBtn');

/**
 * start function; esp. start building game world (executed in world.class.js)
 */
function init() {
  checkOrientation();
  setStartMusic();
  world = new World(canvasElement);
  if(isMobile()) activeStyleMobileButtons(); // nur gültig für die Titelseite? Rest ist ja template
  toggleLoadingSpinner();
}

/**
 * check window's heigt-width ratio, display message if device is in portrait mode
 */
function checkOrientation() {
  const portraitBlocker = document.getElementById('orientation');
  const portrait = window.innerHeight > window.innerWidth;
  if(portrait && window.innerHeight < 750) {
    portraitBlocker.classList.remove('d-none');
    document.getElementById('message').innerHTML = isMobile()? 'Please turn your device' : 'Please resize browser window';
  } else {
    portraitBlocker.classList.add('d-none');
  }
  console.log(portrait ? "portrait mode" : "landscape mode");
}

window.addEventListener("resize", checkOrientation);

/**
 * show / hide loading-spinner
 */
function toggleLoadingSpinner() {
  const loadingImg = document.getElementById('loading-spinner');
  loadingImg.classList.toggle('d-none');
  console.log('loading handler triggered');
}

// 1) SOUND CONTROL: BACKGROUND-MUSIC ON / OFF 
/**
 * choose Loop sound, add eventListeners to audio-button (function is called once, in "init()").
 */
function setStartMusic() {
  stopCurrentMusic(); // zur Sicherheit, aber wohl unnötig
  currentLoopSound = latinoMusic;
  soundIcon.addEventListener('click', () => backgroundMusicOnOff('soundIcon'));
}

/**
 * play or mute all sounds and background-music; only used while game is running.
*/
function handleMuteBtn() {
  backgroundMusicOnOff('muteBtn');
  soundManager.toggleGameSounds();
}

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
  } else {
    currentLoopSound.muted = false;  
    currentLoopSound.play();
    soundOn = true;
  }
  toggleSoundIcon(soundIconId);
}

/**
 * helper function for backgroundMusicOnOff: set correspondig icon.
 * @param {string} soundIconId - "soundIcon" for btn on start-page, "muteBtn" for btn under canvas
 */
function toggleSoundIcon(soundIconId) {
  let icon = document.getElementById(soundIconId);
  icon.src = !soundOn ? "./assets/volume_off_brown.png" : "./assets/volume_up_brown.png";
}

// 2) SELECT BACKGROUND-MUSIC (home) OR CLUCKING-SOUND (game)

/**
 * main function for changing background sound loop
 * called in "startGame()" and "interruptGame()"
 * @param {variable} selectedSound - name of audio-object, viz. latinoMusic / cluckingSound
 * @param {string} iconId - soundBtn ("soundIcon" / "MuteBtn")
 */
function changeLoop(selectedSound, iconId) {
  stopCurrentMusic();
  currentLoopSound = selectedSound;
  if (soundOn) playNewSoundLoop();
  toggleSoundIcon(iconId);
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
function playNewSoundLoop() {
  currentLoopSound.muted = false;
  currentLoopSound.play().catch(err => console.log('Play blocked:', err)); // test, da größtes audio file
}

// 3) HANDLE CONTENTS OF OVERLAY, TOGGLE CANVAS (VISIBILITY)

/**
 * hide canvas (sure reset) and show title-image in overlay.
 */
function home() {
  canvasElement.classList.add('d-none');
  canvasOverlay.innerHTML = '';
  const img = `<img src="./img/9_intro_outro_screens/start/startscreen_1.png" alt="start image El Pollo loco" class="overlay">`;
  canvasOverlay.innerHTML = img;
}

/**
 * start (or resume) game: change game state, page design and background-music (setting for "game").
 */
async function startGame() {
  if (isMobile()) toggleLoadingSpinner(); // FRAGEN, OB SINNVOLL
  clearOverlay();
  await addControls();
  toggleCanvas();
  world.setGameRunning(true);
  changeLoop(cluckingSound, 'muteBtn');
  soundManager.toggleGameSounds(); // ist beim ersten Start nötig
}

async function addControls() {
  if (!isMobile()) {
    console.log("no mobile device detected, adding normal controls");
    addGameButtons(canvasOverlay, gameBtnDiv);
    toggleButtons(); // nur, wenn von "home" zu "game"
  } else {
    console.log("mobile device detected, adding mobile controls");
    const infoButtons = document.getElementById('infoBtns'); // ev. sind die beiden Zeilen nicht nötig.
    infoButtons.classList.add('d-none'); // ev. sind die beiden Zeilen nicht nötig.
    await toggleFullscreen();
    fullscreenLayoutHandler();
    toggleLoadingSpinner(); // FRAGEN, OB SINNVOLL
  }
}

/**
 * onclick-function for "restart"-button during gameover: 
 * reset game, change page design and restarts background-music (setting for "game").
 */
function restartGame() {
  world.resetGame();
  clearOverlay();
  toggleCanvas();
  arrangeButtonsAtGameover(); // NUR NICHT MOBILE, BRAUCHT NIHT MEHR
  changeLoop(cluckingSound, 'muteBtn');
  world.setGameRunning(true);
}
// HIER FEHLT NOCH DER MOBILE-TEIL; FULLSCREEN ETC. ADD CONTROLS, letzte 2 Zeilen FEHLT AUCH

/**
 * onclick-function for "home"-button during the game:
 * change game state, page design and background-music (setting for "home"), show start-image
 */
async function interruptGame() {
  world.setGameRunning(false);
  await fullscreenChecker();
  toggleButtons();
  if(gameover) {
    world.resetGame();
  }
  changeLoop(latinoMusic, 'soundIcon');
  clearGameButtonsDivs();
  home(); // blendet canvas auf jeden Fall immer aus
}

/**
 * button function: stop / resume game
 */
function pauseResumeGame() {
  if(world.gameRunning) {
    world.setGameRunning(false);
  } else {
    world.setGameRunning(true);
  }
  document.getElementById('pauseBtn').src = world.gameRunning ? './assets/pause-brown.png' : './assets/play-brown.png';
}

// HANDLE UI

/**
 * in startGame() and showEndscreen(): prepare overlay for new content.
 */
function clearOverlay() {
  canvasOverlay.innerHTML = '';
}

/**
 * transfer game-buttons from one div to another (at start: render them for the first time).
 * @param {html-element} divToClear - former place of game-buttons
 * @param {html-element} divToFill - new place of game-buttons
 */
function addGameButtons(divToClear, divToFill) {
  divToClear.innerHTML = '';
  divToFill.innerHTML = getGameBtns();
}

/**
 * show or hide canvas
 */
function toggleCanvas() {
  canvasElement.classList.toggle('d-none');
}

/**
 * show game-buttons, hide start-page-buttons
 */
function toggleButtons() {
  const title = document.querySelector('h1');
  const infoButtons = document.getElementById('infoBtns');
  title.classList.toggle('d-none');
  infoButtons.classList.toggle('d-none');
  gameBtnDiv.classList.toggle('d-none');
}

// 4) OVERLAY AND GAME-BUTTON-DIV FUNCTIONS

/**
 * check if device is mobile (for fullscreen and mobile buttons)
 * @returns {boolean}
 */
function isMobile() {
  return navigator.maxTouchPoints > 0;
}

/**
 * add styling for active mobile buttons (touchstart / touchend)
 */
function activeStyleMobileButtons() {
  console.log("active mobile buttons");
  document.querySelectorAll('.circle').forEach(button => {
    button.addEventListener('touchstart', () => {
      button.classList.add('active-btn');
    });
    button.addEventListener('touchend', () => {
      button.classList.remove('active-btn');
    });
  })
};

/**
 * render selected template (arg) in infoscreen (i.e. informations about the game)
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
 * clear both game-buttons-divs when leaving game (= reset initial state)
 */
function clearGameButtonsDivs() {
  canvasOverlay.innerHTML = '';
  gameBtnDiv.innerHTML = '';
}

// 5) FULLSCREEN FUNCTIONS (on button, in "interruptGame()" and "gameover()") MOBILE

/**
 * async fullscreen event-handling used for button-click ("else"-block imitates fullscreenchange event)
 */
async function toggleFullscreen() {
  const frame = document.getElementById("frame");
  if(!document.fullscreenElement) {
    await frame.requestFullscreen().catch(err => {console.warn("Fullscreen refused:", err);});
    await waitForFullscreenChange();
  } else {
    if(!isMobile()) { // Blockiert den exit bei mobilen Geräten; kann ev wieder weg.
      await document.exitFullscreen();
      await waitForFullscreenChange();
    }
  }
  //console.log("im toggleFscr", document.fullscreenElement);
}

/**
 * equivalen to toggleFullscreen, but triggered by "fullscreenchange" event (i.e. user clicks ESC).
 * In *any* case layout is adapted (i.e. also in "interruptGame" and "gameOver", at exitFullscreen).
 */
document.addEventListener("fullscreenchange", fullscreenLayoutHandler);

// wird auch am Ausgang aus mobile fscr getriggert, aber nur geloggt.

/**
 * adapt layout when entering or exiting fullscreen-mode (position of game-buttons, overlay-style)
 */
function fullscreenLayoutHandler() {
  if(!isMobile()) fullscreenForDesktop();
  if(isMobile()) fullscreenForMobile();
}

/**
 * helper function for fullscreenLayoutHandler: layout-adaptation for desktop devices
 */
function fullscreenForDesktop() {
  const fullscreenOff = !document.fullscreenElement;
  if (!fullscreenOff) {
    addGameButtons(gameBtnDiv, canvasOverlay);
    canvasOverlay.classList.add('fullscreen-overlay');
  } else {
    addGameButtons(canvasOverlay, gameBtnDiv);
    canvasOverlay.classList.remove('fullscreen-overlay');
  }
  toggleFullscreenIcon();
}

function fullscreenForMobile() {
  if(document.fullscreenElement) {
    console.log("adding mobile controls"); 
    gameBtnDiv.innerHTML = ''; // möglicherweise unnötig, im mobile-mode eh leer
    canvasOverlay.innerHTML = getMobileGameBtns();
    initializeMobileBtns(); // eventListener setzen
    canvasOverlay.classList.add('mobile-overlay'); // muss am Ende wieder weg
  }
}

/**
 * helper function for fullscreenForDesktop: set correspondig button-icon.
 */
function toggleFullscreenIcon() {
  const fullscreenIcon = document.getElementById('fullscreenIcon');
  if (fullscreenIcon) {
  fullscreenIcon.src = document.fullscreenElement
    ? './assets/smallscreen_brown.png'
    : './assets/fullscreen_brown.png';
  }
}

/**
 * exit fullscreen-mode if active, wait for completion (= "Promise resolved").
 * helper function for async functions "interruptGame()" and "gameover()".
 */
async function fullscreenChecker() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    await waitForFullscreenChange();
  }
}

// KOMBINATION AUS ZWEI VORSCHLÄGEN EINER KI
/**
 * helper function for fullscreenChecker(): fullscreen-exit-event is async.
 * wait for "fullscreenchange" event to be fired, resolve Promise (and remove EventListener)
 * wait for "fullscreenchange" event to be fired, resolve Promise (and remove EventListenmer)
 * "handler" is a OneShot-eventListener
 * @returns {Promise} - resolved when fullscreenchange event is fired.
 */
function waitForFullscreenChange() {
  return new Promise((resolve) => {
    const handler = () => {
      document.removeEventListener("fullscreenchange", handler);
      resolve();
    };
    document.addEventListener("fullscreenchange", handler);
  });
}

// 6) FUNCTIONS FOR GAMEOVER SEQUENCE (called in world, "gameover()")
  
/**
 * show overlay with final image, hide canvas.
 * @param {string} endImage - path of gameover-image
 */
function showEndscreen(endImage) {
  clearOverlay();
  canvasOverlay.innerHTML = getFinalImage(endImage);
  toggleCanvas();
}

/**
 * helper function for "showEndscreen": return template
 * @param {string} endImage - path of gameover-image
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

/**
 * toggle buttons ad gameover: hide "fullscreen", "mute", show "restart"
 */
function arrangeButtonsAtGameover() {
  document.querySelectorAll('.gameBtn').forEach(element => {
    element.classList.toggle('d-none');
  });
  document.querySelector('.restart').classList.toggle('d-none');
}

// 7) ADD EVENT-LISTENER TO KEYS USED IN THE GAME
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

const mobileBtnArguments = [
  {id: 'left', key: 'LEFT'},
  {id: 'right', key: 'RIGHT'},
  {id: 'jump', key: 'UP'},
  {id: 'throw', key: 'SPACE'},
  {id: 'muteBtn', key: 'M'},
  {id: 'life', key: 'L'}
];

function initializeMobileBtns() {
  console.log("initialize Mobile Buttons");
  mobileBtnArguments.forEach(arg => {
    document.getElementById(arg.id).addEventListener('touchstart', (e) => {
      e.preventDefault();
      keyboard[arg.key] = true;
    });
  });
  mobileBtnArguments.forEach(arg => {
    document.getElementById(arg.id).addEventListener('touchend', (e) => {
      e.preventDefault();
      keyboard[arg.key] = false;
    });
  });
}


// document.addEventListener('keydown', (e) => {
//   console.log(e.code);
// })

// function showStartPage() {
//   window.location.href="./title.html";
// }
let canvas;
let world;
let keyboard = new Keyboard();

const latinoMusic = new Audio("./audio/latin-pop.mp3");
latinoMusic.loop = true;
const cluckingSound = new Audio ("./audio/chicken-noise.mp3");
cluckingSound.loop = true;
const soundIcon = document.getElementById('soundIcon');
const muteBtn = document.getElementById('muteBtn'); // neu

let soundOn = false;
let bkgMusicStarted = false; // braucht es für stopCurrentMusic()
let currentLoopSound = null;
// let soundPaused = true;
let gameover = false;

/**
 * start building game world (executed in world.class.js), enable background-noise for game
 */
function init() {
  setStartMusic();
  canvas = document.getElementById('canvas');
  world = new World(canvas);
}

// 1) SOUND CONTROL: BACKGROUND-MUSIC ON / OFF

/**
 * BLABLBLA   Function is called only once.
 */
function setStartMusic() {
  stopCurrentMusic(); // zur Sicherheit
  currentLoopSound = latinoMusic;
  soundIcon.addEventListener('click', () => backgroundMusicOnOff('soundIcon'));
  muteBtn.addEventListener('click', handleMuteBtn); // ACHTUNG (eventHandler will be desactivated at gameover).
}

/**
 * play or mute all sounds and background-music); only used while game is running.
*/
function handleMuteBtn() {
  soundManager.toggleGameSounds();
  backgroundMusicOnOff('muteBtn');
  console.log("sound started: ", soundOn);
}

// shortcut "M": see "world"

/**
 * turn background-music / clucking on or off, change corresponding icon
 * @param {string} soundIconId - "soundIcon" for btn on start-page, "muteBtn" for btn under canvas
 */
function backgroundMusicOnOff(soundIconId) {
  if (!currentLoopSound) return;
  // if (!soundPaused) {
  if (soundOn) {
    currentLoopSound.pause();
    // soundPaused = true; 
    // bkgMusicStarted = false; // nötig?
    soundOn = false;
    console.log("HG Sound ist ausgeschaltet, soundOn: ", soundOn);
  } else {
    currentLoopSound.play();
    // soundPaused = false;
    // bkgMusicStarted = true; // nötig?
    soundOn = true;
    console.log("HG Sound ist eingeschaltet, soundOn: ", soundOn);
  }
  toggleSoundIcon(soundIconId);
  // let icon = document.getElementById(soundIconId);
  // icon.src = soundPaused ? "./assets/volume_off.png" : "./assets/volume_up.png";
}

function toggleSoundIcon(soundIconId) {
  let icon = document.getElementById(soundIconId); // das kommt unten nochmals; auslagern
  // icon.src = soundPaused ? "./assets/volume_off.png" : "./assets/volume_up.png";
  icon.src = !soundOn ? "./assets/volume_off.png" : "./assets/volume_up.png";
}

// 2) SELECT BACKGROUND-MUSIC (home) OR CLUCKING-SOUND (game)
//    (see below, startGame(), interruptGame())

/**
 * avoid synchronic playing of both background-sounds.
 * Audio-object needs explicit "pause"; "currentLoopSound = null" is not sufficient.
 */
function stopCurrentMusic() {
  if (currentLoopSound) {
    bkgMusicStarted = false;
    //soundOn = false; // wenn aktiv, kann unten "go" nicht aufgerufen werden, da es sonst immer false wäre
    currentLoopSound.pause();        // stoppt den Sound
    currentLoopSound.currentTime = 0; // optional: auf Anfang
    currentLoopSound.muted = true;    // sicherheitshalber
    currentLoopSound = null;          // jetzt darf gelöscht werden
  }
}

/**
 * stop current loop sound, start selected sound and set btn-icon to "non muted"
 * called in "startGame()" and "interruptGame()"
 * @param {variable} selectedSound - name of the audio-object, viz. latinoMusic / cluckingSound
 * @param {string} iconId - soundBtn ("soundIcon" / "MuteBtn")
 */
function playSelectedLoop(selectedSound, iconId) {
  toggleSoundIcon(iconId)

  stopCurrentMusic();
  currentLoopSound = selectedSound;
  if (selectedSound == cluckingSound) {
    cluckingSound.volume = 0.7;
  }
  console.log("current sound: ", selectedSound);

  if (soundOn) {console.log("go loop");
    // soundPaused = false; //
    // backgroundMusicOnOff(iconId); // diese 2 Zeilen: nette Idee, aber es kommt kein sound.

    go(selectedSound); // das geht, sieht aber noch wüst aus
  } else {console.log("no loop")}
}

// geht momentan auch nicht.
function go(selectedSound) {
  bkgMusicStarted = true; // da currentLoopSound es am Anfang immer auf false setzt (braucht es beide?)
  //soundOn = true; // neu, da currentLoopSound es am Anfang immer auf false setzt
  currentLoopSound.muted = false;
  selectedSound.play().catch(err => console.log('Play blocked:', err)); // test, da größtes audio file
}

  // checkMuteShortcut() {
  //   if(this.keyboard.M) {
  //     backgroundMusicOnOff('muteBtn');
  //     const muted = this.level.soundManager.toggleMute();
  //     muteBtn.src = muted ? "./assets/volume_off.png" : "./assets/volume_up.png";
  //     this.keyboard.M = false;
  //   };
  // }

// 3) NAVIGATION

/**
 * show title-image in overlay.
 */
function home() {
  let infoScreen = document.getElementById('overlay');
  infoScreen.innerHTML = '';
  const img = `<img src="./img/9_intro_outro_screens/start/startscreen_1.png" alt="start image El Pollo loco" class="overlay">`;
  infoScreen.innerHTML = img;
}

/**
 * change page design and background-music (setting for "game").
 */
function startGame() {
  playSelectedLoop(cluckingSound, 'muteBtn');
  world.setGameRunning(true);
  toggleButtons();
  toggleOverlay();
  // Idee: synchronisieren, es geht jetzt! die sounds sind von Haus aus "muted", darum muß hier rasch umgestellt werden.
  // if (soundOn) {
  if (world.level.soundManager.sounds.isMuted) {
    console.log("die sind noch ruhig")
    soundManager.toggleGameSounds();
  } else {console.log("die sind schon aktiv");}
}


/**
 * imterrupt game, change page design and background-music (setting for "home"), show start-image
 */
function interruptGame() {
  const canvas = document.getElementById("canvas");

  playSelectedLoop(latinoMusic, 'soundIcon');
  if (!world.level.soundManager.sounds.isMuted) {
    soundManager.toggleGameSounds(); // scheint soweit ok; wenn sie an sind, müssen sie ruhig werden.
  }
  // wenn kein sound war, kommt in home jetzt auch keiner. Referenz auf "soundOn"? Das hat playSelectedLoop aber schon

  world.setGameRunning(false);
  if (!canvas.classList.contains("d-none")) {
    toggleOverlay();
  }
  toggleButtons();
  if(gameover) {
    console.log("hier käme ein reset"); // DER FEHLT NOCH
  }
  home();
}

/**
 * show game-buttons, hide start-page-buttons
 */
function toggleButtons() {
  // console.log("toggle buttons");
  const title = document.querySelector('h1');
  const infoButtons = document.getElementById('infoBtns');
  const gameButtons = document.getElementById('gameBtns');
  title.classList.toggle('d-none');
  infoButtons.classList.toggle('d-none');
  gameButtons.classList.toggle('d-none');
}

/**
 * show canvas, hide info-screen (overlay)
 */
function toggleOverlay() {
  // console.log("toggle overlay and canvas");
  const overlay = document.getElementById('overlay');
  const canvas = document.getElementById('canvas');
  overlay.classList.toggle('d-none');
  canvas.classList.toggle('d-none');
}

// 4) ADD EVENT-LISTENER TO KEYS USED IN THE GAME

document.addEventListener("keydown", (e) => {
  if (e.code == "ArrowRight") keyboard.RIGHT = true;
  if (e.code == "ArrowLeft")  keyboard.LEFT = true;
  if (e.code == "ArrowUp")    keyboard.UP = true;
  // if (e.code == "ArrowDown")  keyboard.DOWN = true;
  if (e.code == "Space")      keyboard.SPACE = true;
  if (e.code == "KeyM")       keyboard.M = true;
  if (e.code == "KeyL")       keyboard.L = true;
});

document.addEventListener("keyup", (e) => {
  if (e.code == "ArrowRight") keyboard.RIGHT = false;
  if (e.code == "ArrowLeft")  keyboard.LEFT = false;
  if (e.code == "ArrowUp")    keyboard.UP = false;
  // if (e.code == "ArrowDown")  keyboard.DOWN = false;
  if (e.code == "Space")      keyboard.SPACE = false;
  if (e.code == "KeyM")       keyboard.M = false;
  if (e.code == "KeyL")       keyboard.L = false;
});

// document.addEventListener('keydown', (e) => {
//   console.log(e);
// })

// 5) START SEQUENCE: INFOSCREENS

/**
 * render selected template (arg) in infoscreen on start-page
 * @param {string} template - name of template (key in templates-object)
 */
function displayContent(template) {
  const infoScreen = document.getElementById("overlay");
  const templates = {
    story: getStory,
    controls: getControlButtons,
    credits: getCredits
  };
  const runTemplate = templates[template];
    infoScreen.innerHTML = runTemplate();
}

// 6) GAMEOVER SEQUENCE (called in world, "gameover()")
  
/**
 * show overlay with final image, hide canvas.
 * @param {string} endImage - name of gameover-image
 */
function showEndscreen(endImage) {
  const overlay = document.getElementById('overlay');
  overlay.innerHTML = '';
  overlay.innerHTML = getFinalImage(endImage);
  overlay.classList.toggle('d-none'); 
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

/**
 * toggle buttons ad gameover: hide "fullscreen", "mute", show "restart"
 */
function showButtonsAtGameover() {
  document.querySelectorAll(".gameBtn").forEach(element => {
    element.classList.toggle("d-none");
  });
  document.querySelector(".restart").classList.toggle("d-none");
}


// function showStartPage() {
//   window.location.href="./title.html";
// }


// https://www.mediaevent.de/javascript/Extras-Javascript-Keycodes.html
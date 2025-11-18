let canvas;
let world;
let keyboard = new Keyboard();

const latinoMusic = new Audio("./audio/latin-pop.mp3");
latinoMusic.loop = true;
const cluckingSound = new Audio ("./audio/chicken-noise.mp3");
cluckingSound.loop = true;
let musicStarted = false;
let currentLoopSound = null;
let soundPaused = false;
let gameover = false;
const soundIcon = document.getElementById('soundIcon');

/**
 * start building game world (executed in world.class.js), enable background-noise for game
 */
function init() {
  startBackgroundMusic();
  canvas = document.getElementById('canvas');
  world = new World(canvas);
  soundBtnHandler();
}

// 1) SOUND CONTROL: BACKGROUND-MUSIC ON / OFF

/**
 * listen to any interaction of the user which allows to start background-music. Function is called only once.
 */
function startBackgroundMusic() {
  const soundIcon = document.getElementById('soundIcon');
  stopCurrentMusic(); // nur zur Sicherheit
  currentLoopSound = latinoMusic;
  document.removeEventListener('click', unlockSound);
  document.removeEventListener('keydown', unlockSound);
  if (!musicStarted) {
    document.addEventListener('click', unlockSound);
    document.addEventListener('keydown', unlockSound);
  }
  soundIcon.src = "./assets/volume_up.png";
  soundIcon.addEventListener('click', () => backgroundMusicOnOff('soundIcon'));
}

/**
 * helper function for "startBackgroundMusic()", is called only once. Start playing the music.
 */
function unlockSound() {
  if(musicStarted) return;
  latinoMusic.muted = false;  // sicherstellen, dass er nicht stumm ist
  latinoMusic.play().catch(err => console.log('Play blocked:', err)); // test, da größtes audio file
  musicStarted = true;
}


/**
 * turn background-music / clucking on or off, change corresponding icon
 * @param {string} soundIconId - "soundIcon" for btn on start-page, "muteBtn" for btn under canvas
 */
function backgroundMusicOnOff(soundIconId) {
  if (!currentLoopSound) return;
  let audioIcon = document.getElementById(soundIconId);
  if (!soundPaused) {
    currentLoopSound.pause();
    soundPaused = true;
    console.log("Sound ist ausgeschaltet");
  } else {
    currentLoopSound.play();
    soundPaused = false;
    console.log("Sound ist eingeschaltet");
  }
  audioIcon.src = soundPaused ? "./assets/volume_off.png" : "./assets/volume_up.png";
}


/**
 * add click-function to game-sound-btn (# "muteBtn"); (eventHandler will be desactivated at gameover).
 */
function soundBtnHandler() {
  muteBtn.addEventListener('click', handleMuteBtn);
}

/**
 * callback function for soundBtnHandler; play or mute all sounds and background-music); only used while game is running.
*/
function handleMuteBtn() {
  soundManager.toggleMute();
  backgroundMusicOnOff('muteBtn');
}

// shortcut "M": see "world"

// 2) SELECT BACKGROUND-MUSIC (home) OR CLUCKING-SOUND (game)
//    (see below, startGame(), interruptGame())

/**
 * avoid synchronic playing of both background-sounds.
 * Audio-object needs explicit "pause"; "currentLoopSound = null" is not sufficient.
 */
function stopCurrentMusic() {
  if (currentLoopSound) {
    musicStarted = false;
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
  const muteIcon = document.getElementById(iconId);
  muteIcon.src = "./assets/volume_up.png";
  stopCurrentMusic();
  currentLoopSound = selectedSound;
  if (selectedSound == cluckingSound) {
    cluckingSound.volume = 0.7;
  }
  currentLoopSound.muted = false; 
  selectedSound.play().catch(err => console.log('Play blocked:', err)); // test, da größtes audio file
  musicStarted = true;
}

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

// Checken, ob man den parent div wirklich braucht, oder ob "Informations" auch reicht.

/**
 * change page design and background-music (setting for "game").
 */
function startGame() {
  toggleButtons();
  toggleOverlay();
  playSelectedLoop(cluckingSound, 'muteBtn');
  world.setGameRunning(true);
}

/**
 * imterrupt game, change page design and background-music (setting for "home"), show start-image
 */
function interruptGame() {
  const canvas = document.getElementById("canvas");
  playSelectedLoop(latinoMusic, 'soundIcon');
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

// 6 
    // die F ist eine Kombination aus "home" und vor allem aus "startGame" von "navigation.js")
  function showEndscreen(endImage) {
    const endscreen = getFinalImage(endImage);
    const infoScreen = document.getElementById('overlay');
    infoScreen.innerHTML = '';
    infoScreen.appendChild(endscreen);
    const overlay = document.getElementById('overlay');
    const canvas = document.getElementById('canvas');
    overlay.classList.toggle('d-none'); 
    canvas.classList.toggle('d-none');
    

    // Originalversion mit "replaceWith"
    // const endscreen = this.getFinalImage(endImage);
    // const gamescreen = document.getElementById('canvas');
    // gamescreen.replaceWith(endscreen);
  }

  function getFinalImage(endImage) {
    const div = document.createElement('div');
    div.classList.add('gameover');
    div.innerHTML = `
      <img src="./img/5_background/first_half_background.png" alt="image of desert landscape" class="finalBackground">
      <img src=${endImage} class="final-image">
    `;
    return div;
  }

  // oder:   return `
  //   <div class="gameover">
  //     <img src="./img/5_background/first_half_background.png"
  //          alt="image of desert landscape"
  //          class="finalBackground">
  //     <img src="${endImage}" class="overlay">
  //   </div>
  // `;
  // das als innerHTML anstelle von appendChild nehmen

  // besserer Titel als das! (fullscreen weg, mute weg; restart ein)
 function toggleButtons() {
    document.querySelectorAll(".gameBtn").forEach(element => {
      element.classList.toggle("d-none");
    });
    document.querySelector(".restart").classList.toggle("d-none");
  }


// function showStartPage() {
//   window.location.href="./title.html";
// }


// https://www.mediaevent.de/javascript/Extras-Javascript-Keycodes.html
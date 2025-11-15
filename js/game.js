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
const soundIcon = document.getElementById('soundIcon');

/**
 * launch building game world (executed in world.class.js), enable background-noise for game
 */
function init() {
  startBackgroundMusic();
  canvas = document.getElementById('canvas');
  world = new World(canvas);
  soundBtnHandler();
}

// 1) SOUND CONTROL: BACKGROUND-MUSIC ON / OFF

// Teil der init; startet Musik bei der ersten Interaktion des Spielers; EvLi nachher weg.
function startBackgroundMusic() {
  const soundIcon = document.getElementById('soundIcon'); // ev. auch global, wie muteBtn (l. 12)?
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

// helper function for "startBackgroundMusic()"; wird nur ein einziges Mal ausgeführt
function unlockSound() {
  if(musicStarted) return;
  console.log("unlock sound");
  latinoMusic.muted = false;  // sicherstellen, dass er nicht stumm ist
  latinoMusic.play().catch(err => console.log('Play blocked:', err)); // test, da größtes audio file
  musicStarted = true;
}

// wird für BEIDE mute-Btns gebraucht, daher muss die Id mit. Wechselt auch das icon
function backgroundMusicOnOff(soundIconId) {
  if (!currentLoopSound) return;
  let audioIcon = document.getElementById(soundIconId);
  if (!soundPaused) {
    console.log("Sound wird ausgeschaltet");
    currentLoopSound.pause();
    soundPaused = true;
  } else {
    console.log("Sound wird eingeschaltet");
    currentLoopSound.play();
    soundPaused = false;
  }
  audioIcon.src = soundPaused ? "./assets/volume_off.png" : "./assets/volume_up.png";
}


/**
 * add click-function to game-sound-btn; (eventHandler will be desactivated at gameover).
 */
function soundBtnHandler() {
  muteBtn.addEventListener('click', handleMuteBtn);
  console.log("soundBtnHandler added");
}

/**
 * callback function for soundBtnHandler; play or mute all sounds and background-music); only while game is running.
*/
function handleMuteBtn() {
  soundManager.toggleMute();
  backgroundMusicOnOff('muteBtn');
}

// shortcut "M": see "world"

// 2) SELECT BACKGROUND-MUSIC (home) OR CLUCKING-SOUND (game)
//    (see startGame(), interruptGame())

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


// function playCluckingLoop() {
//   const muteIcon = document.getElementById('muteBtn');
//   muteIcon.src = "./assets/volume_up.png";
//   stopCurrentMusic();
//   currentLoopSound = cluckingSound;
//   cluckingSound.volume = 0.7;
//   currentLoopSound.muted = false; 
//   cluckingSound.play().catch(err => console.log('Play blocked:', err)); // test, da größtes audio file
//   musicStarted = true;
  // muteIcon.onclick = () => toggleMusic(cluckingSound, muteIcon);
  // muteIcon.onclick = () => toggleMusic(cluckingSound, muteIcon);
// }

/**
 * called in "startGame()" and "interruptGame()"
 * sound is set "on", even if music was muted.
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

// Obsolet
// function toggleMusic(loopSound, soundIcon) {
//   if (!musicStarted) {
//     loopSound.play().catch(err => console.log('Play blocked:', err));
//     musicStarted = true;
//   }
//   loopSound.muted = !loopSound.muted;
//   soundIcon.src = loopSound.muted ? "./assets/volume_off.png" : "./assets/volume_up.png";
// }


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
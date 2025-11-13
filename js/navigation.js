const latinoMusic = new Audio("./audio/latin-pop.mp3");
// const latinoDance = new Audio("./audio/latina-noche-dance-latin-house.mp3");
latinoMusic.loop = true;
// latinoDance.loop = true;
let musicStarted = false;
let currentLoopSound = null;

const cluckingSound = new Audio ("./audio/chicken-noise.mp3");
cluckingSound.loop = true;

/**
 * play bkg-music on start page; change icon on sound-button. onclick-function of btn and bkg-picture
 * @param {string} sound - name (key of entry in "sounds")
 */
// function playMusic(sound) {
//   const soundIcon = document.getElementById("soundIcon");
//   if(!musicStarted) {
//     sound.play();
//     sound.muted = false;
//     musicStarted = true;
//   } else {
//     sound.muted = !sound.muted;
//   }
//   soundIcon.src = sound.muted ? "./assets/volume_off.png" : "./assets/volume_up.png";
// }

/**
 * avoid synchronic playing of both background-sounds (music, clucking). 
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

function playBackgroundMusic() {
  const soundIcon = document.getElementById('soundIcon');
  stopCurrentMusic();
  currentLoopSound = latinoMusic;

  const unlockSound = () => {
    latinoMusic.muted = false;  // sicherstellen, dass er nicht stumm ist
    latinoMusic.play().catch(err => console.log('Play blocked:', err)); // test, da größtes audio file
    musicStarted = true;
    soundIcon.src = "./assets/volume_up.png";
    document.removeEventListener('click', unlockSound);
    document.removeEventListener('keydown', unlockSound);
  };
  if (!musicStarted) {
    document.addEventListener('click', unlockSound);
    document.addEventListener('keydown', unlockSound);
  }
  soundIcon.addEventListener('click', () => toggleMusic(latinoMusic, soundIcon));
}

/**
 * play continuous background sound. add an eventListener which detects the first user interaction (click or key down),
 * remove it immediately after starting background sound.
 */
function playCluckingLoop() {
  const muteIcon = document.getElementById('muteBtn');
  stopCurrentMusic();
  currentLoopSound = cluckingSound;
  cluckingSound.volume = 0.3;
  currentLoopSound.muted = false; 
  cluckingSound.play().catch(err => console.log('Play blocked:', err)); // test, da größtes audio file
  musicStarted = true;
  muteIcon.src = "./assets/volume_up.png";
  muteIcon.onclick = () => toggleMusic(cluckingSound, muteIcon);
}

function toggleMusic(loopSound, soundIcon) {
  if (!musicStarted) {
    loopSound.play().catch(err => console.log('Play blocked:', err));
    musicStarted = true;
  }
  loopSound.muted = !loopSound.muted;
  soundIcon.src = loopSound.muted ? "./assets/volume_off.png" : "./assets/volume_up.png";
}

/**
 * render selected template (arg) in infoscreen on start-page
 * @param {string} template - name of template (key in templates-object)
 */
function displayContent(template) {
  const infoScreen = document.getElementById("informations");
  const templates = {
    story: getStory,
    controls: getControlButtons,
    credits: getCredits
  };
  const runTemplate = templates[template];
    infoScreen.innerHTML = runTemplate();
}

/**
 * onclick-function: display start image on start page
 */
function home() {
  let infoScreen = document.getElementById("informations");
  infoScreen.innerHTML = '';
  const img = `<img src="./img/9_intro_outro_screens/start/startscreen_1.png" alt="start image El Pollo loco" class="content-frame">`;
  infoScreen.innerHTML = img;
}

// bei der onclick in den game-btns muss wohl ein restart integriert werden. Auf jeden Fall muss die Animation und das spawning stoppen.
// styling von overlay ins stylesheet übertragen. Kein inline-style!
// Checken, ob man den parent div wirklich braucht, oder ob "Informations" auch reicht.
// game-buttons kleben am Bild, da braucht es noch styling

function startGame() {
  toggleScreen();
  playCluckingLoop();
  console.log("before: ", world.level.enemies);
  world.setGameRunning(true);
}

function interruptGame() {
  toggleScreen();
  playBackgroundMusic();
}

  // world.level.soundManager.startCluckingLoop();

  // const title = document.querySelector('h1');
  // const overlay = document.getElementById('overlay');
  // const canvas = document.getElementById('canvas');
  // const infoButtons = document.getElementById('infoBtns');
  // const gameButtons = document.getElementById('gameBtns');
  // title.classList.toggle('d-none');
  // overlay.classList.toggle('d-none'); 
  // canvas.classList.toggle('d-none');
  // infoButtons.classList.toggle('d-none');
  // gameButtons.classList.toggle('d-none');


function toggleScreen() {
  const title = document.querySelector('h1');
  const overlay = document.getElementById('overlay');
  const canvas = document.getElementById('canvas');
  const infoButtons = document.getElementById('infoBtns');
  const gameButtons = document.getElementById('gameBtns');
  title.classList.toggle('d-none');
  overlay.classList.toggle('d-none'); 
  canvas.classList.toggle('d-none');
  infoButtons.classList.toggle('d-none');
  gameButtons.classList.toggle('d-none');
}

// templates for infoscreen
function getStory() {
  return `
    <div class="content">
      <div>
        <p>You are Pepe el peligroso, the fearless chicken fighter.</p>
        <p>Your mission: collect coins and all five super-spicy Salsa bottles.</p> 
        <p>Be quick, because more and more chickens are attacking you!</p>
        <p>Avoid contact so you don't get hurt.</p>
        <p>You can hop over the enemies or crush them by jumping on them</p>
        <p>(this gives you extra energy points).</p>
        <p>Find the endboss and pelt him with all your bottles until he burns up.</p>
      </div>
      <div class="buttons-div"><button class="title-button medium" onclick="displayContent('controls')">How to move</button></div>
    </div>
  `;
}

function getControlButtons() {
  return `
    <div class="content middle">
      <table class="moves">
        <tr><td><img class="key" src="./assets/arrowL.png"></td> <td>Move to left</td></tr> 
        <tr><td><img class="key" src="./assets/arrowR.png"></td> <td>Move to right</td></tr>
        <tr><td><img class="key" src="./assets/arrowUp.png"></td> <td>Jump</td></tr>
        <tr><td><span class="key">space</span></td> <td>Throw Bottle</td></tr>
        <tr><td><span class="key">L</span></td> <td>Buy Life-energy</td></tr>
      </table>
      <div class="buttons-div narrow-gap">
        <button class="title-button medium" onclick="startGame()">Start Game</button>
        <img src="./assets/home.png" class="title-button medium icon home" onclick="home()">
      </div>
    </div>
  `;
}

function getCredits() {
  return `
    <div class="content middle">
      <table class="credits">
        <tr><td>Game graphics:</td> <td>Developerakademie</td></tr>
        <tr><td>Background image:</td> <td><a href="https://www.freepik.com/free-ai-image/desert-cacti-nature_149766888.htm#fromView=image_search_similar&page=1&position=41&uuid=9f9e9985-2387-437d-a693-eaa4a664422e&query=Gaming+with+western+elements" target="_blank">Freep!k</a></td></tr> 
        <tr><td>Background music:</td> <td><a href="https://pixabay.com/de/music/optimistisch-happy-acoustic-pop-in-latin-feel-224317/" target="_blank">Sonican (Pixabay)</a></td></tr>
        <tr><td>Sounds:</td> <td>Pixabay</td></tr>
        <tr><td>Font:</td> <td><a href="https://fontmeme.com/fonts/zabars-font/" target="_blank">Zabars</a></td></tr>
        <tr><td>Code, animated gif:</td> <td>Claudia Wick 2025</td></tr>
      </table>
      <div class="buttons-div narrow-gap">
        <button class="title-button medium"  onclick="startGame()">Start Game</button>
        <img src="./assets/home.png" class="title-button medium icon home" onclick="home()">
      </div>
    </div>
  `;
}
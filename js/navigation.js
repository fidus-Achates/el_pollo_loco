const latinoMusic = new Audio("./audio/latin-pop.mp3");
// const latinoDance = new Audio("./audio/latina-noche-dance-latin-house.mp3");
latinoMusic.loop = true;
// latinoDance.loop = true;
let musicStarted = false;

/**
 * play bkg-music on start page; change icon on sound-button. onclick-function of btn and bkg-picture
 * @param {string} sound - name (key of entry in "sounds")
 */
function playMusic(sound) {
  const soundIcon = document.getElementById("soundIcon");
  if(!musicStarted) {
    sound.play();
    sound.muted = false;
    musicStarted = true;
  } else {
    sound.muted = !sound.muted;
  }
  soundIcon.src = sound.muted ? "./assets/volume_off.png" : "./assets/volume_up.png";
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
  const img = `<img src="./img/9_intro_outro_screens/start/startscreen_1.png" alt="start image El Pollo loco" class="content-frame">`;
  infoScreen.innerHTML = img;
  toggleVisibilities();
}

// bei der onclick in den game-btns muss wohl ein restart integriert werden. Auf jeden Fall muss die Animation und das spawning stoppen.
// styling von overlay ins stylesheet übertragen. Kein inline-style!

function startGame() {
  toggleVisibilities();
  const overlay = document.getElementById('overlay');
  overlay.classList.add('d-none');  

  // mit overlay-Zeilen auch ein Funktiönchen machen. Checken, ob man den parent div wirklich braucht, oder ob "Informations" auch reicht.
  // canvas ein- und ausblenden. Hier oder in der toggleVisibilities
  // game-buttons kleben am Bild, da braucht es noch styling
}

function toggleVisibilities() {
  const title = document.querySelector('h1');
  const infoButtons = document.getElementById('infoBtns');
  const gameButtons = document.getElementById('gameBtns');
  title.classList.toggle('d-none');
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
        <tr><td><span class="key">space</span></td> <td>Jump</td></tr>
        <tr><td><img class="key" src="./assets/arrowUp.png"></td> <td>Throw Bottle</td></tr>
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
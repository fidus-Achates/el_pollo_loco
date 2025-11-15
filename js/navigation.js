/**
 * onclick-function: display start image on start page
 */
function home() {
  let infoScreen = document.getElementById("informations");
  infoScreen.innerHTML = '';
  const img = `<img src="./img/9_intro_outro_screens/start/startscreen_1.png" alt="start image El Pollo loco" class="content-frame">`;
  infoScreen.innerHTML = img;
}

// Checken, ob man den parent div wirklich braucht, oder ob "Informations" auch reicht.
// game-buttons kleben am Bild, da braucht es noch styling

function startGame() {
  toggleButtons();
  toggleOverlay();
  // playCluckingLoop();
  playSelectedLoop(cluckingSound, 'muteBtn');
  world.setGameRunning(true);
}

// "home()" pausiert game; man müsste noch unterscheiden, ob game over ist (dann: restart inklusive)
function interruptGame() {
  const canvas = document.getElementById("canvas");
  playSelectedLoop(latinoMusic, 'soundIcon');
  //startBackgroundMusic(); // kann man das nicht anders machen?
  world.setGameRunning(false);
  if (!canvas.classList.contains("d-none")) {
    toggleOverlay();
  }
  toggleButtons();
  // world.gameRunning); // das ist hier immer false, wir brauchen was Anderes
  // if(!world.gameRunning) {
  //   console.log("hier käme ein reset");
  // }
  home();
}

function toggleButtons() {
  console.log("toggle buttons");
  const title = document.querySelector('h1');
  const infoButtons = document.getElementById('infoBtns');
  const gameButtons = document.getElementById('gameBtns');
  title.classList.toggle('d-none');
  infoButtons.classList.toggle('d-none');
  gameButtons.classList.toggle('d-none');
}

function toggleOverlay() {
  console.log("toggle overlay and canvas");
  const overlay = document.getElementById('overlay');
  const canvas = document.getElementById('canvas');
  overlay.classList.toggle('d-none');
  canvas.classList.toggle('d-none');
}

// START SEQUENCE: INFOSCREENS

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
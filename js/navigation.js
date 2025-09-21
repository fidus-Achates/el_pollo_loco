const latinoMusic = new Audio("./audio/happy-acoustic-pop-in-latin-feel-224317-[AudioTrimmer.com].mp3");
// const latinoDance = new Audio("./audio/latina-noche-dance-latin-house-background-mexican-reggaeton-music-160302-[AudioTrimmer.com](3).mp3");
latinoMusic.loop = true;
// latinoDance.loop = true;

function playMusic(sound) {
  const soundIcon = document.getElementById("soundIcon");
  if(sound.paused) {
    sound.play();
    sound.muted = false;
  } else {
    sound.muted = !sound.muted;
  }
  soundIcon.src = sound.muted ? "./assets/volume_off.png" : "./assets/volume_up.png";
}

function displayContent(template) {
  let infoScreen = document.getElementById("informations");
  
  const templates = {
    story: getStory,
    controls: getControlButtons,
    credits: getCredits
  };
  
  // console.log(template);
  const runTemplate = templates[template];
    infoScreen.innerHTML = runTemplate();
}

function home() {
  let infoScreen = document.getElementById("informations");
  const img = `<img src="./img/9_intro_outro_screens/start/startscreen_1.png" alt="start image El Pollo loco" class="content-frame">`;
  infoScreen.innerHTML = img;
}

function getStory() {
  return `
    <div class="content">
      <p>You are "Pepe el peligroso", the fearless chicken fighter.</p>
      <p>Your mission: collect coins and all five super-spicy Salsa bottles.</p> 
      <p>Be quick, because more and more chickens are attacking you!</p>
      <p>Avoid contact so you don't get hurt.</p>
      <p>You can hop over the enemies or crush them by jumping on them (this gives you extra energy points).</p>
      <p>Find the dangerous endboss and pelt him with all your bottles until he burns up.</p>
      <div class="buttons-div"><button class="title-button" onclick="displayContent('controls')">How to move</button></div>
    </div>
  `;
}

function getControlButtons() {
  return `
    <div class="content">
      <p>Left</p>
      <p>Right</p> 
      <p>Jump</p>
      <p>Throw Bottle</p>
      <div class="buttons-div"><button class="title-button">Start Game</button> <img src="./assets/home.png" class="title-button" onclick="home()"></div>
    </div>
  `;
}

function getCredits() {
  return `
    <div class="content">
      <p>Game graphics: copyright Developerakademie</p>
      <p>Background image: ###</p> 
      <p>Background music: ###</p>
      <p>Sounds: ###</p>
      <p>Code: Claudia Wick 2025</p>
      <div class="buttons-div"><button class="title-button">Start Game</button> <img src="./assets/home.png" class="title-button" onclick="home()"></div>
    </div>
  `;
}
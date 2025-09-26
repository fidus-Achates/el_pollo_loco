class SoundCollection {
  constructor() {
    this.sounds = {};
    this.muted = false;
  }

  addSound(name, path, loop = false) {
    const audio = new Audio(path);
    audio.loop = loop;
    this.sounds[name] = audio;
    return audio;
  }

  playSound(name) {
    const sound = this.sounds[name];
    if (!sound) return;

    sound.currentTime = 0; // falls track zu lang ist.
    sound.play();
    console.log("play: ", name);
  }

  startCluckingLoop() {
    const loopSound = soundManager.sounds['clukingLoop'];
    if (!loopSound) return;

    const playLoop = () => {
      loopSound.muted = false;  // sicherstellen, dass er nicht stumm ist
      loopSound.play().catch(err => console.log('Play blocked:', err));
      
      document.removeEventListener('click', playLoop);
      document.removeEventListener('keydown', playLoop);
    };

    // Listener für erste Interaktion
    document.addEventListener('click', playLoop);
    document.addEventListener('keydown', playLoop);
  }

}
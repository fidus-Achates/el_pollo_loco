class SoundCollection {
  constructor() {
    this.sounds = {};
    this.muted = false;
  }

  /**
   * create new audio entry for soundManager (called in level1.js)
   * @param {string} name - name of the sound (key of object in "sounds")
   * @param {string} path - path of audio file (value of object in "sounds")
   * @param {boolean} loop - 
   */
  addSound(name, path, loop = false) {
    const audio = new Audio(path);
    audio.loop = loop;
    this.sounds[name] = audio
    // return audio; // nur, wenn direkt etwas mit diesem Objekt gemacht wird, e.g. volume einstellen.
  }

  /**
   * play sound (at some event); reset long track to 0 before playing it again
   * @param {string} name - name of the sound (key of audio object in "sounds")
   */
  playSound(name) {
    const sound = this.sounds[name];
    if (!sound) return;
    sound.currentTime = 0;
    sound.play();
  }

  /**
   * play continuous background sound. add an eventListener which detects the first user interaction (click or key down),
   * remove it immediately after starting background sound.
   */
  startCluckingLoop() {
    const loopSound = soundManager.sounds['clukingLoop'];
    if (!loopSound) return;
    loopSound.volume = 0.3;
    const playLoop = () => {
      loopSound.muted = false;  // sicherstellen, dass er nicht stumm ist
      loopSound.play().catch(err => console.log('Play blocked:', err)); // test, da größtes audio file
      document.removeEventListener('click', playLoop);
      document.removeEventListener('keydown', playLoop);
    };
    document.addEventListener('click', playLoop);
    document.addEventListener('keydown', playLoop);
  }

  /**
   * iterate over all (audio)values in "sounds" and toggle their "muted"-status depending on "this.muted"
   * (= status of the whole SoundCollection, see constructor)
   * @returns {boolean} - all sounds muted, Y/N
   */
  toggleMute() {
    this.muted = !this.muted;
    Object.values(this.sounds).forEach(sound => sound.muted = this.muted)
    return this.muted;
  }

}
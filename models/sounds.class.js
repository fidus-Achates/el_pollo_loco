class SoundCollection {
  constructor() {
    this.sounds = {};
    this.muted = false; // für die toggleMute-function
  }

  addSound(name, path, loop = false) {
    const audio = new Audio(path);
    audio.loop = loop;
    this.sounds[name] = audio
    // return audio; // nur, wenn direkt etwas mit diesem Objekt gemacht wird, e.g. volume einstellen.
  }

  playSound(name) {
    const sound = this.sounds[name];
    if (!sound) return;
    sound.currentTime = 0; // falls track zu lang ist.
    sound.play();
    // console.log("play: ", name);
  }

  startCluckingLoop() {
    const loopSound = soundManager.sounds['clukingLoop'];
    if (!loopSound) return;
    loopSound.volume = 0.3;

    const playLoop = () => {
      loopSound.muted = false;  // sicherstellen, dass er nicht stumm ist
      loopSound.play().catch(err => console.log('Play blocked:', err));
      
      document.removeEventListener('click', playLoop);
      document.removeEventListener('keydown', playLoop);
    };

    // Listener für erste Interaktion, die der Browser fordert
    document.addEventListener('click', playLoop);
    document.addEventListener('keydown', playLoop);
  }

  /**
   * sound = k,v: {name: audio-Object}, audio-Object has "muted" property(boolean).
   * iterate over these (audio)values and toggle "muted"-status depending on "this.muted"
   * (status of SoundCollection, see constructor)
   * @returns {boolean} - all sounds muted, Y/N
   */
  toggleMute() {
    this.muted = !this.muted;
    Object.values(this.sounds).forEach(sound => sound.muted = this.muted)
    return this.muted;
  }


}
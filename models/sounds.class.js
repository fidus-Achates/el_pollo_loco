class SoundCollection {
  constructor() {
    this.sounds = {};
    this.isMuted = true;
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
    audio.muted = this.isMuted; // Methode "muted" übernimmt Status der flag "isMuted" (dasselbe SPiel in L. 4 von "toggleGameSounds")
    this.sounds[name] = audio;
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
   * iterate over all (audio)values in "sounds" and toggle their "muted"-status depending on "this.muted"
   * (= status of the whole SoundCollection, see constructor)
   * @returns {boolean} - all sounds muted, Y/N
   */
  toggleGameSounds() {
    console.log("toggle game sounds");
    this.isMuted = !this.isMuted;
    Object.values(this.sounds).forEach(sound => 
      sound.muted = this.isMuted
    );
    return this.isMuted;
  }

}
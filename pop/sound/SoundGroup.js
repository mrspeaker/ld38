class SoundGroup {

  constructor (sounds) {
    this.sounds = sounds;
  }

  // play one of the audio group (random)
  play (opts) {
    const index = Math.floor(Math.random() * this.sounds.length);
    const sound = this.sounds[index];
    sound.play(opts);
  }

  // stop ALL audio instance of the group
  stop () {
    this.sounds.forEach(sound => sound.stop());
  }

}

export default SoundGroup;

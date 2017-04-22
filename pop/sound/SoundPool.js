import Sound from "./Sound";

class SoundPool {
  sounds = [];
  playCount = 0;

  constructor (src, poolSize, soundOptions) {
    for (let i = 0; i < poolSize; i ++) {
      this.sounds.push(new Sound(src, soundOptions));
    }
  }

  // play one of audio instance of the pool
  play (opts) {
    const index = this.playCount % this.sounds.length;
    this.playCount ++;
    const sound = this.sounds[index];
    sound.play(opts);
  }

  // stop ALL audio instance of the pool
  stop () {
    this.sounds.forEach(sound => sound.stop());
  }

}

export default SoundPool;

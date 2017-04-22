import Assets from "../Assets";

/*
  options can include:
    volume (0 - 1)
    loop (boolean)
*/
class Sound {

  playing = false;

  constructor (src, options) {
    this.src = src;

    this.options = Object.assign({}, {volume: 1}, options);

    // Configure audio element
    const audio = this.audio = Assets.sound(src);
    if (options.loop) {
      audio.loop = true;
    }

    audio.addEventListener("error", () => {
      throw new Error("Error loading audio resource: " + audio.src);
    }, false);
    audio.addEventListener("ended", () => this.playing = false, false);
  }

  play (options) {
    options = Object.assign({}, this.options, options);
    const {audio} = this;
    audio.volume = options.volume;
    audio.currentTime = 0;
    audio.play();
    this.playing = true;
  }

  stop () {
    this.audio.pause();
    this.playing = false;
  }

  get volume () {
    return this.audio.volume;
  }

  set volume (volume) {
    this.options.volume = this.audio.volume = volume;
  }

}

export default Sound;

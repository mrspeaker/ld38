const cache = {};
const readyListeners = [];
const progressListeners = [];

let completed = false;
let remaining = 0;
let total = 0;

function done () {
  completed = true;
  readyListeners.forEach(function (cb) {
    cb();
  });
}

// Called when a queued asset is ready to use
function onAssetLoad (e) {
  if (completed) {
    console.warn("Warning: asset defined after preload.", e.target);
    return;
  }

  remaining--;
  if (remaining === 0) {
    // We're done loading
    completed = true;
    done();
  }
  else {
    // We're still in progress
    progressListeners.forEach(function (cb) {
      cb(total - remaining, total);
    });
  }
}

// Helper function for queing assets
function load (url, maker) {
  if (cache[url]) {
    console.log("cached", url);
    return cache[url];
  }
  console.log("load", url);
  remaining++;
  total++;
  var asset = cache[url] = maker(url, onAssetLoad);
  return asset;
}

const Assets = {
  get completed () {
    return completed;
  },

  addReadyListener: function (cb) {
    readyListeners.push(cb);
    // No assets to load
    if (remaining === 0) {
      done();
    }
  },
  addProgressListener: cb => progressListeners.push(cb),

  image: url => load(url, (url, onAssetLoad) => {
    const img = new Image();
    img.src = url;
    img.addEventListener("load", onAssetLoad, false);
    return img;
  }),

  sound: url => load(url, (url, onAssetLoad) => {
    const audio = new Audio();
    audio.src = url;
    const onLoad = e => {
      audio.removeEventListener("canplay", onLoad);
      onAssetLoad(e);
    };
    audio.addEventListener("canplay", onLoad, false);
    return audio;
  }),

  json: url => load(url, (url, onAssetLoad) => fetch(url)
    .then(res => res.json())
    .then(json => onAssetLoad(json)))
};

export default Assets;

function createSongList() {
  const olElem = document.createElement('ol');

  songs.forEach((song, index) => {
    olElem.innerHTML += `<li id="${index}">${song.title} by <i>${song.creator}</i></li>`;
  });

  return olElem;
}

function addEvent() {
  const liElemsNodes = document.querySelectorAll('li');
  const liElemsArr = Array.prototype.slice.call(liElemsNodes);

  liElemsArr.forEach(liElem => {
    liElem.addEventListener('click', () => {
      // Headphone image scale animation affect
      const headphones = document.querySelector('.headphones');
      headphones.classList.add('scale-image');
      setTimeout(() => {
        headphones.classList.remove('scale-image');
      }, 500);

      // Initialize values
      currentTime.innerText = '0:00';
      duration.innerText = '0:00';
      seekSlider.value = 0;
      index = parseInt(liElem.id);
      playBtn.style.backgroundColor = 'rgba(72, 219, 251, 1)';
      pauseBtn.removeAttribute('style');
      source.src = `songs/${songs[liElem.id].source}`;
      currentSong.innerText = `${songs[liElem.id].title}`;
      duration.innerText = songs[liElem.id].duration;
      seekSlider.max = songs[liElem.id].timeSec;
      highlightSong(songs[liElem.id].source);
      player.load();
      player.play();
    });
  });
}

function highlightSong(src) {
  songs.forEach((song, idx) => {
    if (song.source !== src) {
      const liElem = document.getElementById(idx);
      liElem.removeAttribute('style');
    } else if (song.source === src) {
      const liElem = document.getElementById(idx);
      liElem.style.backgroundColor = 'rgba(72, 219, 251, 1)';
    }
  })
}

// Declare required global variables
const songs = [{
    title: 'Acoustic Breeze',
    source: 'acousticbreeze.mp3',
    duration: '2:37',
    timeSec: 157,
    creator: 'Benjamin Tissot'
  },
  {
    title: 'Beyond the Line',
    source: 'beyondtheline.mp3',
    duration: '3:06',
    timeSec: 186,
    creator: 'Benjamin Tissot'
  },
  {
    title: 'Country Boy',
    source: 'countryboy.mp3',
    duration: '3:27',
    timeSec: 207,
    creator: 'Benjamin Tissot'
  },
  {
    title: 'Dreams',
    source: 'dreams.mp3',
    duration: '3:30',
    timeSec: 210,
    creator: 'Benjamin Tissot'
  },
  {
    title: 'Sweet',
    source: 'sweet.mp3',
    duration: '5:07',
    timeSec: 307,
    creator: 'Benjamin Tissot'
  },
  {
    title: 'Tenderness',
    source: 'tenderness.mp3',
    duration: '2:03',
    timeSec: 123,
    creator: 'Benjamin Tissot'
  }
];
const songListElem = document.getElementById('song-list');
const playBtn = document.querySelector('#play');
const pauseBtn = document.querySelector('#pause');
const player = document.getElementById('player');
const source = document.getElementById('source');
const currentSong = document.getElementById('current-song');
const volumeSlider = document.getElementById('volume-slider');
const duration = document.getElementById('duration');
const seekSlider = document.getElementById('seek-slider');
const decrease = document.getElementById('decrease');
const increase = document.getElementById('increase');
let currentTime = document.getElementById('current-time');
let index = null;
let timeMin = 0;
let timeSec = 0;
let timeVal = null;

// Play button functionality
playBtn.addEventListener('click', () => {
  // Headphone image scale animation affect
  const headphones = document.querySelector('.headphones');
  headphones.classList.add('scale-image');
  setTimeout(() => {
    headphones.classList.remove('scale-image');
  }, 500);

  // Set and remove background color for play and pause buttons
  playBtn.style.backgroundColor = 'rgba(72, 219, 251, 1)';
  pauseBtn.removeAttribute('style');

  if (currentSong.innerText && player.paused && player.readyState) {
    player.play();
  } else if (!currentSong.innerText) {
    source.src = `songs/${songs[0].source}`;
    currentSong.innerText = `${songs[0].title}`;
    highlightSong(songs[0].source);
    index = 0;
    duration.innerText = songs[index].duration;
    seekSlider.max = songs[index].timeSec;
    player.setAttribute('autoplay', true);
    player.load();
    player.play();
  }
});

// Pause button functionality
pauseBtn.addEventListener('click', () => {
  playBtn.removeAttribute('style');
  pauseBtn.style.backgroundColor = 'rgba(72, 219, 251, 1)';

  if (currentSong.innerText && !player.paused) player.pause();
});

// Keep playing songs until last long
player.onended = () => {
  index += 1;
  if (index < songs.length) {
    source.src = `songs/${songs[index].source}`;
    currentSong.innerText = `${songs[index].title}`;
    duration.innerText = songs[index].duration;
    seekSlider.value = 0;
    seekSlider.max = songs[index].timeSec;
    highlightSong(songs[index].source);
    player.load();
    player.play();
  } else {
    const liElemsNodes = document.querySelectorAll('li');
    const liElemsArr = Array.prototype.slice.call(liElemsNodes);

    currentTime.innerText = '0:00';
    duration.innerText = '0:00';
    seekSlider.removeAttribute('max');
    seekSlider.value = 0;

    liElemsArr.forEach(liElem => liElem.removeAttribute('style'));

    index = 0;
    playBtn.removeAttribute('style');
    currentSong.innerText = '';
  }
}

// Add song list to DOM
songListElem.appendChild(createSongList());
// Add click events to song list items
addEvent();

// Update player curren time when seek slide is changed
seekSlider.addEventListener('change', () => {
  const slider = document.getElementById('seek-slider');
  const value = parseFloat(slider.value);

  player.currentTime = value;
});

player.ontimeupdate = function () {
  const timeMs = player.currentTime;

  timeMin = Math.floor(timeMs / 60);
  timeSec = Math.round(timeMs % 60);

  if (timeSec === 60) {
    timeSec = 0;
    timeMin += 1;
  }
  timeSec = timeSec < 10 ? '0' + timeSec : timeSec;
  timeVal = `${timeMin}:${timeSec}`;
  document.getElementById('current-time').innerText = timeVal;
  seekSlider.value = Math.round(timeMs);
}

// Volume controls
volumeSlider.addEventListener('change', () => {
  volumeSlider.value = parseFloat(volumeSlider.value);
  volumeSlider.setAttribute('value', volumeSlider.value);
  player.volume = volumeSlider.value;
});
decrease.addEventListener('click', () => {
  volumeSlider.value = parseFloat(volumeSlider.value) - 0.05;
  volumeSlider.setAttribute('value', volumeSlider.value);
  player.volume = volumeSlider.value;
});
increase.addEventListener('click', () => {
  volumeSlider.value = parseFloat(volumeSlider.value) + 0.05;
  volumeSlider.setAttribute('value', volumeSlider.value);
  player.volume = volumeSlider.value;
});

// Set values for current time, song duration, and current year for footer
currentTime.innerText = '0:00';
duration.innerText = '0:00';
document.getElementById('date').innerHTML = new Date().getFullYear();

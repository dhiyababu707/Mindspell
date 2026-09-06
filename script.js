const summonBtn = document.getElementById('summonBtn');
const hero = document.getElementById('hero');
const bgMedia = document.getElementById('bgMedia') || document.getElementById('bgVideo');
const crystalMedia = document.getElementById('crystalMedia');
const oggyMedia = document.getElementById('oggyMedia');
const orbFlash = document.getElementById('orbFlash');
const skipBtn = document.getElementById('skipCutsceneBtn');
const spellStage = document.getElementById('spellStage');
const spellImage = document.getElementById('spellImage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const sidePrevBtn = document.getElementById('sidePrevBtn');
const sideNextBtn = document.getElementById('sideNextBtn');
const stepCounter = document.getElementById('stepCounter');
const restartBtn = document.getElementById('restartBtn');

const images = [
  '1.png',
  '2.png',
  '3.png',
  '4.png',
  '5.png',
  '6.png',
  '7.png',
  '8.png',
  '9.png'
];

let currentImageIndex = 0;
let currentPhase = 'idle'; // 'idle' | 'crystal' | 'oggy' | 'slideshow'

// Preload all spell images in background
images.forEach(src => {
  const img = new Image();
  img.src = src;
});

// Helper function to safely play video with audio (falls back to muted if policy blocks)
function playVideoSafely(videoEl) {
  if (!videoEl) return;
  videoEl.currentTime = 0;
  const playPromise = videoEl.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      videoEl.muted = true;
      videoEl.play();
    });
  }
}

// 1. Initial trigger: Click "Summon Trouble" -> Play crystal ball video
if (summonBtn) {
  summonBtn.addEventListener('click', () => {
    currentPhase = 'crystal';
    summonBtn.style.pointerEvents = 'none';
    summonBtn.style.opacity = '0';

    if (hero) hero.classList.add('zoom-in-ball');
    if (skipBtn) skipBtn.classList.add('visible');

    setTimeout(() => {
      if (crystalMedia) {
        crystalMedia.classList.add('active');
        playVideoSafely(crystalMedia);
      }
    }, 450);

    setTimeout(() => {
      if (orbFlash) orbFlash.style.opacity = '0';
      if (bgMedia) bgMedia.pause();
    }, 900);
  });
}

// 2. Play Oggy Chasing Cockroaches video after Crystal Ball video ends
function playOggyCutscene() {
  currentPhase = 'oggy';
  if (crystalMedia) {
    crystalMedia.classList.remove('active');
    crystalMedia.pause();
  }

  if (oggyMedia) {
    oggyMedia.classList.add('active');
    playVideoSafely(oggyMedia);
  }
}

if (crystalMedia) {
  crystalMedia.addEventListener('ended', playOggyCutscene);
}

// 3. Display images 1 to 9 after Oggy Chasing Cockroaches video ends
function startImageSlideshow() {
  currentPhase = 'slideshow';
  if (oggyMedia) {
    oggyMedia.classList.remove('active');
    oggyMedia.pause();
  }
  if (skipBtn) skipBtn.classList.remove('visible');

  if (spellStage) spellStage.classList.add('active');
  showImage(0);
}

if (oggyMedia) {
  oggyMedia.addEventListener('ended', startImageSlideshow);
}

// Skip cutscene button handler
if (skipBtn) {
  skipBtn.addEventListener('click', () => {
    if (currentPhase === 'crystal') {
      playOggyCutscene();
    } else if (currentPhase === 'oggy') {
      startImageSlideshow();
    }
  });
}

// 4. Image Slideshow Navigation (Images 1 to 9 with right arrow click)
function showImage(index) {
  if (index < 0 || index >= images.length) return;
  currentImageIndex = index;

  if (spellImage) {
    spellImage.classList.add('animating');
    setTimeout(() => {
      spellImage.src = images[currentImageIndex];
      spellImage.classList.remove('animating');
    }, 120);
  }

  if (stepCounter) {
    stepCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
  }

  const hasPrev = currentImageIndex > 0;
  const hasNext = currentImageIndex < images.length - 1;

  if (sidePrevBtn) sidePrevBtn.disabled = !hasPrev;
  if (prevBtn) prevBtn.disabled = !hasPrev;

  if (hasNext) {
    if (sideNextBtn) sideNextBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'flex';
    if (restartBtn) restartBtn.classList.remove('show');
  } else {
    // Reached the final answer (9.png)
    if (sideNextBtn) sideNextBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (restartBtn) restartBtn.classList.add('show');
  }
}

function advanceToNext() {
  if (currentImageIndex < images.length - 1) {
    showImage(currentImageIndex + 1);
  }
}

function goToPrevious() {
  if (currentImageIndex > 0) {
    showImage(currentImageIndex - 1);
  }
}

// Right arrow button clicks
if (nextBtn) nextBtn.addEventListener('click', advanceToNext);
if (sideNextBtn) sideNextBtn.addEventListener('click', advanceToNext);

// Left arrow button clicks
if (prevBtn) prevBtn.addEventListener('click', goToPrevious);
if (sidePrevBtn) sidePrevBtn.addEventListener('click', goToPrevious);

// Clicking on the image directly also advances to the next image
if (spellImage) {
  spellImage.addEventListener('click', () => {
    if (currentImageIndex < images.length - 1) {
      advanceToNext();
    }
  });
}

// Keyboard navigation: ArrowRight / Space advances, ArrowLeft goes back
window.addEventListener('keydown', (e) => {
  if (currentPhase !== 'slideshow') return;
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    advanceToNext();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    goToPrevious();
  }
});

// Restart journey back to the beginning
if (restartBtn) {
  restartBtn.addEventListener('click', () => {
    currentPhase = 'idle';
    if (spellStage) spellStage.classList.remove('active');
    if (hero) hero.classList.remove('zoom-in-ball');
    if (orbFlash) orbFlash.style.opacity = '';
    if (summonBtn) {
      summonBtn.style.pointerEvents = '';
      summonBtn.style.opacity = '';
    }
    if (bgMedia) {
      bgMedia.currentTime = 0;
      bgMedia.play();
    }
    currentImageIndex = 0;
  });
}
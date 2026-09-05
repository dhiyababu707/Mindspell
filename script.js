const summonBtn = document.getElementById('summonBtn');
const heroContainer = document.querySelector('.hero-container');
const manuscript = document.getElementById('manuscriptModal');

summonBtn.addEventListener('click', () => {
  // 1. Hide the button
  summonBtn.style.pointerEvents = 'none';
  summonBtn.style.opacity = '0';

  // 2. Trigger zoom-in toward the crystal ball & flash
  heroContainer.classList.add('zoom-in-ball');

  // 3. Reveal the unrolling manuscript slightly after the flash
  setTimeout(() => {
    manuscript.classList.add('active');
  }, 400);
});
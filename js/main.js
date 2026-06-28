// Current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Collect all gallery images
const items = Array.from(document.querySelectorAll('.gallery-item'));
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
let current = 0;

function open(index) {
  current = index;
  const img = items[index].querySelector('img');
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function close() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  // Delay clearing src so fade-out looks clean
  setTimeout(() => { lbImg.src = ''; }, 250);
}

function prev() { open((current - 1 + items.length) % items.length); }
function next() { open((current + 1) % items.length); }

// Open on click
items.forEach((item, i) => item.addEventListener('click', () => open(i)));

// Controls
document.getElementById('lb-close').addEventListener('click', close);
document.getElementById('lb-prev').addEventListener('click', (e) => { e.stopPropagation(); prev(); });
document.getElementById('lb-next').addEventListener('click', (e) => { e.stopPropagation(); next(); });

// Close on backdrop click (not on image)
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target.classList.contains('lightbox-img-wrap')) close();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('is-open')) return;
  if (e.key === 'Escape')       close();
  if (e.key === 'ArrowLeft')    prev();
  if (e.key === 'ArrowRight')   next();
});

// Touch swipe support
let touchStartX = 0;
lightbox.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

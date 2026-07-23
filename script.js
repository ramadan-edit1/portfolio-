// mobile menu
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
menuToggle.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

// portfolio hover preview (play muted preview on hover, pause on leave)
const pCards = document.querySelectorAll('.p-card');
pCards.forEach(card => {
  const vid = card.querySelector('video');
  card.addEventListener('mouseenter', () => { vid.currentTime = 0; vid.play().catch(() => {}); });
  card.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });
});

// portfolio click -> fullscreen modal with controls
const modal = document.getElementById('videoModal');
const vmVideo = document.getElementById('vmVideo');
const vmClose = document.getElementById('vmClose');

pCards.forEach(card => {
  card.addEventListener('click', () => {
    vmVideo.src = card.dataset.video;
    modal.classList.add('open');
    vmVideo.play().catch(() => {});
  });
});

function closeModal() {
  modal.classList.remove('open');
  vmVideo.pause();
  vmVideo.removeAttribute('src');
  vmVideo.load();
}
vmClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

// scroll reveal animation (sections + staggered children)
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(element => revealObserver.observe(element));

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAoSyTgYejgSkw2VHBxX8tjUZAMLqUaREU",
  authDomain: "ramadan-portfolio.firebaseapp.com",
  projectId: "ramadan-portfolio",
  storageBucket: "ramadan-portfolio.firebasestorage.app",
  messagingSenderId: "790050783385",
  appId: "1:790050783385:web:599a9188c28671900ff808"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
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
const claimBtn = document.getElementById("claimBtn");
const discountInput = document.getElementById("discountCode");
const message = document.getElementById("discountMessage");

claimBtn?.addEventListener("click", async () => {

    const code = discountInput.value.trim().toUpperCase();

    if (!code) {
        message.innerText = "Please enter a discount code.";
        return;
    }

    try {

        const ref = doc(db, "discountCodes", code);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            message.innerText = "Invalid discount code.";
            return;
        }

        const data = snap.data();

        if (!data.active) {
            message.innerText = "This code is no longer active.";
            return;
        }

        if (data.used >= data.maxUses) {
            message.innerText = "This code has reached its usage limit.";
            return;
        }

        message.innerText = "Discount unlocked! Redirecting...";

        const phone = "201558768873";

       const text =
`السلام عليكم،

أنا دخلت موقعك وأرغب في الاستفادة من كود الخصم.

🎁 كود الخصم: ${code}

حابب أستفسر عن خدمة المونتاج وأبدأ معاك.`;
        window.open(
            `https://wa.me/${phone}?text=${encodeURIComponent(text)}`,
            "_blank"
        );

    } catch (err) {

        console.error(err);
        message.innerText = "Something went wrong.";

    }

});
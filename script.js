import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    increment
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// ================= Firebase Config =================
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

// ================= Mobile Menu =================
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
}

// ================= Portfolio Cards Hover Preview =================
const pCards = document.querySelectorAll('.p-card');

pCards.forEach(card => {
    const vid = card.querySelector('video');
    if (!vid) return;

    card.addEventListener('mouseenter', () => {
        vid.currentTime = 0;
        vid.play().catch(() => {});
    });

    card.addEventListener('mouseleave', () => {
        vid.pause();
        vid.currentTime = 0;
    });
});

// ================= Video Modal =================
const modal = document.getElementById('videoModal');
const vmVideo = document.getElementById('vmVideo');
const vmClose = document.getElementById('vmClose');

if (modal && vmVideo) {
    pCards.forEach(card => {
        card.addEventListener('click', () => {
            const videoSrc = card.dataset.video;
            if (videoSrc) {
                vmVideo.src = videoSrc;
                modal.classList.add('open');
                vmVideo.play().catch(() => {});
            }
        });
    });

    const closeModal = () => {
        modal.classList.remove('open');
        vmVideo.pause();
        vmVideo.removeAttribute('src');
        vmVideo.load();
    };

    if (vmClose) vmClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
}

// ================= Scroll Reveal Animation =================
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

// ================= Discount Claim System =================
const claimBtn = document.getElementById("claimBtn");
const discountInput = document.getElementById("discountCode");
const message = document.getElementById("discountMessage");

if (claimBtn && discountInput && message) {
    claimBtn.addEventListener("click", async () => {
        const code = discountInput.value.trim().toUpperCase();

        if (!code) {
            message.innerText = "Please enter a discount code.";
            message.style.color = "#f59e0b";
            return;
        }

        try {
            const ref = doc(db, "discountCodes", code);
            const snap = await getDoc(ref);

            if (!snap.exists()) {
                message.innerText = "Invalid discount code.";
                message.style.color = "#ef4444";
                return;
            }

            const data = snap.data();

            if (!data.active) {
                message.innerText = "This code is no longer active.";
                message.style.color = "#ef4444";
                return;
            }

            if (data.used >= data.maxUses) {
                message.innerText = "This code has reached its usage limit.";
                message.style.color = "#ef4444";
                return;
            }
            await updateDoc(ref, {
    used: increment(1)
});
            message.innerText = "Discount unlocked! Redirecting...";
            message.style.color = "#22c55e";

            const phone = "201558768873";
            const text = `السلام عليكم،\n\nأنا دخلت موقعك وأرغب في الاستفادة من كود الخصم.\n\n🎁 كود الخصم: ${code}\n💸 قيمة الخصم: ${data.discount}%\n\nحابب أستفسر عن خدمة المونتاج وأبدأ معاك.`;
            setTimeout(() => {
                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
            }, 800);

        } catch (err) {
            console.error(err);
            message.innerText = "Something went wrong.";
            message.style.color = "#ef4444";
        }
    });
}
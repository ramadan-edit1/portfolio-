import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

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
const auth = getAuth(app);

// ================= DOM Elements =================
const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const error = document.getElementById("error");

// ================= Login Function =================
async function handleLogin() {
    error.textContent = "";

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (!emailValue || !passwordValue) {
        error.textContent = "يرجى إدخال البريد الإلكتروني وكلمة المرور";
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, emailValue, passwordValue);
        window.location.href = "dashboard.html";
    } catch (e) {
        console.error(e);
        error.textContent = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
    }
}

// ================= Event Listeners =================
loginBtn.addEventListener("click", handleLogin);

// Enter key support
[email, password].forEach(input => {
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    });
});

// Check if already logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "dashboard.html";
    }
});
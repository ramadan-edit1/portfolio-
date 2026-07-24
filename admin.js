import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

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

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const error = document.getElementById("error");

loginBtn.addEventListener("click", async () => {

    error.textContent = "";

    try {

        await signInWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );

        window.location.href = "dashboard.html";

    } catch (e) {

        error.textContent = "البريد الإلكتروني أو كلمة المرور غير صحيحة";

    }

});

onAuthStateChanged(auth, (user) => {

    if (user) {

        window.location.href = "dashboard.html";

    }

});
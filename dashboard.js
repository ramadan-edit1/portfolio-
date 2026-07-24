import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    deleteDoc,
    updateDoc,
    onSnapshot
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
const auth = getAuth(app);

// ================= Protect Route & Logout =================
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "admin.html";
    }
});

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = "admin.html";
    });
}

// ================= DOM Elements =================
const table = document.getElementById("codesTable");
const totalCodes = document.getElementById("totalCodes");
const activeCodes = document.getElementById("activeCodes");
const usedCodes = document.getElementById("usedCodes");

const generateBtn = document.getElementById("generateBtn");
const createBtn = document.getElementById("createBtn");

const newCode = document.getElementById("newCode");
const newDiscount = document.getElementById("newDiscount");
const newMaxUses = document.getElementById("newMaxUses");

const editModal = document.getElementById("editModal");
const editDiscount = document.getElementById("editDiscount");
const editMaxUses = document.getElementById("editMaxUses");
const saveEdit = document.getElementById("saveEdit");
const cancelEdit = document.getElementById("cancelEdit");
const toast = document.getElementById("toast");

// ================= Toast =================
function showToast(message, type = "success") {
    toast.className = "";
    toast.classList.add(type, "show");
    toast.textContent = message;

    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// ================= State =================
let codes = [];
let editingId = null;

// ================= Render Table =================
function renderTable() {
    table.innerHTML = "";

    let total = 0;
    let active = 0;
    let used = 0;

    codes.forEach(item => {
        total++;
        if (item.active) active++;
        used += item.used;

        table.innerHTML += `
        <tr>
            <td>${item.code}</td>
            <td>${item.discount}%</td>
            <td>${item.used}</td>
            <td>${item.maxUses}</td>
            <td>${item.active ? "🟢 Active" : "🔴 Disabled"}</td>
            <td>
                <button class="editBtn" data-id="${item.id}">✏️</button>
                <button class="toggleBtn" data-id="${item.id}">${item.active ? "🔒" : "🔓"}</button>
                <button class="copyBtn" data-id="${item.id}">📋</button>
                <button class="shareBtn" data-id="${item.id}">📤</button>
                <button class="deleteBtn" data-id="${item.id}">🗑️</button>
            </td>
        </tr>`;
    });

    totalCodes.textContent = total;
    activeCodes.textContent = active;
    usedCodes.textContent = used;
}

// ================= Realtime Listener =================
onSnapshot(collection(db, "discountCodes"), (snapshot) => {
    codes = [];
    snapshot.forEach((document) => {
        codes.push({
            id: document.id,
            ...document.data()
        });
    });
    renderTable();
});

// ================= Generate Code =================
generateBtn.addEventListener("click", () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "RAM-";
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    newCode.value = code;
});

// ================= Create Code =================
createBtn.addEventListener("click", async () => {
    if (!newCode.value || !newDiscount.value || !newMaxUses.value) {
        showToast("من فضلك أكمل جميع البيانات.", "warning");
        return;
    }

    try {
        await setDoc(doc(db, "discountCodes", newCode.value.toUpperCase()), {
            code: newCode.value.toUpperCase(),
            discount: Number(newDiscount.value),
            active: true,
            used: 0,
            maxUses: Number(newMaxUses.value)
        });

        newCode.value = "";
        newDiscount.value = "";
        newMaxUses.value = "";

        showToast("تم إنشاء كود الخصم بنجاح 🎉", "success");
    } catch (err) {
        console.error(err);
        showToast("حدث خطأ أثناء تنفيذ العملية.", "error");
    }
});

// ================= Actions (Delegation) =================
document.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = btn.dataset.id;
    if (!id) return;

    const item = codes.find(c => c.id === id);
    if (!item) return;

    // Copy
    if (btn.classList.contains("copyBtn")) {
        await navigator.clipboard.writeText(item.code);
        showToast("✅ تم نسخ الكود بنجاح", "success");
        return;
    }

    // Share
    if (btn.classList.contains("shareBtn")) {
        const message = `🎁 كود خصم جديد!\n\n🔑 الكود: ${item.code}\n\n💸 الخصم: ${item.discount}%\n\n🌐 الموقع:\nhttps://ramadan-edit1.github.io/portfolio-/\n\nاستمتع بالخصم عند طلب خدمة المونتاج.`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
        return;
    }

    // Delete
    if (btn.classList.contains("deleteBtn")) {
        if (!confirm(`حذف الكود ${item.code} ؟`)) return;
        await deleteDoc(doc(db, "discountCodes", id));
        return;
    }

    // Toggle
    if (btn.classList.contains("toggleBtn")) {
        await updateDoc(doc(db, "discountCodes", id), { active: !item.active });
        return;
    }

    // Edit
    if (btn.classList.contains("editBtn")) {
        editingId = id;
        editDiscount.value = item.discount;
        editMaxUses.value = item.maxUses;
        editModal.classList.add("show");
        return;
    }
});

// ================= Edit Modal =================
cancelEdit.addEventListener("click", () => {
    editModal.classList.remove("show");
    editingId = null;
});

saveEdit.addEventListener("click", async () => {
    if (!editingId) return;

    await updateDoc(doc(db, "discountCodes", editingId), {
        discount: Number(editDiscount.value),
        maxUses: Number(editMaxUses.value)
    });

    editModal.classList.remove("show");
    editingId = null;
    showToast("تم تعديل الكود بنجاح", "success");
});
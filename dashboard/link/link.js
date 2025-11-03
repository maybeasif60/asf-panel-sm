import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyArUMHWhrM-g0m0-kXTu_EWmGACetQvLlc",
  authDomain: "asf-panel-sm.firebaseapp.com",
  projectId: "asf-panel-sm",
  storageBucket: "asf-panel-sm.firebasestorage.app",
  messagingSenderId: "444535178333",
  appId: "1:444535178333:web:da733a6f819a0c4529f9b4",
  measurementId: "G-BSFWL4LLY5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// DOM
const linkNameInput = document.getElementById("linkName");
const linkURLInput = document.getElementById("linkURL");
const addBtn = document.getElementById("addBtn");
const linkTable = document.querySelector("#linkTable tbody");
const logoutBtn = document.getElementById("logoutBtn");

// Auth check
onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "../login/login.html";
});

// -------------------- Modern Popup --------------------
function showPopup(message, type = "success") {
  const popup = document.createElement("div");
  popup.className = `popup-notification ${type}`;
  popup.innerHTML = message;

  Object.assign(popup.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "12px 20px",
    backgroundColor: type === "success" ? "#4caf50" : "#f44336",
    color: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    zIndex: 9999,
    fontFamily: "Poppins, sans-serif",
    fontSize: "14px",
    opacity: 0,
    transform: "translateY(-20px)",
    transition: "opacity 0.3s, transform 0.3s",
  });

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.style.opacity = 1;
    popup.style.transform = "translateY(0)";
  }, 10);

  setTimeout(() => {
    popup.style.opacity = 0;
    popup.style.transform = "translateY(-20px)";
    setTimeout(() => popup.remove(), 300);
  }, 2500);
}

// -------------------- Confirmation Modal --------------------
function showConfirm(message) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;

    const modal = document.createElement("div");
    modal.style.cssText = `
      background: #fff;
      padding: 20px 30px;
      border-radius: 10px;
      max-width: 400px;
      width: 90%;
      text-align: center;
      font-family: Poppins, sans-serif;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;

    modal.innerHTML = `
      <p style="margin-bottom: 20px; font-size:16px;">${message}</p>
      <button id="confirmYes" style="padding:8px 16px;margin-right:10px;background:#4caf50;color:#fff;border:none;border-radius:5px;cursor:pointer;">Yes</button>
      <button id="confirmNo" style="padding:8px 16px;background:#f44336;color:#fff;border:none;border-radius:5px;cursor:pointer;">No</button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    document.getElementById("confirmYes").onclick = () => {
      overlay.remove();
      resolve(true);
    };
    document.getElementById("confirmNo").onclick = () => {
      overlay.remove();
      resolve(false);
    };
  });
}

// -------------------- Add Link --------------------
addBtn.addEventListener("click", async () => {
  const name = linkNameInput.value.trim();
  let url = linkURLInput.value.trim();

  if (!name || !url) return showPopup("Enter both name and URL", "error");

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  await push(ref(db, "links"), { name, url });
  linkNameInput.value = "";
  linkURLInput.value = "";
  showPopup("Link added successfully!");
});

// -------------------- Display Links and Delete --------------------
onValue(ref(db, "links"), (snapshot) => {
  linkTable.innerHTML = "";
  snapshot.forEach((child) => {
    const { name, url } = child.val();
    const key = child.key;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td><a href="${url}" target="_blank">${url}</a></td>
      <td><button class="delete" data-id="${key}">Delete</button></td>
    `;
    linkTable.appendChild(row);
  });

  document.querySelectorAll(".delete").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      const confirmed = await showConfirm("Are you sure you want to delete this link?");
      if (!confirmed) return;

      await remove(ref(db, `links/${id}`));
      showPopup("Link deleted successfully!", "success");
    };
  });
});

// -------------------- Logout --------------------
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "../login/";
});

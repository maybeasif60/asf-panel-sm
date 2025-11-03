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

// DOM Elements
const linkNameInput = document.getElementById("linkName");
const linkURLInput = document.getElementById("linkURL");
const addBtn = document.getElementById("addBtn");
const linkTable = document.querySelector("#linkTable tbody");
const logoutBtn = document.getElementById("logoutBtn");

// Auth check
onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "../login/login.html";
});

// Add link
addBtn.addEventListener("click", async () => {
  const name = linkNameInput.value.trim();
  let url = linkURLInput.value.trim();

  if (!name || !url) return alert("Enter both name and URL");

  // Add https:// if missing
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  await push(ref(db, "links"), { name, url });
  linkNameInput.value = "";
  linkURLInput.value = "";
});

// Display links and delete with confirmation
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

  // Delete button with confirmation
  document.querySelectorAll(".delete").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      const confirmDelete = confirm("Are you sure you want to delete this link?");
      if (!confirmDelete) return;
      try {
        await remove(ref(db, `links/${id}`));
        alert("Link deleted successfully");
      } catch (err) {
        alert("Error: " + err.message);
      }
    };
  });
});

// Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "../login/";
});

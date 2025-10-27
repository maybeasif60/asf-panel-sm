import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
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
const auth = getAuth(app);

// DOM Elements
const userNameEl = document.getElementById('userName');

// Check login state
onAuthStateChanged(auth, (user) => {
  if (user) {
    if(userNameEl) {
      // Show user's email or display name
      userNameEl.textContent = user.displayName || user.email || "User";
    }
  } else {
    // Redirect to login if not logged in
    window.location.href = '../login/index.html';
  }
});

// Logout function
window.logout = () => {
  signOut(auth)
    .then(() => {
      window.location.href = '../login/';
    })
    .catch((error) => {
      console.error("Logout failed:", error);
      alert("Logout failed. Try again.");
    });
};

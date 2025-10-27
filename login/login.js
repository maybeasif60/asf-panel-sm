import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyArUMHWhrM-g0m0-kXTu_EWmGACetQvLlc",
  authDomain: "asf-panel-sm.firebaseapp.com",
  projectId: "asf-panel-sm",
  storageBucket: "asf-panel-sm.firebasestorage.app",
  messagingSenderId: "444535178333",
  appId: "1:444535178333:web:da733a6f819a0c4529f9b4",
  measurementId: "G-BSFWL4LLY5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('error-msg');

// Redirect if already logged in
onAuthStateChanged(auth, (user) => {
  if(user){
    console.log("Logged in UID:", user.uid);
    window.location.href = '..//dashboard/index.html';
  }
});

// Handle login
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const uid = userCredential.user.uid;
      console.log("Logged in UID:", uid);
      window.location.href = '..//dashboard/index.html';
    })
    .catch((error) => {
      let message = "";

      switch(error.code){
        case "auth/invalid-email":
          message = "❌ Email ঠিক হয়নি।";
          break;
        case "auth/user-not-found":
          message = "❌ User পাওয়া যায়নি।";
          break;
        case "auth/wrong-password":
          message = "❌ Password ভুল।";
          break;
        case "auth/too-many-requests":
          message = "❌ অনেকবার চেষ্টা হয়েছে, কিছুক্ষণ পরে আবার চেষ্টা করুন।";
          break;
        default:
          message = "❌ Login করতে সমস্যা হচ্ছে।";
      }

      errorMsg.textContent = message;
    });
});

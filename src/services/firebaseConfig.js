import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// REPLACE THESE WITH YOUR CREDENTIALS FROM THE FIREBASE CONSOLE:
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Safety check to bypass crashes if the user hasn't added their credentials yet
export const hasFirebaseCredentials = firebaseConfig.apiKey !== "YOUR_API_KEY";

let firebaseApp = null;
let firebaseAuth = null;
let firestoreDb = null;

if (hasFirebaseCredentials) {
  try {
    firebaseApp = initializeApp(firebaseConfig);
    firebaseAuth = getAuth(firebaseApp);
    firestoreDb = getFirestore(firebaseApp);
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
  }
} else {
  console.warn("Firebase credentials not configured. Running in LocalStorage guest mode.");
}

export const auth = firebaseAuth;
export const db = firestoreDb;

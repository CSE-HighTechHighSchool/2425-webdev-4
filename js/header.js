// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
	getAuth,
	createUserWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import {getDatabase, ref, set, update, child, get} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Web App Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDap12j88caG7TkEaPKESTE-oFCGuUh3q8",
    authDomain: "se-website-project.firebaseapp.com",
    databaseURL: "https://se-website-project-default-rtdb.firebaseio.com",
    projectId: "se-website-project",
    storageBucket: "se-website-project.firebasestorage.app",
    messagingSenderId: "428779366020",
    appId: "1:428779366020:web:c4db5c86f69e8725fac4d1"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase();

// Function to log out the user
function logout() {
	sessionStorage.removeItem("user"); // Clear session storage
	localStorage.removeItem("user"); // Clear local storage
	localStorage.removeItem("keepLoggedIn"); // Clear logged in setting

	signOut(auth)
		.then(() => {
			// Sign out successful
		})
		.catch((error) => {
			// Error occured
		});

	window.location = "index.html";
}

// Function to update the authentication button
function updateButton() {
    const authButton = document.getElementById("authButton");
    authButton.classList.add("auth-button"); // Add the base class

    if (localStorage.getItem("user") || sessionStorage.getItem("user")) {
        authButton.innerHTML = "Log Out";
        authButton.classList.add("log-out");
        authButton.classList.remove("sign-in");
        authButton.addEventListener("click", logout);
    } else {
        authButton.innerHTML = "Sign In";
        authButton.classList.add("sign-in");
        authButton.classList.remove("log-out");
        authButton.addEventListener("click", () => {
            window.location = "signIn.html"; // Redirect to sign-in page
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateButton();
});
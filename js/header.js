import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
	getAuth,
	createUserWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import {getDatabase, ref, set, update, child, get} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Your web app's Firebase configuration
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
function updateButton() {
	const authButton = document.getElementById("authButton");
	if (localStorage.getItem("user") || sessionStorage.getItem("user")) {
		authButton.innerHTML = "Log Out";
		authButton.addEventListener("click", logout);
	} else {
        authButton.innerHTML = "Sign In";
        authButton.addEventListener("click", () => {
            window.location = "signIn.html";
        });
    }
}


document.addEventListener("DOMContentLoaded", () => {
    updateButton();
});


// ---------------------- Log Out User ---------------------------------------//

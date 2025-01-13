// This JS file is for registering a new app user ---------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
	getAuth,
	createUserWithEmailAndPassword,
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

// ---------------- Register New User --------------------------------//

document.getElementById("submitData").onclick = function () {
	const firstName = document.getElementById("firstName").value;
	const lastName = document.getElementById("lastName").value;
	const userEmail = document.getElementById("userEmail").value;

	const password = document.getElementById("userPass").value;

	if (validation(firstName, lastName, userEmail, password)) {
		createUserWithEmailAndPassword(auth, userEmail, password)
			.then((userCredential) => {
				// Signed up
				const user = userCredential.user;
        set(ref(db, 'users/' + user.uid + '/accountInfo'), {
          uid: user.uid,
          firstName: firstName,
          lastName: lastName,
          email: userEmail,
          password: encryptPass(password)
        });
      
      
      })
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				// ..

        alert(errorMessage);
			});
	}
};

// --------------- Check for null, empty ("") or all spaces only ------------//
function isEmptyorSpaces(str) {
	return str === null || str.match(/^ *$/) !== null;
}

// ---------------------- Validate Registration Data -----------------------//

function validation(firstName, lastName, userEmail, password) {
  let fnameRegex = /^[a-zA-Z]+$/;
  let lnameRegex = /^[a-zA-Z]+$/;
  let emailRegex = /^[a-zA-Z0-9]+@ctemc\.org$/;

  if (
      isEmptyorSpaces(firstName) ||
      isEmptyorSpaces(lastName) ||
      isEmptyorSpaces(userEmail) ||
      isEmptyorSpaces(password)
  ) {
      alert("Please complete all fields.");
      return false;
  }

  if (!firstName.match(fnameRegex)) {
      alert("First name must contain only letters.");
      return false;
  }

  if (!lastName.match(lnameRegex)) {
      alert("Last name must contain only letters.");
      return false;
  }

  if (!userEmail.match(emailRegex)) {
      alert("Please enter a valid email address.");
      return false;
  }

  if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return false;
  }

  alert("Successfully registered!");
  return true;
}


// --------------- Password Encryption -------------------------------------//

function encryptPass(password) {
  // Encrypt password
  let encrypted = CryptoJS.AES.encrypt(password, password)
  return encrypted.toString();
}
// ----------------- User Sign-In Page --------------------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import {getDatabase, ref, set, update, child, get}  from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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


// Initialize Firebase authentication
const app = initializeApp(firebaseConfig);
const auth = getAuth();

const db = getDatabase(app);
// ---------------------- Sign-In User ---------------------------------------//

document.getElementById('signIn').onclick = function(){
    // Get suer's email and password for sign in 
    const email = document.getElementById('signUserEmail').value;
    const password = document.getElementById('signUserPass').value;

    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user;

        console.log(user);
    
        // Log sign-in in db
        // Update will only add the last_login and won't overwrite anything
        let logDate = new Date().toISOString();
        // Console message for debugging
        console.log('skibidi')
    
        update(ref(db, 'users/' + user.uid), {
            last_login: logDate // Add or update the last_login field
        })
        .then(() => {
            // Successfully updated
            get(ref(db, 'users/' + user.uid)).then((snapshot) => {
                if (snapshot.exists()) {
                    console.log('Data available:', snapshot.val());
                    logIn(snapshot.val());
                } else {
                    console.log('No data available');
                    alert('No account found. Please check your credentials or register for a new account.');
                }
            }).catch((error) => {
                console.error(error);
            });
        })
        .catch((error) => {
            console.error('Error updating data:', error);
        });
        // Console message for debugging
        console.log('skibidi 2')
    }).catch((error) => {
        alert(error);
        console.error('Sign-in error:', error);
        // If there is an error during sign-in, display an alert
        alert('Sign-in error. Please check your credentials and try again.');
    });
    
}

// ---------------- Keep User Logged In ----------------------------------//

function logIn(user) {
    let keepLoggedIn = document.getElementById('keepLoggedInSwitch').checked;
    console.log('Keep logged in:', keepLoggedIn);
    if (keepLoggedIn) {
        localStorage.setItem('keepLoggedIn', 'yes');
        localStorage.setItem('user', JSON.stringify(user));
    } else {
        sessionStorage.setItem('user', JSON.stringify(user));
    }

    window.location.href = 'index.html'
}
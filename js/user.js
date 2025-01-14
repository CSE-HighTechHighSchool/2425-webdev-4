// ----------------- Page Loaded After User Sign-in -------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
	getAuth,
	signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import {
	getDatabase,
  remove,
	ref,
	set,
	update,
	child,
	get,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
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


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth();

// Return an instance of your app's database
const db = getDatabase(app);

// ---------------------// Get reference values -----------------------------
let userLink = document.getElementById("userLink"); // User name for navbar
let signOutLink = document.getElementById("signOut"); // Sign out link
let welcome = document.getElementById("welcome"); // Welcome header
let currentUser = null; // Initialize current user to null

// ----------------------- Get User's Name'Name ------------------------------
function getUserName() {
	// Grab value for the 'keep logged in' switch
	let keepLoggedIn = localStorage.getItem("keepLoggedIn");

	// Grab the user information from the signIn.JS
	if (keepLoggedIn == "yes") {
		currentUser = JSON.parse(localStorage.getItem("user")).accountInfo;
	} else {
		currentUser = JSON.parse(sessionStorage.getItem("user")).accountInfo;
	}
}

// Sign-out function that will remove user info from local/session storage and
// sign-out from FRD
function signOutUser() {
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

	window.location = "home.html";
}

// ------------------------Set (insert) data into FRD ------------------------
function setData(userId, year, month, day, temperature) {
	//Must use brackets around variable name to use it as a key
	set(ref(db, "users/" + userId + "/data/" + year + "/" + month), {
		[day]: temperature,
	})
		.then(() => {
			alert("Data stored successfully.");
		})
		.catch((error) => {
			alert("There was an error. Error: " + error);
		});
}

// -------------------------Update data in database --------------------------
function updateData(userId, year, month, day, temperature) {
	//Must use brackets around variable name to use it as a key
	update(ref(db, "users/" + userId + "/data/" + year + "/" + month), {
		[day]: temperature,
	})
		.then(() => {
			alert("Data updated successfully.");
		})
		.catch((error) => {
			alert("There was an error. Error: " + error);
		});
}

// Provide the path through the nodes to the data requsted
function getData(userID, year, month, day) {
	let yearVal = document.getElementById("yearVal");
	let monthVal = document.getElementById("monthVal");
	let dayVal = document.getElementById("dayVal");
	let tempVal = document.getElementById("tempVal");

	const dbref = ref(db); // Firebase parameter for requesting data

	// Provide the path through the nodes to the data requested
	get(child(dbref, "users/" + userID + "/data/" + year + "/" + month))
		.then((snapshot) => {
			if (snapshot.exists()) {
				// Ensure you are using textContent and not textContext
				yearVal.textContent = year;
				monthVal.textContent = month;
				dayVal.textContent = day;

				// To get a specific value from a key: snapshot.val()[key]
				tempVal.textContent = snapshot.val()[day];
			} else {
				alert("No data found");
			}
		})
		.catch((error) => {
			alert("Unsuccessful, error: " + error);
		});
}

// ---------------------------Get a month's data set --------------------------
// Must be an async function because you need to get all the data from FRD
// before you can process it for a table or graph

// Add a row to the table
function addItemToTable(day, temp, tbody) {
	let tableRow = document.createElement("tr");
	let td1 = document.createElement("td");
	let td2 = document.createElement("td");

	td1.innerHTML = day;
	td2.innerHTML = temp;

	tableRow.appendChild(td1);
	tableRow.appendChild(td2);
	tbody.appendChild(tableRow);
}

async function getDataSet(userID, year, month) {
	let yearVal = document.getElementById("setYearVal");
	let monthVal = document.getElementById("setMonthVal");

	yearVal.textContent = `Year: ${year}`;
	monthVal.textContent = `Month: ${month}`;

	const days = [];
	const temps = [];
	const tbodyEl = document.getElementById("tbody-2"); // Select <tbody-2> elem.

	const dbref = ref(db); // FB parameter required for requesting data

	// Wait for all data to be pulled from the FB
	// Must provide the path through the nodes to the data
	await get(child(dbref, "users/" + userID + "/data/" + year + "/" + month))
		.then((snapshot) => {
			if (snapshot.exists()) {
				console.log(snapshot.val());

				snapshot.forEach((child) => {
					days.push(child.key);
					temps.push(child.val());
				});
			} else {
				alert("No data found");
			}
		})
		.catch((error) => {
			alert("unsuccessful, error: " + error);
		});

	// Dynamically add table rows to HTML using stringer interpolation
	tbodyEl.innerHTML = "";

	for (let i = 0; i < days.length; i++) {
		addItemToTable(days[i], temps[i], tbodyEl);
	}
}

// Add a item to the table of data

// -------------------------Delete a day's data from FRD ---------------------

function deleteData(userID, year, month, day) {
  remove(ref(db, 'users/' + userID + '/data/' + year + '/' + month + '/' + day)) .then( () => {
    alert('Data removed successfully')

  }).catch((error) => {
    alert(error)
  })
  
}

// --------------------------- Home Page Loading -----------------------------
window.onload = function () {
	// ------------------------- Set Welcome Message -------------------------
	getUserName(); // Get current user's first name
	if (currentUser == null) {
		userLink.innerText = "Create New Account";
		userLink.classList.replace("nav-link", "btn");
		userLink.classList.add("btn-primary");
		userLink.href = "register.html";

		signOutLink.innerText = "Sign In";
		signOutLink.classList.replace("nav-link", "btn");
		signOutLink.classList.add("btn-success");
		signOutLink.href = "signIn.html";
	} else {
		console.log(currentUser.firstName);
		userLink.innerText = currentUser.firstName;
		welcome.innerText = "Welcome " + currentUser.firstName;
		userLink.classList.replace("btn", "nav-link");
		userLink.classList.add("btn-primary");
		userLink.href = "#";

		signOutLink.innerText = "Sign Out";
		signOutLink.classList.replace("btn", "nav-link");
		signOutLink.classList.add("btn-success");

		console.log(currentUser);
		document.getElementById("signOut").onclick = function () {
			signOutUser();
		};
	}

	// Get, Set, Update, Delete Sharkriver Temp. Data in FRD
	// Set (Insert) data function call
	document.getElementById("set").onclick = function () {
		const year = document.getElementById("year").value;
		const month = document.getElementById("month").value;
		const day = document.getElementById("day").value;
		const temperature = document.getElementById("temperature").value;
		const userID = currentUser.uid;

		setData(userID, year, month, day, temperature);
	};

	// Update data function call
	document.getElementById("update").onclick = function () {
		const year = document.getElementById("year").value;
		const month = document.getElementById("month").value;
		const day = document.getElementById("day").value;
		const temperature = document.getElementById("temperature").value;
		const userID = currentUser.uid;

		updateData(userID, year, month, day, temperature);
	};

	// Get a datum function call
	document.getElementById("get").onclick = function () {
		const year = document.getElementById("year").value;
		const month = document.getElementById("month").value;
		const day = document.getElementById("day").value;
		const userID = currentUser.uid;

		getData(userID, year, month, day);
	};

	// Get a data set function call
  document.getElementById('getDataSet').onclick = function() {
	const year = document.getElementById("getSetYear").value;
	const month = document.getElementById("getSetMonth").value;
	const userID = currentUser.uid;

  getDataSet(userID, year, month)
  }

  document.getElementById('delete').onclick = function() {
    const year = document.getElementById("delYear").value;
    const month = document.getElementById("delMonth").value;
    const day = document.getElementById("delDay").value;
    const userID = currentUser.uid;
  
    deleteData(userID, year, month, day)
    }

	// Delete a single day's data function call
};

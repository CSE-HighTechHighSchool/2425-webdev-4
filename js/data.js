import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getDatabase, ref, update, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDap12j88caG7TkEaPKESTE-oFCGuUh3q8",
    authDomain: "se-website-project.firebaseapp.com",
    databaseURL: "https://se-website-project-default-rtdb.firebaseio.com",
    projectId: "se-website-project",
    storageBucket: "se-website-project.firebasestorage.app",
    messagingSenderId: "428779366020",
    appId: "1:428779366020:web:c4db5c86f69e8725fac4d1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);

// Check authentication state
let user = null;

function getUserName() {
	// Grab value for the 'keep logged in' switch
	let keepLoggedIn = localStorage.getItem("keepLoggedIn");

	// Grab the user information from the signIn.JS
	if (keepLoggedIn == "yes") {
		user = JSON.parse(localStorage.getItem("user")).accountInfo;
	} else {
		user = JSON.parse(sessionStorage.getItem("user")).accountInfo;
	}

    // Display the user's name
    console.log(user.uid);
}




window.onload = async function() {
    getUserName();
    await loadZipCode(user.uid);

    await initChart();
}

// Load existing zip code
async function loadZipCode(userId) {
    try {
        const snapshot = await get(ref(db, 'users/' + userId));
        if (snapshot.exists() && snapshot.val().zipCode) {
            document.getElementById('zipCode').value = snapshot.val().zipCode;
        }
    } catch (error) {
        console.error('Error loading zip code:', error);
    }
}

async function getRiskScores(fipsCode) {
    try {
        const snapshot = await get(ref(db, 'risk_scores/' + fipsCode));
        if (snapshot.exists()) {
            console.log(snapshot.val());
            return snapshot.val();
        } else {
            console.log("No data available for this FIPS code");
            return null;
        }
    } catch (error) {
        console.error('Error fetching risk scores:', error);
        return null;
    }
}

async function getFIPSCode(zipCode) {
    try {
        const snapshot = await get(ref(db, 'postal_codes/' + zipCode));
        if (snapshot.exists()) {
            console.log(snapshot.val().stcountyfp);
            return snapshot.val().stcountyfp;
        } else {
            console.log("No data available for this zip code");
            return null;
        }
    } catch (error) {
        console.error('Error fetching FIPS code:', error);
        return null;
    }
}


// Handle form submission
document.getElementById('setButton').onclick (async function() {
    e.preventDefault();

    
    const zipCode = document.getElementById('zipCode').value;
    if (!user) {
        alert('Please sign in to save your location');
        return;
    }

    console.log(user.uid);

    try {
        await update(ref(db, 'users/' + user.uid), {
            zipCode: zipCode,
            lastUpdated: new Date().toISOString()
        });
        alert('Location saved successfully');
    } catch (error) {
        console.error('Error saving zip code:', error);
        alert('Error saving location. Please try again.');
    }
});

let chart;

async function initChart() {
    await loadChartModule();
    const ctx = document.getElementById('riskChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Risk vs EAL Scores',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: 'black'
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Risk Score'
                    },
                    min: 0,
                    max: 100
                },
                y: {
                    title: {
                        display: true,
                        text: 'EAL Score'
                    },
                    min: 0,
                    max: 100
                }
            }
        }
    });
}

document.getElementById('zipForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const zipCode = document.getElementById('zipCode').value;
    
    const fipsCode = await getFIPSCode(zipCode);
    if (!fipsCode) {
        alert('Invalid zip code');
        return;
    }

    const scores = await getRiskScores(fipsCode);
    if (!scores) {
        alert('No risk data available for this location');
        return;
    }

    chart.data.datasets[0].data = [{
        x: scores.risk_score,
        y: scores.eal_score
    }];
    chart.update();
});


async function loadChartModule() {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

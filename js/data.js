import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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
const db = getDatabase(app);

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

async function loadChartModule() {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

async function getFIPSCode(zipCode) {
    try {
        const snapshot = await get(ref(db, 'postal_codes/' + zipCode));
        return snapshot.exists() ? snapshot.val().stcountyfp : null;
    } catch (error) {
        console.error('Error fetching FIPS code:', error);
        return null;
    }
}

async function getRiskScores(fipsCode) {
    try {
        const snapshot = await get(ref(db, 'risk_scores/' + fipsCode));
        return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
        console.error('Error fetching risk scores:', error);
        return null;
    }
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

// Initialize chart on load
initChart();
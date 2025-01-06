import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
	getAuth,
	onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
	getDatabase,
	ref,
	update,
	get,
	set,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

const firebaseConfig = {
	apiKey: "AIzaSyDap12j88caG7TkEaPKESTE-oFCGuUh3q8",
	authDomain: "se-website-project.firebaseapp.com",
	databaseURL: "https://se-website-project-default-rtdb.firebaseio.com",
	projectId: "se-website-project",
	storageBucket: "se-website-project.firebasestorage.app",
	messagingSenderId: "428779366020",
	appId: "1:428779366020:web:c4db5c86f69e8725fac4d1",
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
	console.log(user);
}

window.onload = async function () {
	getUserName();
	await loadZipCode(user.uid);

	await initChart();
};

// Load existing zip code
async function loadZipCode(userId) {
	try {
		const snapshot = await get(ref(db, "users/" + userId));
		if (snapshot.exists() && snapshot.val().zipCode) {
			document.getElementById("zipCode").value = snapshot.val().zipCode;
		}
	} catch (error) {
		console.error("Error loading zip code:", error);
	}
}

async function getRiskScores(fipsCode) {
	try {
		const snapshot = await get(ref(db, "risk_scores/" + fipsCode));
		if (snapshot.exists()) {
			console.log(snapshot.val());
			return snapshot.val();
		} else {
			console.log("No data available for this FIPS code");
			return null;
		}
	} catch (error) {
		console.error("Error fetching risk scores:", error);
		return null;
	}
}

async function getFIPSCode(zipCode) {
	try {
		const snapshot = await get(ref(db, "postal_codes/" + zipCode));
		if (snapshot.exists()) {
			console.log(snapshot.val().stcountyfp);
			return snapshot.val().stcountyfp;
		} else {
			console.log("No data available for this zip code");
			return null;
		}
	} catch (error) {
		console.error("Error fetching FIPS code:", error);
		return null;
	}
}

async function deleteZipCode() {
	if (!user) {
		alert("Please sign in to delete your location");
		return;
	}

	try {
		await update(ref(db, "users/" + user.uid), {
			zipCode: null,
			lastUpdated: new Date().toISOString(),
		});
		document.getElementById("zipCode").value = "";
		alert("Location deleted successfully");
	} catch (error) {
		console.error("Error deleting zip code:", error);
		alert("Error deleting location. Please try again.");
	}
}

document.getElementById("deleteButton").onclick = function () {
	deleteZipCode();
}

async function uploadZipCode() {
	const zipCode = document.getElementById("zipCode").value;
	if (!user) {
		alert("Please sign in to save your location");
		return;
	}

	console.log(user.uid);

	try {
		await update(ref(db, "users/" + user.uid), {
			zipCode: zipCode,
			lastUpdated: new Date().toISOString(),
		});
		alert("Location saved successfully");
	} catch (error) {
		console.error("Error saving zip code:", error);
		alert("Error saving location. Please try again.");
	}
}

document.getElementById("setButton").onclick = function () {
	uploadZipCode();
};

document.getElementById("plotButton").onclick = function () {
	let zipCode = document.getElementById("zipCode").value;
	let fipsCode = null;
	getFIPSCode(zipCode)
		.then((result) => {
			fipsCode = result;
            return getRiskScores(fipsCode);
		})
		.then((scores) => {
            console.log(scores);

            // Prepare data for each risk score and its corresponding EAL score
            let dataPoints = [
                { x: parseFloat(scores.earthquake_risk_score).toFixed(2), y: parseFloat(scores.earthquake_eal_score).toFixed(2), label: "Earthquake" },
                { x: parseFloat(scores.riverine_flooding_risk_score).toFixed(2), y: parseFloat(scores.riverine_flooding_eal_score).toFixed(2), label: "Riverine Flooding" },
                { x: parseFloat(scores.coastal_flooding_risk_score).toFixed(2), y: parseFloat(scores.coastal_flooding_eal_score).toFixed(2), label: "Coastal Flooding" },
                { x: parseFloat(scores.hurricane_risk_score).toFixed(2), y: parseFloat(scores.hurricane_eal_score).toFixed(2), label: "Hurricane" },
                { x: parseFloat(scores.tornado_risk_score).toFixed(2), y: parseFloat(scores.tornado_eal_score).toFixed(2), label: "Tornado" },
                { x: parseFloat(scores.wildfire_risk_score).toFixed(2), y: parseFloat(scores.wildfire_eal_score).toFixed(2), label: "Wildfire" },
                { x: parseFloat(scores.winter_weather_risk_score).toFixed(2), y: parseFloat(scores.winter_weather_eal_score).toFixed(2), label: "Winter Weather" },
                { x: parseFloat(scores.heat_wave_risk_score).toFixed(2), y: parseFloat(scores.heat_wave_eal_score).toFixed(2), label: "Heat Wave" },
                { x: parseFloat(scores.drought_risk_score).toFixed(2), y: parseFloat(scores.drought_eal_score).toFixed(2), label: "Drought" },
                { x: parseFloat(scores.hail_risk_score).toFixed(2), y: parseFloat(scores.hail_eal_score).toFixed(2), label: "Hail" },
                { x: parseFloat(scores.strong_wind_risk_score).toFixed(2), y: parseFloat(scores.strong_wind_eal_score).toFixed(2), label: "Strong Wind" },
                // Include overall risk vs EAL score
                { x: parseFloat(scores.risk_score).toFixed(2), y: parseFloat(scores.eal_score).toFixed(2), label: "Overall" },
            ];

            // Calculate bounds for zooming
            const xValues = dataPoints.map(point => parseFloat(point.x));
            const yValues = dataPoints.map(point => parseFloat(point.y));
            const xMin = Math.min(...xValues) - 5;
            const xMax = Math.max(...xValues) + 5;
            const yMin = Math.min(...yValues) - 5;
            const yMax = Math.max(...yValues) + 5;

            // Update the chart with new data
            chart.data.datasets[0].data = dataPoints;




            chart.options.scales.x.min = xMin;
            chart.options.scales.x.max = xMax;
            chart.options.scales.y.min = yMin;
            chart.options.scales.y.max = yMax;

            chart.update();
		});
};




let chart;

async function initChart() {
	await loadChartModule();
	const ctx = document.getElementById("riskChart").getContext("2d");
	chart = new Chart(ctx, {
		type: "scatter",
		data: {
			datasets: [
				{
					label: "Risk vs EAL Scores",
					data: [],
					backgroundColor: "rgba(54, 162, 235, 0.5)",
				},
			],
		},
		options: {
			plugins: {
				tooltip: {
					callbacks: {
						label: function (tooltipItem) {
							return `${tooltipItem.raw.label}: (${tooltipItem.raw.x}, ${tooltipItem.raw.y})`;
						},
					},
				},
				legend: {
					labels: {
						color: "black",
					},
				},
			},
			scales: {
				x: {
					title: {
						display: true,
						text: "Risk Score",
					},
					min: 0,
					max: 100,
				},
				y: {
					title: {
						display: true,
						text: "EAL Score",
					},
					min: 0,
					max: 100,
				},
			},
		},
	});


	chart.data.datasets[0].backgroundColor = [
		"rgba(255, 99, 132, 0.5)", // Earthquake
		"rgba(54, 162, 235, 0.5)", // Riverine Flooding
		"rgba(255, 206, 86, 0.5)", // Coastal Flooding
		"rgba(75, 192, 192, 0.5)", // Hurricane
		"rgba(153, 102, 255, 0.5)", // Tornado
		"rgba(255, 159, 64, 0.5)", // Wildfire
		"rgba(201, 203, 207, 0.5)", // Winter Weather
		"rgba(255, 205, 86, 0.5)", // Heat Wave
		"rgba(255, 99, 71, 0.5)", // Drought
		"rgba(144, 238, 144, 0.5)", // Hail
		"rgba(135, 206, 250, 0.5)", // Strong Wind
		"rgba(128, 128, 128, 0.5)", // Overall
	];
}

async function loadChartModule() {
	return new Promise((resolve) => {
		const script = document.createElement("script");
		script.src = "https://cdn.jsdelivr.net/npm/chart.js";
		script.onload = resolve;
		document.head.appendChild(script);
	});
}

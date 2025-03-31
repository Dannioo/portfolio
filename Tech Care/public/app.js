document.addEventListener("DOMContentLoaded", function () {
    let patientData = []; // Global storage for patient data

    // Fetch patient data from API
    fetch("/api/data")
        .then(response => response.json())
        .then(data => {
            console.log("API Response:", data);

            if (!Array.isArray(data)) {
                console.error("Invalid patient data format");
                return;
            }

            patientData = data;
            displayPatients();
            displayJessicaData();
            renderChart();
        })
        .catch(error => console.error("Error fetching patients:", error));

    /**
     * Display list of patients
     */
    function displayPatients() {
        const patientList = document.getElementById("patientList");
        if (!patientList) {
            console.error("patientList element not found!");
            return;
        }

        patientList.innerHTML = ""; // Clear previous content

        if (patientData.length === 0) {
            patientList.innerHTML = "<li>No patient data available</li>";
            return;
        }

        // Generate patient list dynamically
        patientData.forEach(patient => {
            const li = document.createElement("li");
            li.classList.add("patient-item");
            li.innerHTML = `
                <div class="patient-info">
                    <img src="${patient.profile_picture}" alt="${patient.name}" class="patient-img"/>
                    <div class="patient-details">
                        ${patient.name} <br/> ${patient.gender}, ${patient.age}
                    </div>
                    <div class="icon-container">
                        <img src="images/more horiz.svg"/>
                    </div>
                </div>
            `;
            patientList.appendChild(li);
        });
    }

    /**
     * Display patient details for Jessica Taylor
     */
    function displayJessicaData() {
        const jessica = patientData.find(patient => patient.name === "Jessica Taylor");
        if (!jessica) {
            console.warn("Jessica Taylor not found in data.");
            return;
        }

        // Populate personal info section
        document.getElementById("info").innerHTML = `
            <img src="${jessica.profile_picture}" alt="${jessica.name}" class="selected-patient-img"/>
            <h2>${jessica.name}</h2>
            ${generateInfoItem("images/dob.svg", "Date of Birth", jessica.date_of_birth)}
            ${generateInfoItem("images/female.svg", "Gender", jessica.gender)}
            ${generateInfoItem("images/phone.svg", "Contact Info.", jessica.phone_number)}
            ${generateInfoItem("images/phone.svg", "Emergency Contacts", jessica.emergency_contact)}
            ${generateInfoItem("images/insur.svg", "Insurance Provider", jessica.insurance_type)}
            <button>Show All Information</button>
        `;

        // Populate diagnostic history
        const diagnosticListDiv = document.getElementById("diagnosticList");
        diagnosticListDiv.innerHTML = `<h2>Diagnostic List</h2>${generateDiagnosticTable(jessica.diagnostic_list)}`;

        // Populate lab reports
        const labResultsDiv = document.getElementById("labReports");
        labResultsDiv.innerHTML = "<h2>Lab Results</h2>" + generateLabResults(jessica.lab_results);
    }

    /**
     * Render the diagnostic history chart
     */
    function renderChart() {
        const jessica = patientData.find(patient => patient.name === "Jessica Taylor");
        if (!jessica || !jessica.diagnosis_history) {
            console.warn("No diagnosis history available.");
            return;
        }

        const recentHistory = jessica.diagnosis_history.slice(-6);
        const labels = recentHistory.map(d => `${d.month} ${d.year}`);
        const systolicBP = recentHistory.map(d => d.blood_pressure.systolic.value);
        const diastolicBP = recentHistory.map(d => d.blood_pressure.diastolic.value);

        // Update BP values in UI
        updateBPValues(systolicBP, diastolicBP, recentHistory);

        // Render chart
        const ctx = document.getElementById("diagnosticChart");
        if (!ctx) {
            console.error("Chart element not found.");
            return;
        }

        new Chart(ctx.getContext("2d"), {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    { data: systolicBP, borderColor: "#E66FD2" },
                    { data: diastolicBP, borderColor: "#8C6FE6" }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: "Blood Pressure", font: { size: 24 } },
                    subtitle: { display: true, text: "Last 6 Months", align: "end" }
                },
                scales: { y: { beginAtZero: false, min: 40 } }
            }
        });

        document.getElementById("respiratory").innerHTML = `
            <img src="images/respiratory rate.svg"/><p>Respiratory Rate<br/><h2>${jessica.diagnosis_history[0].respiratory_rate.value} bpm</h2>${jessica.diagnosis_history[0].respiratory_rate.levels}</p>
        `;
        document.getElementById("temp").innerHTML = `
            <img src="images/temperature.svg"/><p>Temperature<br/><h2>${jessica.diagnosis_history[0].temperature.value} ° F</h2>${jessica.diagnosis_history[0].temperature.levels}</p>
        `;
        document.getElementById("bpm").innerHTML = `
            <img src="images/HeartBPM.svg"/><p>Heart Rate<br/><h2>${jessica.diagnosis_history[0].heart_rate.value} bpm</h2><img src="images/ArrowDown.svg"/> ${jessica.diagnosis_history[0].heart_rate.levels}</p>
        `;
    }

    /**
     * Utility function to generate an information item
     */
    function generateInfoItem(icon, label, value) {
        return `
            <div class="info-item">
                <img src="${icon}" alt="${label}"/>
                <div class="info-text">
                    <span>${label}</span>
                    <strong>${value}</strong>
                </div>
            </div>
        `;
    }

    /**
     * Utility function to generate the diagnostic table
     */
    function generateDiagnosticTable(diagnostics) {
        if (!diagnostics || diagnostics.length === 0) return "<p>No diagnostic history available</p>";
        return `
            <table class="diagnostic-table">
                <thead>
                    <tr><th>Diagnosis</th><th>Description</th><th>Status</th></tr>
                </thead>
                <tbody>
                    ${diagnostics.map(d => `<tr><td>${d.name}</td><td>${d.description}</td><td>${d.status}</td></tr>`).join('')}
                </tbody>
            </table>
        `;
    }

    /**
     * Utility function to generate lab results
     */
    function generateLabResults(labResults) {
        if (!labResults || labResults.length === 0) return "<p>No lab results available</p>";
        return `<ul class="lab-report-list">${labResults.map(test => `<li class="lab-report-item">${test}<img src="images/download.svg" alt="Download"></li>`).join('')}</ul>`;
    }

    /**
     * Update blood pressure values in UI
     */
    function updateBPValues(systolicBP, diastolicBP, history) {
        document.getElementById("systolic-value").innerHTML = `<strong>${systolicBP[systolicBP.length - 1]}</strong>`;
        document.getElementById("diastolic-value").innerHTML = `<strong>${diastolicBP[diastolicBP.length - 1]}</strong>`;
    }
});

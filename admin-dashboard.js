// js/admin-dashboard.js
import { db, auth, collection, getDocs, doc, updateDoc, onAuthStateChanged, signOut, serverTimestamp } from './firebase.js';

let allParticipants = []; // Store globally for search/filter

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check Auth
    onAuthStateChanged(auth, (user) => {
        if (!user) window.location.href = 'index.html';
        else loadDashboard();
    });

    // 2. Logout
    document.getElementById('btn-logout').addEventListener('click', () => {
        signOut(auth).then(() => window.location.href = 'index.html');
    });

    // 3. Tab Switching
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`tab-${tab.dataset.target}`).classList.add('active');
        });
    });

    // 4. Search & Filter
    document.getElementById('search-input').addEventListener('input', filterTable);
    document.getElementById('filter-class').addEventListener('change', filterTable);
});

// --- Load Data ---
async function loadDashboard() {
    try {
        const querySnapshot = await getDocs(collection(db, "registrations"));
        allParticipants = [];
        querySnapshot.forEach((doc) => {
            allParticipants.push({ id: doc.id, ...doc.data() });
        });

        // Update Stats
        document.getElementById('stat-total').innerText = allParticipants.length;
        document.getElementById('stat-xi').innerText = allParticipants.length; // Since everyone is XI
        document.getElementById('stat-checked').innerText = allParticipants.filter(p => p.checkedIn).length;

        renderTable(allParticipants);
    } catch (error) {
        console.error("Error loading data:", error);
        alert("Failed to load data. Check console.");
    }
}

// --- Render Table ---
function renderTable(data) {
    const tbody = document.getElementById('participant-table-body');
    tbody.innerHTML = '';
    
    data.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.fullName}</td>
            <td>${p.rollNumber}</td>
            <td>${new Date(p.timestamp?.toDate()).toLocaleDateString()}</td>
            <td><span style="color: ${p.checkedIn ? 'var(--success)' : 'var(--text-muted)'}">${p.checkedIn ? 'Checked In' : 'Pending'}</span></td>
            <td><button class="btn btn-secondary btn-small" onclick="viewDetails('${p.id}')">View</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// --- Filter Table ---
function filterTable() {
    const search = document.getElementById('search-input').value.toLowerCase();
    const filter = document.getElementById('filter-class').value;
    
    const filtered = allParticipants.filter(p => {
        const matchesSearch = p.fullName.toLowerCase().includes(search) || p.rollNumber.toLowerCase().includes(search);
        // Currently only Class XI, but code is ready for future classes
        const matchesClass = filter === 'all' || p.class === filter; 
        return matchesSearch && matchesClass;
    });
    renderTable(filtered);
}

// --- Export CSV ---
document.getElementById('btn-export-csv')?.addEventListener('click', () => {
    if (allParticipants.length === 0) return alert("No data to export.");
    
    const headers = ["Name", "Roll No", "Ticket ID", "Dream", "Expectations", "Checked In"];
    const csvRows = [headers.join(',')];
    
    allParticipants.forEach(p => {
        const row = [
            `"${p.fullName}"`, `"${p.rollNumber}"`, `"${p.ticketId}"`, 
            `"${p.bigDream.replace(/"/g, '""')}"`, `"${p.expectations.replace(/"/g, '""')}"`, 
            p.checkedIn
        ];
        csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'TFC2026_Registrations.csv');
    a.click();
});

// --- QR Scanner Logic ---
let html5QrCode;
document.querySelector('[data-target="scanner"]')?.addEventListener('click', () => {
    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("qr-reader");
    }
    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess
    ).catch(err => console.log("Camera error: ", err));
});

// Stop camera when leaving scanner tab
document.querySelectorAll('.tab-btn:not([data-target="scanner"])').forEach(btn => {
    btn.addEventListener('click', () => {
        if (html5QrCode && html5QrCode.isScanning) {
            html5QrCode.stop().catch(e => console.log(e));
        }
    });
});

// --- Verify Ticket ---
async function onScanSuccess(decodedText) {
    // decodedText will be the Ticket ID
    const resultDiv = document.getElementById('scan-result');
    resultDiv.classList.remove('hidden', 'scan-success', 'scan-error');
    resultDiv.innerText = "Verifying...";

    // Stop scanning temporarily so we can process
    if(html5QrCode) await html5QrCode.pause();

    try {
        const q = query(collection(db, "registrations"), where("ticketId", "==", decodedText));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            resultDiv.classList.add('scan-error');
            resultDiv.innerText = "INVALID TICKET ID.";
        } else {
            const docSnap = querySnapshot.docs[0];
            const data = docSnap.data();

            if (data.checkedIn) {
                resultDiv.classList.add('scan-error');
                resultDiv.innerHTML = `<h3>ALREADY CHECKED IN</h3><p>${data.fullName}</p>`;
            } else {
                // Mark as checked in
                await updateDoc(doc(db, "registrations", docSnap.id), { checkedIn: true, checkInTime: serverTimestamp() });
                resultDiv.classList.add('scan-success');
                resultDiv.innerHTML = `<h3>WELCOME</h3><p>${data.fullName} (${data.rollNumber})</p>`;
                loadDashboard(); // refresh stats
            }
        }
    } catch (error) {
        console.error(error);
        resultDiv.classList.add('scan-error');
        resultDiv.innerText = "Database Error.";
    }

    // Resume scanning after 3 seconds
    setTimeout(() => {
        resultDiv.classList.add('hidden');
        if(html5QrCode) html5QrCode.resume();
    }, 3000);
}

// Add manual check in logic
document.getElementById('btn-manual-checkin')?.addEventListener('click', () => {
    const val = document.getElementById('manual-ticket-input').value;
    if (val) onScanSuccess(val);
});
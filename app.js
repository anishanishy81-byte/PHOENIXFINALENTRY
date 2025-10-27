// Application State
let currentUser = null;
let currentRole = null;
let entries = [];
let loginActivity = [];
let currentHNumber = null; // Store the current displayed candidate H number
let hospitals = [ /* default list kept below (trimmed in this file preview) */ ];
let doctors = [ /* default doctor list kept below (trimmed in this file preview) */ ];

const credentials = {
    "ANISH": { password: "HARHARMAHADEV", role: "admin", name: "Administrator" },
    "SHARAN": { password: "8892970383", role: "SHARAN", name: "User One" },
    "MANU": { password: "9947502699", role: "admin", name: "Administrator" },
    "SUDHAKAR": { password: "8309205985", role: "SUDHAKAR", name: "User Three" },
    "ADAM": { password: "8073507830", role: "ADAM", name: "User FOUR" },
    "APARNA": { password: "7483912387", role: "APARNA", name: "Technician" }
};

let editingIndex = -1;
let addonIndex = -1;

/* ---------- Default hospitals & doctors arrays (kept from your original file) ---------- */
hospitals = [
    "AKSHA HOSPITALS", "APOLLO B.G ROAD", "CUREMAX", "DR R. B. PATIL HOSPITAL",
    "DURGA HEALTHCARE", "HIGHLAND HOSPITAL", "HOSMAT 3", "INDIANA HOSPITAL",
    "KCTRI", "KIMS AL SHIFA", "MIO HOSPITALS", "MOTHERHOOD", "NAMMA AROGYA",
    "NORTH WEST HOSPITAL", "PATHOGENIX", "PRIMA DIAGNOSTICS", "SARALAYA",
    "SL. GASTRO & LIVER CLINIC", "SRI PRAAGNA", "SRI PRASHANTHI HOSPITAL",
    "SRINIVASA HOSPITALS", "VENUS HEALTHCARE", "SIRI LABS", "GOVT MEDICAL COLLEGE",
    "CRIYA HOSPITALS", "MANGALA HOSPITALS", "BMJH HOSPITAL", "SPARSHA DIAGNOSTICS",
    "AGILUS DIAGNOSTICS", "HOSMAT H1", "OYSTER", "ALTOR", "HOMAT 2",
    "FATHER MULLER HOSPITAL", "PATHOGENIX LABS", "APOLLO HOSPITAL",
    "NANJAPPA LIFE CARE SHIVAMOGGA", "VIJAYSHREE HOSPITALS", "UNITY HOSPITAL",
    "HAMILTON BAAILEY", "KLE", "RADON CANCER CENTRE", "MAITHRI HOSPITAL",
    "HOSMAT 2", "SOLARIS", "APEX HOSPITALS", "RAMAIAH MCH", "HEALIUS HOSPITAL",
    "AROSYA", "QXL", "ARION RADIOTHERAPY", "Y LABS MANGALORE", "CANVA",
    "NEW LIFE HOSPITAL", "SURGIDERMA", "PATHCARE", "SPARSH HOSPITAL",
    "SHANTI HOSPITAL", "ASHWINI DIAGNOSTICS", "SVM HOSPITAL"
];

doctors = [
    "DR HARI KIRAN", "DR ADITHYA", "DR AJAY KUMAR", "DR ANIL KAMATH",
    "DR ANITA DAND", "DR ANTHONY PIAS", "DR ARAVIND", "DR ASHWIN M",
    "DR B J PRASAD REDDY", "DR B. R. PATIL", "DR DINESH SHET", "DR FAVAZ ALI M",
    "DR GAURAV SHETTY", "DR GURUPRASAD BHAT", "DR HARI KIRAN REDDY",
    "DR HEMANTH KUMAR", "DR INDUMATHY", "DR KIRAN KATTIMANI", "DR KUSHAL",
    "DR MADHUSHREE", "DR MANOJ GOWDA", "Dr NAVANEETH KAMATH", "DR NISHITHA SHETTY",
    "DR SAHITHYA DESIREDDY", "DR SHEELA", "DR SHIVASHANKAR BHAT", "DR SHOBITHA RAO",
    "DR SHRAVAN R", "DR SIDDARTH S", "DR SOWDIN REDDY", "DR SUMANTH BHOOPAL",
    "DR SURESH RAO", "DR SURYA SEN", "DR SWASTHIK", "DR SYAMALA SRIDEVI",
    "DR T.S RAO", "DR VIJAY AGARWAL", "DR VIJITH SHETTY", "DR VISHWANATH",
    "Dr.ASHWIN", "Dr.KRISHNA PRASAD", "Dr.MEENAKSHI JAIN", "Dr.SAMSKRTHY P MURTHY",
    "DR MANAS", "DR ALKA C BHAT", "DR GEETHA J P", "S S RAJU", "DR LENON DISOUSA",
    "DR ELDOY SALDANHA", "DR NEELIMA", "DR MADHURI SUMANTH", "DR ROOPESH",
    "DR SUMAN KUMAR", "DR VAMSEEDHAR", "DR AMIT KIRAN", "DR VIKRAM MAIYA",
    "DR DEEPU N K", "DR JALAUDDIN AKBAR", "DR MERLIN", "DR SAMSKRITI",
    "DR SANGEETHA K", "DR GOWRI", "DR YAMINI", "DR RAVEENA", "DR LYNSEL",
    "DR SUDHAKAR", "DR DINESH SHET", "DR SANTHOSH", "DR NAVEEN GOPAL",
    "DR ARAVIND N", "DR NAVANEETH KAMATH", "DR HARISHA K", "DR GURUCHANNA B",
    "DR DINESH KADAM", "DR BHAVANA SHERIGAR", "DR AADARSH", "DR ABHIJITH SHETTY",
    "MANGESH KAMATH", "DR SHASHIDHAR", "DR SANJEEV KULGOD", "DR BHUSHAN",
    "K MADHAVA RAO", "DR PAMPANAGOWDA", "DR MOUNA B.M", "DR CHANDRA SHEKAR", 
    "DR DINESH", "DR KRITHIKA", "DR BUSHAN", "DR ROHAN CHANDRA GATTI",
    "DR SHREYAS N M", "DR SRIHARI", "Ninan Thomas", "DR HARISH", "DR SMITHA RAO",
    "DR VENKATARAMANA", "DR KIRANA PAILOOR", "Y SANATH HEGDE", "Dr RANGANATH",
    "Dr SHIVA KUMAR", "DR RAVKANTH", "DR SHYAMALA REDDY", "KALPANA SRIDHAR",
    "DR CHANDRAKANTH", "DR MUSTAFA", "DR VIJAY KUMAR", "DR SANDHYA RAVI",
    "DR VIDYA V BHAT", "DR NCP", "DR SUNIL KUMAR", "NITHIN", "APOORVA S",
    "DR SHIVA PRASAD G", "DR CHANDANA PAI", "DR CHAITHRA BHAT", "DR PALLAVI",
    "DR JEFFREY LEWIS", "DR AMAR D N"
];
/* ------------------------------------------------------------------------------------- */

/* Firestore reference (db) is defined in index.html earlier as:
   const db = firebase.firestore();
   (compat SDK loaded in index.html)
*/

document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

async function initApp() {
    await loadStoredData();
    initializeEventListeners();
    checkLoginStatus();
}

// ---------------- Firestore helpers ----------------

async function getMetaDoc(docName) {
    const ref = db.collection('meta').doc(docName);
    const snap = await ref.get();
    return { ref, snap };
}

// load data from Firestore (or seed if missing)
async function loadStoredData() {
    try {
        // Load hospitals (single doc)
        const hospitalsDocRef = db.collection('meta').doc('hospitals');
        const hospitalsSnap = await hospitalsDocRef.get();
        if (hospitalsSnap.exists && hospitalsSnap.data().list && hospitalsSnap.data().list.length) {
            hospitals = hospitalsSnap.data().list;
        } else {
            // seed
            await hospitalsDocRef.set({ list: hospitals });
        }

        // Load doctors
        const doctorsDocRef = db.collection('meta').doc('doctors');
        const doctorsSnap = await doctorsDocRef.get();
        if (doctorsSnap.exists && doctorsSnap.data().list && doctorsSnap.data().list.length) {
            doctors = doctorsSnap.data().list;
        } else {
            await doctorsDocRef.set({ list: doctors });
        }

        // Load entries (all)
        const entriesSnap = await db.collection('entries').orderBy('timestamp', 'desc').get();
        entries = [];
        entriesSnap.forEach(doc => {
            const data = doc.data();
            data._id = doc.id;
            entries.push(data);
        });

        // Load loginActivity (recent few)
        const activitySnap = await db.collection('loginActivity').orderBy('timestamp', 'desc').limit(100).get();
        loginActivity = [];
        activitySnap.forEach(doc => {
            const d = doc.data();
            d._id = doc.id;
            loginActivity.push(d);
        });

        // Ensure counters doc exists
        const countersRef = db.collection('meta').doc('counters');
        const countersSnap = await countersRef.get();
        if (!countersSnap.exists) {
            await countersRef.set({ phoenixHNumberCounter: 0 });
        }

        // Generate candidate H number for UI
        await generateHNumber();

    } catch (err) {
        console.error('Error loading data from Firestore:', err);
        alert('Could not load data from Firestore. Check console for details.');
    }
}

// Save hospitals/doctors back to Firestore (when adding new entries)
async function saveMetaLists() {
    try {
        await db.collection('meta').doc('hospitals').set({ list: hospitals });
        await db.collection('meta').doc('doctors').set({ list: doctors });
    } catch (err) {
        console.error('Error saving meta lists to Firestore:', err);
    }
}

// ---------------- Session & Login helpers ----------------

function checkLoginStatus() {
    const storedUser = sessionStorage.getItem('phoenixCurrentUser');
    const storedRole = sessionStorage.getItem('phoenixCurrentRole');
    const storedName = sessionStorage.getItem('phoenixCurrentName');

    if (storedUser && storedRole) {
        currentUser = storedUser;
        currentRole = storedRole;
        setupUserInterface(storedName);
        showPage('home');
    } else {
        showPage('login');
    }
}

function initializeEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // Patient form
    document.getElementById('patientForm').addEventListener('submit', handlePatientSubmit);

    // Searchable dropdowns
    setupSearchableDropdown('hospitalInput', 'hospitalDropdown', hospitals);
    setupSearchableDropdown('doctorInput', 'doctorDropdown', doctors);

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.searchable-dropdown')) {
            document.querySelectorAll('.dropdown-list').forEach(list => {
                list.classList.remove('active');
            });
        }
    });

    // Load Google Sheets URL if stored (fallback to localStorage for this single admin preference)
    const storedUrl = localStorage.getItem('phoenixGoogleSheetUrl');
    if (storedUrl) {
        document.getElementById('googleSheetUrl').value = storedUrl;
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (credentials[username] && credentials[username].password === password) {
        currentUser = username;
        currentRole = credentials[username].role;
        const currentName = credentials[username].name;

        // Session storage for UI
        sessionStorage.setItem('phoenixCurrentUser', currentUser);
        sessionStorage.setItem('phoenixCurrentRole', currentRole);
        sessionStorage.setItem('phoenixCurrentName', currentName);

        // Log activity to Firestore
        const activity = {
            username: currentUser,
            name: currentName,
            role: currentRole,
            timestamp: new Date().toISOString(),
            status: 'online'
        };
        try {
            await db.collection('loginActivity').add(activity);
            // locally push for immediate UI
            loginActivity.unshift(activity);
        } catch (err) {
            console.error('Error writing login activity to Firestore', err);
        }

        setupUserInterface(currentName);
        showPage('home');
        document.getElementById('loginForm').reset();

        setTimeout(() => {
            alert(`Welcome to Phoenix Oncopathology, ${currentName}!`);
        }, 100);
    } else {
        alert('Invalid credentials. Please check username and password.');
    }
}

function setupUserInterface(userName) {
    document.body.className = currentRole;
    document.getElementById('navbar').classList.remove('hidden');

    // Update user info in navbar
    document.getElementById('currentUserName').textContent = userName;
    document.getElementById('currentUserRole').textContent = currentRole.toUpperCase();

    // Initialize home page
    setTodayDate();

    // Update admin stats and populate pages
    updateAdminStats();
    loadLoginActivity();
}

// ---------------- H Number generation + atomic increment ----------------

async function generateHNumber() {
    try {
        const countersRef = db.collection('meta').doc('counters');
        const snap = await countersRef.get();
        let counter = 0;
        if (snap.exists && typeof snap.data().phoenixHNumberCounter === 'number') {
            counter = snap.data().phoenixHNumberCounter;
        } else {
            await countersRef.set({ phoenixHNumberCounter: 0 });
            counter = 0;
        }

        const currentYear = new Date().getFullYear();
        const nextNumber = counter + 1;
        currentHNumber = `H-${nextNumber.toString().padStart(4, '0')}/${currentYear}`;
        document.getElementById('hNumber').value = currentHNumber;
    } catch (err) {
        console.error('Error generating H number:', err);
        document.getElementById('hNumber').value = 'H-0000/0000';
    }
}

// ---------------- Date helper ----------------

function setTodayDate() {
    const today = new Date().toLocaleDateString('en-GB');
    document.getElementById('entryDate').value = today;
}

// ---------------- Searchable dropdown helpers (unchanged) ----------------

function setupSearchableDropdown(inputId, dropdownId, dataArray) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);

    input.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredData = dataArray.filter(item => 
            item.toLowerCase().includes(searchTerm)
        );

        showDropdownItems(dropdown, filteredData, input);
    });

    input.addEventListener('focus', function() {
        showDropdownItems(dropdown, dataArray, input);
    });
}

function showDropdownItems(dropdown, items, input) {
    dropdown.innerHTML = '';

    items.slice(0, 10).forEach(item => {
        const div = document.createElement('div');
        div.className = 'dropdown-item';
        div.textContent = item;
        div.addEventListener('click', () => {
            input.value = item;
            dropdown.classList.remove('active');
        });
        dropdown.appendChild(div);
    });

    dropdown.classList.add('active');
}

// ---------------- Add new hospital/doctor (persist to Firestore) ----------------

async function addNewHospital() {
    const name = prompt('Enter new hospital name:');
    if (name && name.trim()) {
        const newHospital = name.trim().toUpperCase();
        if (!hospitals.includes(newHospital)) {
            hospitals.push(newHospital);
            hospitals.sort();
            document.getElementById('hospitalInput').value = newHospital;
            await saveMetaLists();
            alert('Hospital added successfully!');
        } else {
            alert('Hospital already exists!');
        }
    }
}

async function addNewDoctor() {
    const name = prompt('Enter new doctor name:');
    if (name && name.trim()) {
        const newDoctor = name.trim().toUpperCase();
        if (!doctors.includes(newDoctor)) {
            doctors.push(newDoctor);
            doctors.sort();
            document.getElementById('doctorInput').value = newDoctor;
            await saveMetaLists();
            alert('Doctor added successfully!');
        } else {
            alert('Doctor already exists!');
        }
    }
}

// ---------------- Patient submit (Firestore transaction + optional Google Sheets) ----------------

async function handlePatientSubmit(e) {
    e.preventDefault();

    const googleSheetUrl = document.getElementById('googleSheetUrl').value.trim();

    // Prepare formData from UI inputs (without final hNumber yet)
    const tentativeDate = document.getElementById('entryDate').value;
    const formData = {
        date: tentativeDate,
        patientName: document.getElementById('patientName').value.trim(),
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        hospital: document.getElementById('hospitalInput').value.trim(),
        doctor: document.getElementById('doctorInput').value.trim(),
        information: document.getElementById('information').value.trim(),
        containers: document.getElementById('containers').value,
        test: document.getElementById('testType').value,
        username: currentUser,
        timestamp: new Date().toISOString()
    };

    // Validate
    if (!formData.patientName || !formData.hospital || !formData.doctor || !formData.age || !formData.gender || !formData.containers || !formData.test) {
        alert('Please fill in all required fields.');
        return;
    }

    try {
        // If Google Sheets URL provided and not default placeholder, attempt Sheets sync first (optional)
        if (googleSheetUrl && googleSheetUrl !== '') {
            // attempt to send to Google Sheets but do not block final Firestore write on no-cors; keep as best-effort
            try {
                await saveToGoogleSheets({
                    date: tentativeDate,
                    hNumber: currentHNumber,
                    patientName: formData.patientName,
                    age: formData.age,
                    hospital: formData.hospital,
                    doctor: formData.doctor,
                    information: formData.information,
                    containers: formData.containers,
                    test: formData.test
                }, googleSheetUrl);
                localStorage.setItem('phoenixGoogleSheetUrl', googleSheetUrl);
            } catch (gsErr) {
                console.warn('Google Sheets sync warning:', gsErr);
                // continue — we will still save to Firestore
            }
        }

        // Use transaction to increment counter atomically and then add entry with that H-number
        const countersRef = db.collection('meta').doc('counters');

        const result = await db.runTransaction(async (tx) => {
            const snap = await tx.get(countersRef);
            let counter = 0;
            if (snap.exists && typeof snap.data().phoenixHNumberCounter === 'number') {
                counter = snap.data().phoenixHNumberCounter;
            }
            const newCounter = counter + 1;
            tx.update(countersRef, { phoenixHNumberCounter: newCounter });

            const currentYear = new Date().getFullYear();
            const newHNumber = `H-${newCounter.toString().padStart(4, '0')}/${currentYear}`;

            // Compose entry with final H number
            const entryToSave = {
                ...formData,
                hNumber: newHNumber,
                date: tentativeDate,
                savedAt: new Date().toISOString()
            };

            const entryRef = db.collection('entries').doc(); // auto-id
            tx.set(entryRef, entryToSave);

            return { newHNumber, entry: entryToSave };
        });

        // success
        const saved = result;
        entries.unshift(saved.entry); // local memory
        await generateHNumber(); // show next candidate H number
        await updateAdminStats();

        alert(`Entry saved successfully!\nH Number: ${saved.newHNumber}\nPatient: ${formData.patientName}`);
        resetForm();
        displayEntries(entries);

    } catch (error) {
        console.error('Error saving entry:', error);
        alert('Failed to save entry to Firestore. See console for details.');
    }
}

// Save to Google Sheets - unchanged except payload shape (best-effort)
async function saveToGoogleSheets(data, url) {
    const payload = {
        entry: {
            date: data.date,
            hNumber: data.hNumber,
            patientName: data.patientName,
            age: data.age,
            hospital: data.hospital,
            doctor: data.doctor,
            info: data.information || data.info || '',
            containers: data.containers,
            testName: data.test || ''
        }
    };

    // use fetch with mode no-cors (as before) — this is best-effort
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors'
    });

    return response;
}

// ---------------- Reset form (mostly unchanged) ----------------

function resetForm() {
    document.getElementById('patientForm').reset();
    setTodayDate();
    document.getElementById('hNumber').value = currentHNumber;

    // Reset Google Sheets URL for admin
    if (currentRole === 'admin') {
        const storedUrl = localStorage.getItem('phoenixGoogleSheetUrl');
        document.getElementById('googleSheetUrl').value = storedUrl || '';
    }
}

// ---------------- Page management & search/display ----------------

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    document.getElementById(pageId + 'Page').classList.add('active');

    if (pageId === 'search') {
        loadSearchPage();
    } else if (pageId === 'admin') {
        loadAdminPage();
    } else if (pageId === 'logs') {
        loadLogsPage();
    } else if (pageId === 'login') {
        document.getElementById('navbar').classList.add('hidden');
    }
}

function loadSearchPage() {
    displayEntries(entries);
}

function displayEntries(entriesToShow) {
    const tbody = document.getElementById('entriesTableBody');
    tbody.innerHTML = '';

    entriesToShow.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.hNumber}</td>
            <td>${entry.date}</td>
            <td>${entry.patientName}</td>
            <td>${entry.age}</td>
            <td>${entry.gender}</td>
            <td>${entry.hospital}</td>
            <td>${entry.doctor}</td>
            <td>${entry.test}</td>
            <td>${entry.username}</td>
            <td>
                <button class="action-btn action-btn--edit" onclick="editEntryById('${entry._id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                ${currentRole === 'admin' ? `
                    <button class="action-btn action-btn--addon" onclick="addonEntryById('${entry._id}')">
                        <i class="fas fa-plus"></i> Add-on
                    </button>
                    <button class="action-btn action-btn--delete" onclick="deleteEntryById('${entry._id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
}

// ---------------- Search helpers (unchanged) ----------------

function searchEntries() {
    const patientName = document.getElementById('searchPatientName').value.toLowerCase();
    const hNumber = document.getElementById('searchHNumber').value.toLowerCase();

    let filteredEntries = entries.filter(entry => {
        let matches = true;

        if (patientName && !entry.patientName.toLowerCase().includes(patientName)) {
            matches = false;
        }

        if (hNumber && !entry.hNumber.toLowerCase().includes(hNumber)) {
            matches = false;
        }

        if (currentRole === 'admin') {
            const hospital = document.getElementById('searchHospital').value.toLowerCase();
            const test = document.getElementById('searchTest').value.toLowerCase();
            const date = document.getElementById('searchDate').value;

            if (hospital && !entry.hospital.toLowerCase().includes(hospital)) {
                matches = false;
            }

            if (test && !entry.test.toLowerCase().includes(test)) {
                matches = false;
            }

            if (date && entry.date !== new Date(date).toLocaleDateString('en-GB')) {
                matches = false;
            }
        }

        return matches;
    });

    displayEntries(filteredEntries);
}

function clearSearch() {
    document.getElementById('searchPatientName').value = '';
    document.getElementById('searchHNumber').value = '';
    if (currentRole === 'admin') {
        document.getElementById('searchHospital').value = '';
        document.getElementById('searchTest').value = '';
        document.getElementById('searchDate').value = '';
    }
    displayEntries(entries);
}

// ---------------- Edit / Delete helpers (partial conversion) ----------------

async function editEntryById(docId) {
    editingIndex = -1;
    // open a modal or use the same form to edit — here's a simple prompt-based fallback
    const docRef = db.collection('entries').doc(docId);
    const snap = await docRef.get();
    if (!snap.exists) { alert('Entry not found'); return; }
    const data = snap.data();

    // Example simple edit flow (you can replace with a modal)
    const newPatientName = prompt('Edit patient name:', data.patientName);
    if (newPatientName === null) return;
    await docRef.update({ patientName: newPatientName });
    // refresh local list
    await loadStoredData();
    displayEntries(entries);
}

async function deleteEntryById(docId) {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    try {
        await db.collection('entries').doc(docId).delete();
        await loadStoredData();
        displayEntries(entries);
    } catch (err) {
        console.error('Error deleting entry:', err);
        alert('Failed to delete entry.');
    }
}

// Add-on placeholder (admin)
async function addonEntryById(docId) {
    addonIndex = docId;
    // Implement add-on logic if needed. For now just an alert.
    alert('Add-on clicked for doc: ' + docId);
}

// ---------------- Admin + Logs pages helpers ----------------

async function loadAdminPage() {
    await updateAdminStats();
}

async function updateAdminStats() {
    try {
        const entriesSnap = await db.collection('entries').get();
        document.getElementById('totalEntries').textContent = entriesSnap.size;
    } catch (err) {
        console.error('Error fetching entries count', err);
    }
}

function loadLoginActivity() {
    const tbody = document.getElementById('loginActivityTable');
    tbody.innerHTML = '';

    loginActivity.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.username}</td>
            <td>${item.name || ''}</td>
            <td>${item.role}</td>
            <td>${new Date(item.timestamp).toLocaleString()}</td>
            <td>${item.status}</td>
        `;
        tbody.appendChild(row);
    });

    // Update totalLogins
    document.getElementById('totalLogins').textContent = loginActivity.length;
}

// ---------------- Export & other utilities ----------------

function exportToCSV() {
    const data = entries;
    if (!data.length) { alert('No entries to export'); return; }

    const header = ['H Number','Date','Patient Name','Age','Gender','Hospital','Doctor','Test','User','Containers','Information'];
    const csvRows = [header.join(',')];

    data.forEach(row => {
        const vals = [
            `"${row.hNumber || ''}"`,
            `"${row.date || ''}"`,
            `"${(row.patientName || '').replace(/"/g, '""')}"`,
            `"${row.age || ''}"`,
            `"${row.gender || ''}"`,
            `"${(row.hospital || '').replace(/"/g, '""')}"`,
            `"${(row.doctor || '').replace(/"/g, '""')}"`,
            `"${row.test || ''}"`,
            `"${row.username || ''}"`,
            `"${row.containers || ''}"`,
            `"${(row.information || '').replace(/"/g, '""')}"`
        ];
        csvRows.push(vals.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `phoenix_entries_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function exportAllData() {
    // Export entries only for now
    exportToCSV();
}

async function clearAllLogs() {
    if (!confirm('Clear all login logs from Firestore?')) return;
    try {
        const snaps = await db.collection('loginActivity').get();
        const batch = db.batch();
        snaps.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        loginActivity = [];
        loadLoginActivity();
        alert('All logs cleared.');
    } catch (err) {
        console.error('Error clearing logs:', err);
        alert('Failed to clear logs.');
    }
}

async function resetHNumberCounter() {
    if (!confirm('Reset H-number counter to 1247?')) return;
    try {
        await db.collection('meta').doc('counters').set({ phoenixHNumberCounter: 1247 });
        await generateHNumber();
        alert('H-number counter reset.');
    } catch (err) {
        console.error('Error resetting counter:', err);
        alert('Failed to reset counter.');
    }
}

// ---------------- Logout ----------------

function logout() {
    sessionStorage.removeItem('phoenixCurrentUser');
    sessionStorage.removeItem('phoenixCurrentRole');
    sessionStorage.removeItem('phoenixCurrentName');
    currentUser = null;
    currentRole = null;
    showPage('login');
    alert('Logged out.');
}

// ---------------- Minimal edit modal placeholder to keep references working ----------------
// (Your original edit modal HTML can be re-integrated with these functions)
function editEntry(index) {
    // keep compatibility if other code calls editEntry(index)
    alert('Please use the table edit button to edit (Firestore-backed).');
}

/* end of app.js */

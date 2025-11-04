// ============================================================
// PHOENIX ONCOPATHOLOGY - ENHANCED VERSION
// ============================================================

let currentUser = null;
let currentRole = null;
let hEntries = [];
let cyEntries = [];
let gpEntries = [];
let ihcTests = [];
let allMarkers = [];
let hospitals = [];
let doctors = [];
let currentPage = 1;
let itemsPerPage = 50;
let additionalTests = [];
let selectedMarkers = [];
let pendingDeleteEntry = null;
let pendingResetCounter = null;
let googleSheetsConfig = {
    hNumberUrl: '',
    cyNumberUrl: '',
    gpNumberUrl: ''
};

const hEntriesRef = 'hEntries';
const cyEntriesRef = 'cyEntries';
const gpEntriesRef = 'gpEntries';
const ihcTestsRef = 'ihcTests';
const countersRef = 'counters';
const markersListRef = 'markersList';
const hospitalsRef = 'hospitals';
const doctorsRef = 'doctors';
const configRef = 'config';

const defaultMarkers = ['KI67', 'ER', 'PR', 'HER2NEU', 'CD20', 'CD3', 'CD10', 'CK', 'VIMENTIN', 'SMA', 'S100', 'LCA', 'BCL2', 'BCL6', 'CD30', 'MUM1', 'DESMIN', 'PAX5', 'PAX8', 'TTF1', 'NAPSIN A', 'CK7', 'CK20', 'GATA3', 'TRPS1', 'SYNAPTO', 'CHROMO', 'INSM1', 'INI', 'AMACR', 'P16', 'C-MYC', 'MLH1', 'MSH2', 'MSH6', 'PMS2', 'CD5', 'D240', 'WT1', 'CA 19.9', 'MMR', 'P53', 'H CALDESMON', 'CD117', 'DOG1', 'INHIBIN', 'CYCLIN D', 'BOB1', 'OCT 2', 'UROPLAQIN', 'CALRETININ', 'BEREP4', 'CDX2', 'ARSINACE', 'MDM2', 'HMB45', 'FNSM1', 'CALONIN', 'MALAN A', 'CD34', 'STAT6', 'ERG', 'CALPONIN', 'CK5/6', 'P63', 'CD23', 'CDK4', 'MYOD1', 'CD31', 'NKX3.1', 'MUC5AC', 'P40', 'CK19', 'CD7', 'CD1A', 'TLE1', 'CD21', 'EMA', 'CD99', 'H3K27ME3', 'cd79A', 'ALK1', 'CD4', 'CD8', 'PD1', 'GRANZYMB', 'CD56', 'SATB2', 'AR', 'KAPPA', 'LAMBDA', 'SOX 10', 'CD138', 'CD68', 'SALL4', 'NKX 2.2', 'BCOR', 'GLYPICAN 3', 'MPO', 'CD43', 'CA 125', 'SOX11', 'TDT', 'CD163', 'HEPPAR', 'PDL1', 'sf1', 'B CATERIN', 'lmp1', 'CMV'];

const defaultHospitals = ["ADDINGLIFE", "AGILUS DIAGNOSTICS", "AKSHA HOSPITALS", "ALTOR", "AMBEDKAR", "APEX HOSPITALS", "APOLLO B.G ROAD", "APOLLO HOSPITAL", "ARION RADIOTHERAPY", "AROSYA", "ASHWINI DIAGNOSTICS", "BMJH HOSPITAL", "CANVA", "CRIYA HOSPITALS", "CUREMAX", "DR R. B. PATIL HOSPITAL", "DURGA HEALTHCARE", "FATHER MULLER HOSPITAL", "GOVT MEDICAL COLLEGE", "HAMILTON BAAILEY", "HEALIUS HOSPITAL", "HIGHLAND HOSPITAL", "HOMAT 2", "HOSMAT 2", "HOSMAT 3", "HOSMAT H1", "INDIANA HOSPITAL", "ISHA DIAGNOSIS", "KANVA", "KCTRI", "KIMS AL SHIFA", "KLE", "MAITHRI HOSPITAL", "MANGALA HOSPITALS", "MEDAX", "MIO HOSPITALS", "MOTHERHOOD", "NAMMA AROGYA", "NANJAPPA LIFE CARE SHIVAMOGGA", "NEW LIFE HOSPITAL", "NORTH WEST HOSPITAL", "OYSTER", "PATHCARE", "PATHOGENIX", "PATHOGENIX LABS", "PRIMA DIAGNOSTICS", "QXL", "RADON CANCER CENTRE", "RAINBOW", "RAMAIAH MCH", "SARALAYA", "SELF", "SHANTI HOSPITAL", "SHARAVATHI HOSPITAL", "SIRI LABS", "SL. GASTRO & LIVER CLINIC", "SOLARIS", "SPARSH HOSPITAL", "SPARSHA DIAGNOSTICS", "SRI PRAAGNA", "SRI PRASHANTHI HOSPITAL", "SRINIVASA HOSPITALS", "SURGIDERMA", "SVM HOSPITAL", "UNITY HOSPITAL", "VENUS HEALTHCARE", "VIJAYSHREE HOSPITALS", "Y LABS MANGALORE"];

const defaultDoctors = ["APOORVA S", "DR AADARSH", "DR ABHIJITH SHETTY", "DR ADITHYA", "DR AJAY KUMAR", "DR ALKA C BHAT", "DR AMAR D N", "DR AMIT KIRAN", "DR ANIL KAMATH", "DR ANITA DAND", "DR ANTHONY PIAS", "DR ARAVIND", "DR ARAVIND N", "DR ASHWIN M", "DR B J PRASAD REDDY", "DR B. R. PATIL", "DR BHAVANA SHERIGAR", "DR BHUSHAN", "DR BUSHAN", "DR CHAITHRA BHAT", "DR CHANDANA PAI", "DR CHANDRA SHEKAR", "DR CHANDRAKANTH", "DR DEEPAK SAMPATH", "DR DEEPU N K", "DR DINESH", "DR DINESH KADAM", "DR DINESH SHET", "DR DON GROGERY MASCARENHAS", "DR ELDOY SALDANHA", "DR FAVAZ ALI M", "DR GAURAV SHETTY", "DR GEETHA J P", "DR GOWRI", "DR GURUCHANNA B", "DR GURUPRASAD BHAT", "DR HARI KIRAN", "DR HARI KIRAN REDDY", "DR HARISH", "DR HARISHA K", "DR HEMANTH KUMAR", "DR INDUMATHY", "DR JAGANNATH DIXIT", "DR JALAUDDIN AKBAR", "DR JAYA CHAITANYA", "DR JEFFREY LEWIS", "DR KARTHIK", "DR KIRAN KATTIMANI", "DR KIRANA PAILOOR", "DR KRITHIKA", "DR KUSHAL", "DR LENON DISOUSA", "DR LYNSEL", "DR MADHURI SUMANTH", "DR MADHUSHREE", "DR MANAS", "DR MANOJ GOWDA", "DR MERLIN", "DR MOUNA B.M", "DR MUSTAFA", "DR NAVANEETH KAMATH", "DR NAVEEN GOPAL", "DR NCP", "DR NEELIMA", "DR NIKHIL TIWARI", "DR NISHITHA SHETTY", "DR PALLAVI", "DR PAMPANAGOWDA", "DR PRAMOD", "DR PRASHANTHA B", "DR RAVEENA", "DR RAVKANTH", "DR ROHAN CHANDRA GATTI", "DR ROHIT PINTO", "DR ROOPESH", "DR SAHITHYA DESIREDDY", "DR SAMSKRITI", "DR SANDHYA RAVI", "DR SANGEETHA K", "DR SANJEEV KULGOD", "DR SANJITH MANDAL", "DR SANTHOSH", "DR SHASHIDHAR", "DR SHEELA", "DR SHIVA PRASAD G", "DR SHIVASHANKAR BHAT", "DR SHOBITHA RAO", "DR SHRAVAN R", "DR SHREYAS N M", "DR SHYAMALA REDDY", "DR SIDDARTH S", "DR SMITHA RAO", "DR SOWDIN REDDY", "DR SRIHARI", "DR SUDHAKAR", "DR SUJATHA", "DR SUMAN KUMAR", "DR SUMANTH BHOOPAL", "DR SUNIL KUMAR", "DR SURESH RAO", "DR SURYA SEN", "DR SWASTHIK", "DR SYAMALA SRIDEVI", "DR T.S RAO", "DR VAMSEEDHAR", "DR VENKATACHALA", "DR VENKATARAMANA", "DR VIDYA V BHAT", "DR VIJAY AGARWAL", "DR VIJAY KUMAR", "DR VIJITH SHETTY", "DR VIKRAM MAIYA", "DR VISHWANATH", "DR YAMINI", "Dr NAVANEETH KAMATH", "Dr RANGANATH", "Dr SHIVA KUMAR", "Dr.ASHWIN", "Dr.KRISHNA PRASAD", "Dr.MEENAKSHI JAIN", "Dr.SAMSKRTHY P MURTHY", "K MADHAVA RAO", "KALPANA SRIDHAR", "KIRAN KUMAR", "LINGARAJU BABU", "MANGESH KAMATH", "NARAYANA", "NITHIN", "Ninan Thomas", "S S RAJU", "SAMEENA", "SELF", "Y SANATH HEGDE"];

const credentials = {
    "ANISH": { password: "HARHARMAHADEV", role: "admin" },
    "SHARAN": { password: "8892970383", role: "user" },
    "MANU": { password: "9947502699", role: "admin" },
    "SUDHAKAR": { password: "8309205985", role: "user" },
    "ADAM": { password: "8073507830", role: "user" },
    "APARNA": { password: "7483912387", role: "user" }
};

// ---------- Google Sheets Integration ----------

async function sendToGoogleSheets(data, sheetType) {
    const url = googleSheetsConfig[sheetType + 'Url'];
    if (!url) {
        console.log('No Google Sheets URL configured for', sheetType);
        return;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        console.log('Data sent to Google Sheets:', sheetType);
    } catch (error) {
        console.error('Error sending to Google Sheets:', error);
    }
}

async function loadGoogleSheetsConfig() {
    try {
        if (typeof db !== 'undefined' && db.collection) {
            const configSnap = await db.collection(configRef).doc('googleSheets').get();
            if (configSnap.exists) {
                googleSheetsConfig = configSnap.data();
            }
        }
    } catch (err) {
        console.error('Error loading Google Sheets config:', err);
    }
}

async function saveGoogleSheetsConfig() {
    const hUrl = document.getElementById('hNumberSheetUrl')?.value.trim() || '';
    const cyUrl = document.getElementById('cyNumberSheetUrl')?.value.trim() || '';
    const gpUrl = document.getElementById('gpNumberSheetUrl')?.value.trim() || '';

    googleSheetsConfig = {
        hNumberUrl: hUrl,
        cyNumberUrl: cyUrl,
        gpNumberUrl: gpUrl
    };

    try {
        if (typeof db !== 'undefined' && db.collection) {
            await db.collection(configRef).doc('googleSheets').set(googleSheetsConfig);
        }
        showSuccessModal('✅ Google Sheets URLs saved successfully!');
    } catch (err) {
        console.error('Error saving Google Sheets config:', err);
        showSuccessModal('❌ Error saving configuration');
    }
}

function populateGoogleSheetsConfig() {
    const hUrlInput = document.getElementById('hNumberSheetUrl');
    const cyUrlInput = document.getElementById('cyNumberSheetUrl');
    const gpUrlInput = document.getElementById('gpNumberSheetUrl');

    if (hUrlInput) hUrlInput.value = googleSheetsConfig.hNumberUrl || '';
    if (cyUrlInput) cyUrlInput.value = googleSheetsConfig.cyNumberUrl || '';
    if (gpUrlInput) gpUrlInput.value = googleSheetsConfig.gpNumberUrl || '';
}

function copyScriptToClipboard() {
    const scriptCode = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Initialize headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      var headers = ['Date', 'Number', 'Patient Name', 'Age', 'Gender', 'Hospital', 'Doctor', 'Clinical Information', 'Containers', 'Test'];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#21808D').setFontColor('#FFFFFF');
    }
    
    // Prepare row data based on type
    var rowData = [
      data.date || '',
      data.hNumber || data.cyNumber || data.gpNumber || '',
      data.patientName || '',
      data.age || '',
      data.gender || '',
      data.hospital || '',
      data.doctor || '',
      data.information || '',
      data.containers || '',
      data.test || ''
    ];
    
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

    navigator.clipboard.writeText(scriptCode).then(() => {
        showSuccessModal('✅ Script copied to clipboard!');
    }).catch(err => {
        console.error('Error copying:', err);
        showSuccessModal('❌ Failed to copy script');
    });
}

// ---------- Initialization ----------

document.addEventListener('DOMContentLoaded', async () => {
    await initApp();
});

async function initApp() {
    checkLoginStatus();
    await loadAllData();
    await loadGoogleSheetsConfig();
}

function checkLoginStatus() {
    const user = sessionStorage.getItem('phoenixUser');
    const role = sessionStorage.getItem('phoenixRole');
    if (user && role) {
        currentUser = user;
        currentRole = role;
        setupUI();
        showPage('home');
    } else {
        showPage('login');
    }
}

// ---------- Login ----------

document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (credentials[username] && credentials[username].password === password) {
        currentUser = username;
        currentRole = credentials[username].role;
        sessionStorage.setItem('phoenixUser', currentUser);
        sessionStorage.setItem('phoenixRole', currentRole);
        setupUI();
        showPage('home');
    } else {
        showSuccessModal('❌ Invalid credentials');
    }
});

function setupUI() {
    const navbar = document.getElementById('navbar');
    if (navbar) navbar.classList.remove('hidden');
    const nameEl = document.getElementById('currentUserName');
    const roleEl = document.getElementById('currentUserRole');
    if (nameEl) nameEl.textContent = currentUser || '';
    if (roleEl) roleEl.textContent = (currentRole || '').toUpperCase();
    
    if (currentRole === 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
    }
    
    setTodayDate();
    generateHNumber();
    generateCYNumber();
    generateGPNumber();
    initializeSearchableDropdowns();
    initializeIHCMarkerDropdown();
    loadStatistics();
    populateGoogleSheetsConfig();
}

function showLogoutModal() {
    const modal = document.getElementById('logoutModal');
    if (modal) modal.classList.add('active');
}

function confirmLogout() {
    sessionStorage.clear();
    currentUser = null;
    currentRole = null;
    const navbar = document.getElementById('navbar');
    if (navbar) navbar.classList.add('hidden');
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.reset();
    closeModal('logoutModal');
    showPage('login');
}

// ---------- Data loading ----------

async function loadAllData() {
    try {
        if (typeof db === 'undefined' || !db.collection) {
            console.warn('Database (db) not detected. Skipping remote load.');
            allMarkers = defaultMarkers.slice();
            hospitals = defaultHospitals.slice();
            doctors = defaultDoctors.slice();
            return;
        }

        const hSnap = await db.collection(hEntriesRef).orderBy('timestamp', 'desc').get();
        hEntries = hSnap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        
        const cySnap = await db.collection(cyEntriesRef).orderBy('timestamp', 'desc').get();
        cyEntries = cySnap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        
        const gpSnap = await db.collection(gpEntriesRef).orderBy('timestamp', 'desc').get();
        gpEntries = gpSnap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        
        const ihcSnap = await db.collection(ihcTestsRef).orderBy('timestamp', 'desc').get();
        ihcTests = ihcSnap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        
        const markersSnap = await db.collection(markersListRef).doc('list').get();
        allMarkers = markersSnap.exists ? markersSnap.data().markers : defaultMarkers;
        if (!markersSnap.exists) await db.collection(markersListRef).doc('list').set({ markers: defaultMarkers });
        
        const hospitalsSnap = await db.collection(hospitalsRef).doc('list').get();
        hospitals = hospitalsSnap.exists ? hospitalsSnap.data().items : defaultHospitals;
        if (!hospitalsSnap.exists) await db.collection(hospitalsRef).doc('list').set({ items: defaultHospitals });
        
        const doctorsSnap = await db.collection(doctorsRef).doc('list').get();
        doctors = doctorsSnap.exists ? doctorsSnap.data().items : defaultDoctors;
        if (!doctorsSnap.exists) await db.collection(doctorsRef).doc('list').set({ items: defaultDoctors });
        
        const countersSnap = await db.collection(countersRef).doc('meta').get();
        if (!countersSnap.exists) {
            await db.collection(countersRef).doc('meta').set({ hCounter: 1282, cyCounter: 25, gpCounter: 30 });
        }
    } catch (err) {
        console.error('Error loading data:', err);
    }
}

// ---------- UI helpers ----------

function initializeSearchableDropdowns() {
    setupSearchableDropdown('hospitalInput', 'hospitalDropdown', hospitals);
    setupSearchableDropdown('doctorInput', 'doctorDropdown', doctors);
    setupSearchableDropdown('cyHospitalInput', 'cyHospitalDropdown', hospitals);
    setupSearchableDropdown('cyDoctorInput', 'cyDoctorDropdown', doctors);
    setupSearchableDropdown('gpHospitalInput', 'gpHospitalDropdown', hospitals);
    setupSearchableDropdown('gpDoctorInput', 'gpDoctorDropdown', doctors);
}

function initializeIHCMarkerDropdown() {
    const input = document.getElementById('ihcMarkerInput');
    const dropdown = document.getElementById('ihcMarkerDropdown');
    
    if (!input || !dropdown) return;
    
    function showAll() {
        dropdown.innerHTML = allMarkers.map(marker => 
            `<li onclick="selectMarkerFromDropdown('${marker.replace(/"/g, '\\"')}')">${marker}</li>`
        ).join('');
        dropdown.style.display = 'block';
    }
    
    function filter(searchText) {
        const filtered = allMarkers.filter(marker => 
            marker.toLowerCase().includes(searchText.toLowerCase())
        );
        dropdown.innerHTML = filtered.map(marker => 
            `<li onclick="selectMarkerFromDropdown('${marker.replace(/"/g, '\\"')}')">${marker}</li>`
        ).join('');
        dropdown.style.display = filtered.length > 0 ? 'block' : 'none';
    }
    
    input.addEventListener('focus', showAll);
    input.addEventListener('input', (e) => {
        if (e.target.value) {
            filter(e.target.value);
        } else {
            showAll();
        }
    });
    
    document.addEventListener('click', (e) => {
        if (e.target !== input && e.target.parentElement !== dropdown) {
            dropdown.style.display = 'none';
        }
    });
}

function selectMarkerFromDropdown(marker) {
    const el = document.getElementById('ihcMarkerInput');
    if (el) el.value = marker;
    const dd = document.getElementById('ihcMarkerDropdown');
    if (dd) dd.style.display = 'none';
}

function addMarkerToList() {
    const input = document.getElementById('ihcMarkerInput');
    const marker = (input?.value || '').trim().toUpperCase();
    
    if (!marker) {
        showSuccessModal('Please select a marker');
        return;
    }
    
    selectedMarkers.push(marker);
    updateMarkersList();
    if (input) input.value = '';
}

function updateMarkersList() {
    const container = document.getElementById('ihcAddedMarkers');
    if (!container) return;
    if (selectedMarkers.length === 0) {
        container.innerHTML = '<p style="color: var(--color-text-secondary); text-align: center; padding: 10px;">No markers added yet</p>';
        return;
    }
    
    container.innerHTML = selectedMarkers.map((marker, idx) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--color-secondary); border-radius: 6px; margin-bottom: 6px;">
            <span style="font-weight: 500;">${marker}</span>
            <button type="button" class="btn btn-danger btn-sm" onclick="removeMarkerFromList(${idx})" style="padding: 4px 8px; font-size: 11px;">Remove</button>
        </div>
    `).join('');
}

function removeMarkerFromList(idx) {
    selectedMarkers.splice(idx, 1);
    updateMarkersList();
}

function setupSearchableDropdown(inputId, dropdownId, items) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    
    if (!input || !dropdown) return;
    
    function showAll() {
        dropdown.innerHTML = items.map(item => `<li onclick="selectItem('${inputId}', '${item.replace(/"/g, '\\"')}')">${item}</li>`).join('');
        dropdown.style.display = 'block';
    }
    
    function filter(searchText) {
        const filtered = items.filter(item => item.toLowerCase().includes(searchText.toLowerCase()));
        dropdown.innerHTML = filtered.map(item => `<li onclick="selectItem('${inputId}', '${item.replace(/"/g, '\\"')}')">${item}</li>`).join('');
        dropdown.style.display = filtered.length > 0 ? 'block' : 'none';
    }
    
    input.addEventListener('focus', showAll);
    input.addEventListener('input', (e) => {
        if (e.target.value) {
            filter(e.target.value);
        } else {
            showAll();
        }
    });
    
    document.addEventListener('click', (e) => {
        if (e.target !== input && e.target.parentElement !== dropdown) {
            dropdown.style.display = 'none';
        }
    });
}

function selectItem(inputId, value) {
    const el = document.getElementById(inputId);
    if (el) el.value = value;
    const dropdownId = inputId.replace('Input', 'Dropdown');
    const dd = document.getElementById(dropdownId);
    if (dd) dd.style.display = 'none';
}

// ---------- Number generation ----------

async function generateHNumber() {
    try {
        if (typeof db === 'undefined') return;
        const snap = await db.collection(countersRef).doc('meta').get();
        let counter = snap.data()?.hCounter || 1282;
        const year = new Date().getFullYear();
        const hNum = `${counter}/${year % 100}`;
        const el = document.getElementById('hNumber');
        if (el) {
            el.value = hNum;
            el.dataset.counter = counter;
        }
    } catch (err) {
        console.error('Error generating H number:', err);
    }
}

async function generateCYNumber() {
    try {
        if (typeof db === 'undefined') return;
        const snap = await db.collection(countersRef).doc('meta').get();
        let counter = snap.data()?.cyCounter || 25;
        const year = new Date().getFullYear();
        const cyNum = `${counter.toString().padStart(4, '0')}/${year % 100}`;
        const el = document.getElementById('cyNumber');
        if (el) {
            el.value = cyNum;
            el.dataset.counter = counter;
        }
    } catch (err) {
        console.error('Error generating CY number:', err);
    }
}

async function generateGPNumber() {
    try {
        if (typeof db === 'undefined') return;
        const snap = await db.collection(countersRef).doc('meta').get();
        let counter = snap.data()?.gpCounter || 30;
        const year = new Date().getFullYear();
        const gpNum = `GP-${counter.toString().padStart(4, '0')}/${year % 100}`;
        const el = document.getElementById('gpNumber');
        if (el) {
            el.value = gpNum;
            el.dataset.counter = counter;
        }
    } catch (err) {
        console.error('Error generating GP number:', err);
    }
}

// ---------- Modals & additional tests ----------

function showAddTestModal() {
    const modal = document.getElementById('addTestModal');
    if (modal) modal.classList.add('active');
}

async function saveAdditionalTest() {
    const testTypeEl = document.getElementById('additionalTestType');
    const testType = (testTypeEl?.value || '').trim();
    if (!testType) {
        showSuccessModal('Select test');
        return;
    }
    
    additionalTests.push(testType);
    const container = document.getElementById('additionalTestsList');
    if (container) {
        container.innerHTML = additionalTests.map((test, idx) => `
            <div style="display: flex; justify-content: space-between; padding: 8px; background: white; border-radius: 4px; margin-bottom: 8px;">
                <span>${test}</span>
                <button type="button" class="btn btn-sm btn-danger" onclick="removeAdditionalTest(${idx})">Remove</button>
            </div>
        `).join('');
    }
    
    const addBlock = document.getElementById('additionalTests');
    if (addBlock) addBlock.style.display = 'block';
    closeModal('addTestModal');
    if (testTypeEl) testTypeEl.value = '';
}

function removeAdditionalTest(idx) {
    additionalTests.splice(idx, 1);
    const container = document.getElementById('additionalTestsList');
    if (additionalTests.length === 0) {
        const addBlock = document.getElementById('additionalTests');
        if (addBlock) addBlock.style.display = 'none';
        if (container) container.innerHTML = '';
    } else if (container) {
        container.innerHTML = additionalTests.map((test, i) => `
            <div style="display: flex; justify-content: space-between; padding: 8px; background: white; border-radius: 4px; margin-bottom: 8px;">
                <span>${test}</span>
                <button type="button" class="btn btn-sm btn-danger" onclick="removeAdditionalTest(${i})">Remove</button>
            </div>
        `).join('');
    }
}

let currentModalType = 'h';

function showAddHospitalModal(type = 'h') {
    currentModalType = type;
    const modal = document.getElementById('addHospitalModal');
    if (modal) modal.classList.add('active');
}

function showAddDoctorModal(type = 'h') {
    currentModalType = type;
    const modal = document.getElementById('addDoctorModal');
    if (modal) modal.classList.add('active');
}

function showAddMarkerModal() {
    const input = document.getElementById('newMarkerName');
    if (input) input.value = '';
    const modal = document.getElementById('addMarkerModal');
    if (modal) modal.classList.add('active');
}

async function saveNewHospital() {
    const input = document.getElementById('newHospitalName');
    const name = (input?.value || '').trim().toUpperCase();
    if (!name || hospitals.includes(name)) {
        showSuccessModal(name ? 'Hospital already exists' : 'Enter hospital name');
        return;
    }
    
    try {
        hospitals.push(name);
        hospitals.sort();
        if (typeof db !== 'undefined' && db.collection) {
            await db.collection(hospitalsRef).doc('list').set({ items: hospitals });
        }
        initializeSearchableDropdowns();
        if (input) input.value = '';
        closeModal('addHospitalModal');
        showSuccessModal('✅ Hospital added!');
    } catch (err) {
        console.error('Error:', err);
        showSuccessModal('❌ Error adding hospital');
    }
}

async function saveNewDoctor() {
    const input = document.getElementById('newDoctorName');
    const name = (input?.value || '').trim().toUpperCase();
    if (!name || doctors.includes(name)) {
        showSuccessModal(name ? 'Doctor already exists' : 'Enter doctor name');
        return;
    }
    
    try {
        doctors.push(name);
        doctors.sort();
        if (typeof db !== 'undefined' && db.collection) {
            await db.collection(doctorsRef).doc('list').set({ items: doctors });
        }
        initializeSearchableDropdowns();
        if (input) input.value = '';
        closeModal('addDoctorModal');
        showSuccessModal('✅ Doctor added!');
    } catch (err) {
        console.error('Error:', err);
        showSuccessModal('❌ Error adding doctor');
    }
}

async function saveNewMarker() {
    const input = document.getElementById('newMarkerName');
    const name = (input?.value || '').trim().toUpperCase();
    if (!name || allMarkers.includes(name)) {
        showSuccessModal(name ? 'Marker already exists' : 'Enter marker name');
        return;
    }
    
    try {
        allMarkers.push(name);
        allMarkers.sort();
        if (typeof db !== 'undefined' && db.collection) {
            await db.collection(markersListRef).doc('list').set({ markers: allMarkers });
        }
        initializeIHCMarkerDropdown();
        if (input) input.value = '';
        closeModal('addMarkerModal');
        showSuccessModal('✅ Marker added!');
    } catch (err) {
        console.error('Error:', err);
        showSuccessModal('❌ Error adding marker');
    }
}

// ---------- Patient / Entry forms ----------

// H (histopathology) form

document.getElementById('patientForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const hNumEl = document.getElementById('hNumber');
    const hNum = hNumEl?.value || '';
    const counter = parseInt(hNumEl?.dataset.counter || 1282);
    
    const entry = {
        hNumber: hNum, 
        date: document.getElementById('entryDate')?.value, 
        patientName: document.getElementById('patientName')?.value,
        age: document.getElementById('age')?.value, 
        gender: document.getElementById('gender')?.value,
        hospital: document.getElementById('hospitalInput')?.value, 
        doctor: document.getElementById('doctorInput')?.value,
        test: document.getElementById('testType')?.value, 
        additionalTests: additionalTests.slice(),
        information: document.getElementById('information')?.value, 
        containers: document.getElementById('containers')?.value,
        user: currentUser, 
        timestamp: new Date()
    };
    
    try {
        if (typeof db !== 'undefined' && db.collection) {
            const docRef = await db.collection(hEntriesRef).add(entry);
            entry.id = docRef.id;

            if (entry.test === 'IHC' || additionalTests.includes('IHC')) {
                await db.collection(ihcTestsRef).add({
                    hNumber: hNum, 
                    patientName: entry.patientName, 
                    age: entry.age, 
                    gender: entry.gender,
                    hospital: entry.hospital, 
                    doctor: entry.doctor, 
                    date: entry.date, 
                    parentId: docRef.id,
                    user: currentUser, 
                    markerHistory: [],
                    timestamp: new Date()
                });
                await loadAllData();
            }

            await db.collection(countersRef).doc('meta').update({ hCounter: counter + 1 });
        }

        // Send to Google Sheets (without user field)
        await sendToGoogleSheets({
            date: entry.date,
            hNumber: entry.hNumber,
            patientName: entry.patientName,
            age: entry.age,
            gender: entry.gender,
            hospital: entry.hospital,
            doctor: entry.doctor,
            information: entry.information,
            containers: entry.containers,
            test: entry.test + (entry.additionalTests.length > 0 ? ', ' + entry.additionalTests.join(', ') : '')
        }, 'hNumber');

        hEntries.unshift(entry);
        showSuccessModal(`✅ Entry Saved!\nH Number: ${hNum}\nPatient: ${entry.patientName}`);
        document.getElementById('patientForm')?.reset();
        additionalTests = [];
        const addBlock = document.getElementById('additionalTests');
        if (addBlock) addBlock.style.display = 'none';
        await generateHNumber();
        setTodayDate();
        displayHEntries();
    } catch (err) {
        console.error('Error:', err);
        showSuccessModal('❌ Error saving entry');
    }
});

// Cytology form

document.getElementById('cytologyForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const cyNumEl = document.getElementById('cyNumber');
    const cyNum = cyNumEl?.value || '';
    const counter = parseInt(cyNumEl?.dataset.counter || 25);
    
    const entry = {
        cyNumber: cyNum, 
        date: document.getElementById('cyEntryDate')?.value, 
        patientName: document.getElementById('cyPatientName')?.value,
        age: document.getElementById('cyAge')?.value, 
        gender: document.getElementById('cyGender')?.value,
        hospital: document.getElementById('cyHospitalInput')?.value, 
        doctor: document.getElementById('cyDoctorInput')?.value,
        test: 'Cytology', 
        information: document.getElementById('cyInformation')?.value,
        user: currentUser, 
        timestamp: new Date()
    };
    
    try {
        if (typeof db !== 'undefined' && db.collection) {
            const docRef = await db.collection(cyEntriesRef).add(entry);
            entry.id = docRef.id;
            await db.collection(countersRef).doc('meta').update({ cyCounter: counter + 1 });
            await loadAllData();
        }

        // Send to Google Sheets (without user field, no containers field for CY)
        await sendToGoogleSheets({
            date: entry.date,
            cyNumber: entry.cyNumber,
            patientName: entry.patientName,
            age: entry.age,
            gender: entry.gender,
            hospital: entry.hospital,
            doctor: entry.doctor,
            information: entry.information,
            containers: '',
            test: entry.test
        }, 'cyNumber');

        cyEntries.unshift(entry);
        showSuccessModal(`✅ Entry Saved!\nCY Number: ${cyNum}\nPatient: ${entry.patientName}`);
        document.getElementById('cytologyForm')?.reset();
        await generateCYNumber();
        setTodayDate();
        displayCYEntries();
    } catch (err) {
        console.error('Error:', err);
        showSuccessModal('❌ Error saving entry');
    }
});

// GP form

document.getElementById('gpForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const gpNumEl = document.getElementById('gpNumber');
    const gpNum = gpNumEl?.value || '';
    const counter = parseInt(gpNumEl?.dataset.counter || 30);
    
    const entry = {
        gpNumber: gpNum, 
        date: document.getElementById('gpEntryDate')?.value, 
        patientName: document.getElementById('gpPatientName')?.value,
        age: document.getElementById('gpAge')?.value, 
        gender: document.getElementById('gpGender')?.value,
        hospital: document.getElementById('gpHospitalInput')?.value, 
        doctor: document.getElementById('gpDoctorInput')?.value,
        test: 'PAP SMEAR', 
        information: document.getElementById('gpInformation')?.value,
        user: currentUser, 
        timestamp: new Date()
    };
    
    try {
        if (typeof db !== 'undefined' && db.collection) {
            const docRef = await db.collection(gpEntriesRef).add(entry);
            entry.id = docRef.id;
            await db.collection(countersRef).doc('meta').update({ gpCounter: counter + 1 });
            await loadAllData();
        }

        // Send to Google Sheets (without user field, no containers field for GP)
        await sendToGoogleSheets({
            date: entry.date,
            gpNumber: entry.gpNumber,
            patientName: entry.patientName,
            age: entry.age,
            gender: entry.gender,
            hospital: entry.hospital,
            doctor: entry.doctor,
            information: entry.information,
            containers: '',
            test: entry.test
        }, 'gpNumber');

        gpEntries.unshift(entry);
        showSuccessModal(`✅ Entry Saved!\nGP Number: ${gpNum}\nPatient: ${entry.patientName}`);
        document.getElementById('gpForm')?.reset();
        await generateGPNumber();
        setTodayDate();
        displayGPEntries();
    } catch (err) {
        console.error('Error:', err);
        showSuccessModal('❌ Error saving entry');
    }
});

// ---------- IHC marker handling ----------

function showAddMarkersModal(testId) {
    const test = ihcTests.find(t => t.id === testId);
    if (!test) return;
    
    selectedMarkers = [];
    const sel = document.getElementById('selectIHCTest');
    if (sel) sel.value = testId;
    const dateEl = document.getElementById('ihcMarkerDate');
    if (dateEl) dateEl.valueAsDate = new Date();
    const input = document.getElementById('ihcMarkerInput');
    if (input) input.value = '';
    updateMarkersList();
    const modal = document.getElementById('addMarkersModal');
    if (modal) modal.classList.add('active');
}

function showViewMarkersModal(testId) {
    const test = ihcTests.find(t => t.id === testId);
    if (!test) return;
    
    const patientInfo = document.getElementById('viewMarkersPatientInfo');
    if (patientInfo) {
        patientInfo.innerHTML = `
            <h4 style="margin: 0 0 10px 0; color: var(--color-primary);">Patient Information</h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 14px;">
                <div><strong>H Number:</strong> ${test.hNumber}</div>
                <div><strong>Patient Name:</strong> ${test.patientName}</div>
                <div><strong>Age:</strong> ${test.age}</div>
                <div><strong>Gender:</strong> ${test.gender}</div>
                <div><strong>Hospital:</strong> ${test.hospital}</div>
                <div><strong>Doctor:</strong> ${test.doctor}</div>
            </div>
        `;
    }
    
    const content = document.getElementById('viewMarkersContent');
    if (content) {
        if (!test.markerHistory || test.markerHistory.length === 0) {
            content.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); padding: 20px;">No markers added yet</p>';
        } else {
            content.innerHTML = test.markerHistory.map((history, idx) => `
                <div style="margin-bottom: 20px; padding: 15px; background: rgba(33, 128, 141, 0.05); border-radius: 8px; border-left: 4px solid var(--color-primary);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <h4 style="margin: 0; color: var(--color-primary);">Entry #${idx + 1} - ${history.date}</h4>
                        <span style="font-size: 12px; color: var(--color-text-secondary);">Added by: ${history.user || 'N/A'}</span>
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${history.markers.map(marker => `
                            <span style="padding: 6px 12px; background: var(--color-primary); color: white; border-radius: 6px; font-size: 13px; font-weight: 600;">${marker}</span>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }
    }
    
    const modal = document.getElementById('viewMarkersModal');
    if (modal) modal.classList.add('active');
}

function showAddTestToPatientModal(entryId) {
    const el = document.getElementById('patientEntryId');
    if (el) el.value = entryId;
    const modal = document.getElementById('addTestToPatientModal');
    if (modal) modal.classList.add('active');
}

async function saveTestToPatient() {
    const entryId = document.getElementById('patientEntryId')?.value;
    const testType = document.getElementById('additionalTestTypeForPatient')?.value;
    
    if (!testType) {
        showSuccessModal('Please select a test type');
        return;
    }
    
    try {
        const entryIndex = hEntries.findIndex(e => e.id === entryId);
        if (entryIndex === -1) return;
        
        const entry = hEntries[entryIndex];
        if (!entry.additionalTests) entry.additionalTests = [];
        entry.additionalTests.push(testType);
        
        if (typeof db !== 'undefined' && db.collection) {
            await db.collection(hEntriesRef).doc(entryId).update({
                additionalTests: entry.additionalTests
            });
        }
        
        if (testType === 'IHC') {
            if (typeof db !== 'undefined' && db.collection) {
                await db.collection(ihcTestsRef).add({
                    hNumber: entry.hNumber,
                    patientName: entry.patientName,
                    age: entry.age,
                    gender: entry.gender,
                    hospital: entry.hospital,
                    doctor: entry.doctor,
                    date: entry.date,
                    parentId: entryId,
                    user: currentUser,
                    markerHistory: [],
                    timestamp: new Date()
                });
                await loadAllData();
            }
        }
        
        hEntries[entryIndex] = entry;
        displayHEntries();
        closeModal('addTestToPatientModal');
        showSuccessModal('✅ Test added successfully!');
    } catch (err) {
        console.error('Error:', err);
        showSuccessModal('❌ Error adding test');
    }
}

async function saveMarkers() {
    const testId = document.getElementById('selectIHCTest')?.value;
    const date = document.getElementById('ihcMarkerDate')?.value;
    
    if (!testId || !date || selectedMarkers.length === 0) {
        showSuccessModal('Please select test, date, and add at least one marker');
        return;
    }
    
    try {
        const testIndex = ihcTests.findIndex(t => t.id === testId);
        if (testIndex !== -1) {
            const test = ihcTests[testIndex];
            
            // Initialize markerHistory if it doesn't exist
            if (!test.markerHistory) {
                test.markerHistory = [];
            }
            
            // Add new marker entry to history
            test.markerHistory.push({
                date: date,
                markers: selectedMarkers.slice(),
                user: currentUser,
                timestamp: new Date()
            });
            
            ihcTests[testIndex] = test;
            
            if (typeof db !== 'undefined' && db.collection) {
                await db.collection(ihcTestsRef).doc(testId).update({ 
                    markerHistory: test.markerHistory
                });
                await loadAllData();
            }
            
            showSuccessModal('✅ Markers saved successfully!');
            closeModal('addMarkersModal');
            selectedMarkers = [];
            displayIHCEntries();
        }
    } catch (err) {
        console.error('Error:', err);
        showSuccessModal('❌ Error saving markers');
    }
}

// ---------- Display / filtering / pagination ----------

function filterAndDisplayEntries(entries, searchText, numberField) {
    let filtered = entries;
    if (searchText) {
        filtered = entries.filter(e => {
            const searchLower = searchText.toLowerCase();
            return (e[numberField]?.toLowerCase().includes(searchLower) ||
                    e.patientName?.toLowerCase().includes(searchLower) ||
                    e.hospital?.toLowerCase().includes(searchLower) ||
                    e.doctor?.toLowerCase().includes(searchLower));
        });
    }
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return { filtered, paged: filtered.slice(start, end) };
}

function displayHEntries() {
    const searchText = document.getElementById('searchH')?.value || '';
    const { filtered, paged } = filterAndDisplayEntries(hEntries, searchText, 'hNumber');
    const tbody = document.getElementById('entriesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = paged.map(entry => `
        <tr>
            <td><strong>${entry.hNumber}</strong></td>
            <td>${entry.date || ''}</td>
            <td>${entry.patientName || ''}</td>
            <td>${entry.age || ''}</td>
            <td>${entry.gender || ''}</td>
            <td>${entry.hospital || ''}</td>
            <td>${entry.doctor || ''}</td>
            <td>${entry.test || ''}${entry.additionalTests && entry.additionalTests.length > 0 ? ', ' + entry.additionalTests.join(', ') : ''}</td>
            <td>${entry.user || ''}</td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-sm btn-primary" onclick="showAddTestToPatientModal('${entry.id}')">Add Test</button>
                    <button class="btn btn-sm btn-danger" onclick="showDeleteEntryModal('h', '${entry.id}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
    displayPagination('paginationH', filtered.length, () => displayHEntries());
}

function displayCYEntries() {
    const searchText = document.getElementById('searchCY')?.value || '';
    const { filtered, paged } = filterAndDisplayEntries(cyEntries, searchText, 'cyNumber');
    const tbody = document.getElementById('cytologyTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = paged.map(entry => `
        <tr>
            <td><strong>${entry.cyNumber}</strong></td>
            <td>${entry.date || ''}</td>
            <td>${entry.patientName || ''}</td>
            <td>${entry.age || ''}</td>
            <td>${entry.gender || ''}</td>
            <td>${entry.hospital || ''}</td>
            <td>${entry.doctor || ''}</td>
            <td>${entry.user || ''}</td>
            <td><button class="btn btn-sm btn-danger" onclick="showDeleteEntryModal('cy', '${entry.id}')">Delete</button></td>
        </tr>
    `).join('');
    displayPagination('paginationCY', filtered.length, () => displayCYEntries());
}

function displayGPEntries() {
    const searchText = document.getElementById('searchGP')?.value || '';
    const { filtered, paged } = filterAndDisplayEntries(gpEntries, searchText, 'gpNumber');
    const tbody = document.getElementById('gpTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = paged.map(entry => `
        <tr>
            <td><strong>${entry.gpNumber}</strong></td>
            <td>${entry.date || ''}</td>
            <td>${entry.patientName || ''}</td>
            <td>${entry.age || ''}</td>
            <td>${entry.gender || ''}</td>
            <td>${entry.hospital || ''}</td>
            <td>${entry.doctor || ''}</td>
            <td>${entry.user || ''}</td>
            <td><button class="btn btn-sm btn-danger" onclick="showDeleteEntryModal('gp', '${entry.id}')">Delete</button></td>
        </tr>
    `).join('');
    displayPagination('paginationGP', filtered.length, () => displayGPEntries());
}

function displayIHCEntries() {
    const searchText = (document.getElementById('searchIHC')?.value || '').toLowerCase();
    
    // Filter IHC entries by H Number, Patient Name, or Marker
    let filtered = ihcTests;
    if (searchText) {
        filtered = ihcTests.filter(entry => {
            // Search by H Number or Patient Name
            const basicMatch = entry.hNumber?.toLowerCase().includes(searchText) ||
                               entry.patientName?.toLowerCase().includes(searchText);
            
            // Search by markers in markerHistory
            const markerMatch = entry.markerHistory?.some(history => 
                history.markers?.some(marker => 
                    marker.toLowerCase().includes(searchText)
                )
            );
            
            return basicMatch || markerMatch;
        });
    }
    
    const start = (currentPage - 1) * itemsPerPage;
    const paged = filtered.slice(start, start + itemsPerPage);
    const tbody = document.getElementById('ihcTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = paged.map(entry => {
        // Get all unique markers from history
        const allMarkers = [];
        if (entry.markerHistory) {
            entry.markerHistory.forEach(history => {
                if (history.markers) {
                    allMarkers.push(...history.markers);
                }
            });
        }
        const uniqueMarkers = [...new Set(allMarkers)];
        
        return `
        <tr>
            <td><strong>${entry.hNumber}</strong></td>
            <td>${entry.patientName || ''}</td>
            <td>${entry.age || ''}</td>
            <td>${entry.gender || ''}</td>
            <td>${entry.hospital || ''}</td>
            <td>${entry.doctor || ''}</td>
            <td>${entry.date || ''}</td>
            <td>${entry.user || ''}</td>
            <td>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <button class="btn btn-sm btn-primary" onclick="showAddMarkersModal('${entry.id}')">Add Markers</button>
                    <button class="btn btn-sm btn-secondary" onclick="showViewMarkersModal('${entry.id}')">View Markers</button>
                    <button class="btn btn-sm btn-danger" onclick="showDeleteEntryModal('ihc', '${entry.id}')">Delete</button>
                </div>
                ${uniqueMarkers.length > 0 ? `
                    <div style="margin-top: 8px; padding: 8px; background: var(--color-secondary); border-radius: 4px; font-size: 12px;">
                        <strong>All Markers:</strong> ${uniqueMarkers.join(', ')}
                    </div>
                ` : ''}
            </td>
        </tr>
    `;
    }).join('');
    displayPagination('paginationIHC', filtered.length, () => displayIHCEntries());
}

function displayPagination(elementId, total, callback) {
    const totalPages = Math.ceil(total / itemsPerPage);
    const pagination = document.getElementById(elementId);
    if (!pagination) return;
    
    pagination.innerHTML = '';
    if (totalPages === 0) {
        pagination.innerHTML = '<p style="text-align: center; color: #999;">No data</p>';
        return;
    }
    
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = i === currentPage ? 'active' : '';
        btn.addEventListener('click', () => { currentPage = i; callback(); });
        pagination.appendChild(btn);
    }
}

// ---------- CSV export ----------

function downloadCSV(type) {
    let data = [];
    let filename = '';
    let headers = [];
    
    if (type === 'h') {
        data = hEntries;
        filename = 'H_Entries.csv';
        headers = ['Date', 'H Number', 'Patient Name', 'Age', 'Gender', 'Hospital', 'Doctor', 'Clinical Information', 'Containers', 'Test'];
        
        const csvRows = data.map(row => [
            row.date || '',
            row.hNumber || '',
            row.patientName || '',
            row.age || '',
            row.gender || '',
            row.hospital || '',
            row.doctor || '',
            `"${(row.information || '').replace(/"/g, '""')}"`,
            row.containers || '',
            row.test + (row.additionalTests && row.additionalTests.length > 0 ? ', ' + row.additionalTests.join(', ') : '')
        ].join(','));
        
        const csv = [headers.join(','), ...csvRows].join('\n');
        downloadFile(csv, filename);
    } else if (type === 'cy') {
        data = cyEntries;
        filename = 'CY_Entries.csv';
        headers = ['Date', 'CY Number', 'Patient Name', 'Age', 'Gender', 'Hospital', 'Doctor', 'Clinical Information', 'Test'];
        
        const csvRows = data.map(row => [
            row.date || '',
            row.cyNumber || '',
            row.patientName || '',
            row.age || '',
            row.gender || '',
            row.hospital || '',
            row.doctor || '',
            `"${(row.information || '').replace(/"/g, '""')}"`,
            row.test || ''
        ].join(','));
        
        const csv = [headers.join(','), ...csvRows].join('\n');
        downloadFile(csv, filename);
    } else if (type === 'gp') {
        data = gpEntries;
        filename = 'GP_Entries.csv';
        headers = ['Date', 'GP Number', 'Patient Name', 'Age', 'Gender', 'Hospital', 'Doctor', 'Clinical Information', 'Test'];
        
        const csvRows = data.map(row => [
            row.date || '',
            row.gpNumber || '',
            row.patientName || '',
            row.age || '',
            row.gender || '',
            row.hospital || '',
            row.doctor || '',
            `"${(row.information || '').replace(/"/g, '""')}"`,
            row.test || ''
        ].join(','));
        
        const csv = [headers.join(','), ...csvRows].join('\n');
        downloadFile(csv, filename);
    }
}

function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// ---------- Counters / reset ----------

function showResetCounterModal(type) {
    pendingResetCounter = type;
    const modal = document.getElementById('resetCounterModal');
    if (modal) modal.classList.add('active');
}

async function confirmResetCounter() {
    const type = pendingResetCounter;
    if (!type) return;
    
    let fieldId = '', fieldName = '';
    if (type === 'hNumber') { fieldId = 'resetHValue'; fieldName = 'hCounter'; }
    else if (type === 'cyNumber') { fieldId = 'resetCYValue'; fieldName = 'cyCounter'; }
    else if (type === 'gpNumber') { fieldId = 'resetGPValue'; fieldName = 'gpCounter'; }
    
    const value = parseInt(document.getElementById(fieldId)?.value);
    if (isNaN(value) || value < 0) { 
        closeModal('resetCounterModal');
        showSuccessModal('Invalid value'); 
        return; 
    }
    
    try {
        const update = {}; 
        update[fieldName] = value;
        if (typeof db !== 'undefined' && db.collection) {
            await db.collection(countersRef).doc('meta').update(update);
        }
        closeModal('resetCounterModal');
        showSuccessModal('✅ Counter reset successfully');
        const field = document.getElementById(fieldId);
        if (field) field.value = '';
        if (type === 'hNumber') await generateHNumber();
        else if (type === 'cyNumber') await generateCYNumber();
        else if (type === 'gpNumber') await generateGPNumber();
    } catch (err) { 
        console.error('Error:', err); 
        closeModal('resetCounterModal');
        showSuccessModal('❌ Error resetting counter');
    }
    
    pendingResetCounter = null;
}

// ---------- Statistics ----------

async function loadStatistics() {
    if (currentRole !== 'admin') return;
    const tH = document.getElementById('totalHEntries');
    const tC = document.getElementById('totalCYEntries');
    const tG = document.getElementById('totalGPEntries');
    const tI = document.getElementById('totalIHCEntries');
    if (tH) tH.textContent = hEntries.length;
    if (tC) tC.textContent = cyEntries.length;
    if (tG) tG.textContent = gpEntries.length;
    if (tI) tI.textContent = ihcTests.length;
}

function applyStatsFilter() {
    const fromDate = document.getElementById('statsFromDate')?.value;
    const toDate = document.getElementById('statsToDate')?.value;
    
    let filtered = { h: hEntries.slice(), cy: cyEntries.slice(), gp: gpEntries.slice(), ihc: ihcTests.slice() };
    
    if (fromDate) {
        filtered.h = filtered.h.filter(e => e.date >= fromDate);
        filtered.cy = filtered.cy.filter(e => e.date >= fromDate);
        filtered.gp = filtered.gp.filter(e => e.date >= fromDate);
        filtered.ihc = filtered.ihc.filter(e => e.date >= fromDate);
    }
    
    if (toDate) {
        filtered.h = filtered.h.filter(e => e.date <= toDate);
        filtered.cy = filtered.cy.filter(e => e.date <= toDate);
        filtered.gp = filtered.gp.filter(e => e.date <= toDate);
        filtered.ihc = filtered.ihc.filter(e => e.date <= toDate);
    }
    
    const hStats = {};
    filtered.h.forEach(e => { 
        hStats[e.test] = (hStats[e.test] || 0) + 1;
        if (e.additionalTests) {
            e.additionalTests.forEach(test => {
                hStats[test] = (hStats[test] || 0) + 1;
            });
        }
    });
    const statsHBody = document.getElementById('statsHBody');
    if (statsHBody) statsHBody.innerHTML = Object.entries(hStats)
        .map(([test, count]) => `<tr><td><strong>${test}</strong></td><td>${count}</td></tr>`)
        .join('') || '<tr><td colspan="2">No data</td></tr>';
    
    const statsCYBody = document.getElementById('statsCYBody');
    if (statsCYBody) statsCYBody.innerHTML = `<tr><td>${filtered.cy.length}</td></tr>`;
    
    const statsGPBody = document.getElementById('statsGPBody');
    if (statsGPBody) statsGPBody.innerHTML = `<tr><td>${filtered.gp.length}</td></tr>`;
    
    // Collect ALL markers from ALL dates in markerHistory
    const markerStats = {};
    filtered.ihc.forEach(e => {
        if (e.markerHistory && Array.isArray(e.markerHistory)) {
            e.markerHistory.forEach(history => {
                if (history.markers && Array.isArray(history.markers)) {
                    history.markers.forEach(marker => {
                        markerStats[marker] = (markerStats[marker] || 0) + 1;
                    });
                }
            });
        }
    });
    
    const statsIHCBody = document.getElementById('statsIHCBody');
    if (statsIHCBody) statsIHCBody.innerHTML = Object.entries(markerStats)
        .sort((a, b) => b[1] - a[1])
        .map(([marker, count]) => `<tr><td><strong>${marker}</strong></td><td>${count}</td></tr>`)
        .join('') || '<tr><td colspan="2">No markers data</td></tr>';
}

// ---------- Page navigation ----------

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(pageId + 'Page');
    if (page) page.classList.add('active');
    
    currentPage = 1;
    
    if (pageId === 'search') {
        const searchInput = document.getElementById('searchH');
        if (searchInput) {
            searchInput.removeEventListener('input', displayHEntries);
            searchInput.addEventListener('input', displayHEntries);
        }
        displayHEntries();
    } else if (pageId === 'cytologyPatients') {
        const searchInput = document.getElementById('searchCY');
        if (searchInput) {
            searchInput.removeEventListener('input', displayCYEntries);
            searchInput.addEventListener('input', displayCYEntries);
        }
        displayCYEntries();
    } else if (pageId === 'gpPatients') {
        const searchInput = document.getElementById('searchGP');
        if (searchInput) {
            searchInput.removeEventListener('input', displayGPEntries);
            searchInput.addEventListener('input', displayGPEntries);
        }
        displayGPEntries();
    } else if (pageId === 'ihc') {
        const searchInput = document.getElementById('searchIHC');
        if (searchInput) {
            searchInput.removeEventListener('input', displayIHCEntries);
            searchInput.addEventListener('input', displayIHCEntries);
        }
        displayIHCEntries();
    } else if (pageId === 'statistics') {
        applyStatsFilter();
    } else if (pageId === 'admin') {
        populateGoogleSheetsConfig();
    }
}

// ---------- Small utilities ----------

function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    if (document.getElementById('entryDate')) document.getElementById('entryDate').value = today;
    if (document.getElementById('cyEntryDate')) document.getElementById('cyEntryDate').value = today;
    if (document.getElementById('gpEntryDate')) document.getElementById('gpEntryDate').value = today;
}

function resetForm() {
    document.getElementById('patientForm')?.reset();
    additionalTests = [];
    const addBlock = document.getElementById('additionalTests');
    if (addBlock) addBlock.style.display = 'none';
    setTodayDate();
    generateHNumber();
}

function resetCytologyForm() {
    document.getElementById('cytologyForm')?.reset();
    setTodayDate();
    generateCYNumber();
}

function resetGPForm() {
    document.getElementById('gpForm')?.reset();
    setTodayDate();
    generateGPNumber();
}

// ---------- Deletions ----------

function showDeleteEntryModal(type, id) {
    pendingDeleteEntry = { type, id };
    const modal = document.getElementById('deleteEntryModal');
    if (modal) modal.classList.add('active');
}

async function confirmDeleteEntry() {
    if (!pendingDeleteEntry) return;
    
    const { type, id } = pendingDeleteEntry;
    
    try {
        if (typeof db !== 'undefined' && db.collection) {
            if (type === 'h') {
                await db.collection(hEntriesRef).doc(id).delete();
            } else if (type === 'cy') {
                await db.collection(cyEntriesRef).doc(id).delete();
            } else if (type === 'gp') {
                await db.collection(gpEntriesRef).doc(id).delete();
            } else if (type === 'ihc') {
                await db.collection(ihcTestsRef).doc(id).delete();
            }
            await loadAllData();
        }

        if (type === 'h') hEntries = hEntries.filter(e => e.id !== id);
        else if (type === 'cy') cyEntries = cyEntries.filter(e => e.id !== id);
        else if (type === 'gp') gpEntries = gpEntries.filter(e => e.id !== id);
        else if (type === 'ihc') ihcTests = ihcTests.filter(e => e.id !== id);

        displayHEntries();
        displayCYEntries();
        displayGPEntries();
        displayIHCEntries();
        
        closeModal('deleteEntryModal');
        showSuccessModal('✅ Entry deleted successfully');
    } catch (err) { 
        console.error('Error:', err); 
        closeModal('deleteEntryModal');
        showSuccessModal('❌ Error deleting entry');
    }
    
    pendingDeleteEntry = null;
}

// ---------- Modals ----------

function showSuccessModal(message) {
    const modal = document.getElementById('successModal');
    const msgDiv = document.getElementById('successMessage');
    if (modal && msgDiv) { 
        msgDiv.textContent = message; 
        modal.classList.add('active'); 
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
    
    if (modalId === 'addMarkersModal') {
        selectedMarkers = [];
        const input = document.getElementById('ihcMarkerInput');
        if (input) input.value = '';
    }
    
    if (modalId === 'deleteEntryModal') {
        pendingDeleteEntry = null;
    }
    
    if (modalId === 'resetCounterModal') {
        pendingResetCounter = null;
    }
}

// End of file

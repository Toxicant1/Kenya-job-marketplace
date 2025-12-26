// 1. DATA BRAIN
const jobData = [
    { 
        id: 1, 
        category: "Writing",
        title: "Blogging: Tech in Nairobi", 
        company: "KenyaTech", 
        location: "Remote", 
        salary: 1200, 
        instructions: "1. Write 500 words on AI in Kenya.\n2. Submit the Google Doc link.",
        desc: "Creative writing for our tech blog." 
    },
    { 
        id: 2, 
        category: "Transcription",
        title: "Zuku Call Transcription", 
        company: "Zuku", 
        location: "Remote", 
        salary: 350, 
        instructions: "1. Transcribe the 5-minute audio accurately.\n2. Submit the text document link.",
        desc: "Convert audio support calls to text." 
    },
    { 
        id: 3, 
        category: "Passive",
        title: "Honeygain Data Sharing", 
        company: "PassiveEarn", 
        location: "Global", 
        salary: 200, 
        instructions: "1. Run the Honeygain app for 24 hours.\n2. Submit a screenshot link of your earnings.",
        desc: "Earn by sharing unused internet." 
    }
];

// 2. STATE (Memory)
let balance = localStorage.getItem('kaziBalance') ? parseFloat(localStorage.getItem('kaziBalance')) : 0;
let tasksCompleted = localStorage.getItem('kaziTasks') ? parseInt(localStorage.getItem('kaziTasks')) : 0;
let transactions = localStorage.getItem('kaziHistory') ? JSON.parse(localStorage.getItem('kaziHistory')) : [];

// 3. RENDER JOBS
function renderJobs(list) {
    const container = document.getElementById('jobContainer');
    if(!container) return;
    
    container.innerHTML = list.map(job => `
        <div class="job-card">
            <span style="background: #e0e7ff; color: #4338ca; padding: 4px 10px; border-radius: 5px; font-size: 0.7rem; font-weight: bold;">${job.category}</span>
            <h3 style="margin-top: 10px;">${job.title}</h3>
            <p>${job.company} • ${job.location}</p>
            <p style="color:var(--primary); font-weight:700; margin-top:5px;">Earn KES ${job.salary}</p>
            <button class="btn-primary" style="margin-top: 10px; width: 100%;" onclick="viewJob(${job.id})">View Instructions</button>
        </div>
    `).join('');
}

// 4. FILTERING LOGIC
function filterJobs(category) {
    if (category === 'All') {
        renderJobs(jobData);
    } else {
        const filtered = jobData.filter(j => j.category === category);
        renderJobs(filtered);
    }
}

// 5. VIEW INSTRUCTIONS & SUBMIT
function viewJob(id) {
    const job = jobData.find(j => j.id === id);
    const modal = document.getElementById('uiModal');
    
    document.getElementById('modalContent').innerHTML = `
        <span class="close-btn" onclick="closeModal()">&times;</span>
        <h2 style="color: var(--primary);">${job.title}</h2>
        <div style="background: #f8fafc; padding: 15px; border-radius: 12px; margin: 15px 0; border: 1px solid #e2e8f0;">
            <h4 style="margin-bottom: 8px;"><i class="fas fa-tasks"></i> Instructions:</h4>
            <p style="white-space: pre-line; color: #475569;">${job.instructions}</p>
        </div>
        <div style="margin-top: 20px;">
            <label style="font-weight: bold;">Paste Proof (Link):</label>
            <input type="text" id="workLink" placeholder="https://drive.google.com/..." 
                   style="width:100%; padding:12px; margin:10px 0; border:2px solid #cbd5e1; border-radius:10px;">
            <button class="btn-primary" style="width:100%; padding: 15px;" 
                    onclick="submitWithProof(${job.salary}, '${job.title}')">Submit Work</button>
        </div>
    `;
    modal.style.display = 'flex';
}

function submitWithProof(amount, title) {
    const proof = document.getElementById('workLink').value;
    if(!proof) { alert("Please provide proof of work!"); return; }
    
    balance += amount;
    tasksCompleted += 1;
    transactions.unshift({ 
        id: Date.now(), 
        type: `Task: ${title}`, 
        amount: amount, 
        date: new Date().toLocaleDateString() 
    });

    localStorage.setItem('kaziBalance', balance);
    localStorage.setItem('kaziTasks', tasksCompleted);
    localStorage.setItem('kaziHistory', JSON.stringify(transactions));

    updateDashboardUI();
    alert(`Success! KES ${amount} added.`);
    closeModal();
}

// 6. UI UPDATES
function updateDashboardUI() {
    document.getElementById('balance-display').innerText = `KES ${balance.toLocaleString()}`;
    document.getElementById('task-count').innerText = tasksCompleted;
    renderTransactions();
}

function renderTransactions() {
    const list = document.getElementById('transaction-list');
    if (!list || transactions.length === 0) return;
    list.innerHTML = transactions.map(t => `
        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
            <span>${t.type}</span>
            <span style="color: var(--success); font-weight: bold;">+ KES ${t.amount}</span>
        </div>
    `).join('');
}

function linkWallet() {
    const phone = prompt("Enter M-Pesa Number:");
    if(phone) {
        localStorage.setItem('kaziPhone', phone);
        document.getElementById('phone-display').innerText = phone;
    }
}

// 7. NAVIGATION
function openAuth() {
    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('dashboard-view').classList.remove('hidden');
    updateDashboardUI();
    const savedPhone = localStorage.getItem('kaziPhone');
    if(savedPhone) document.getElementById('phone-display').innerText = savedPhone;
}

function showHome() { location.reload(); }
function closeModal() { document.getElementById('uiModal').style.display = 'none'; }
function toggleDark() { document.body.classList.toggle('dark'); }

// Initial Run
renderJobs(jobData);

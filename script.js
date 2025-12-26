// 1. DATA WITH CATEGORIES
const jobData = [
    { 
        id: 1, 
        category: "Writing",
        title: "Blogging: Future of Tech", 
        company: "KenyaTech", 
        location: "Remote", 
        salary: 1200, 
        instructions: "1. Write a 500-word blog post about AI in Nairobi.\n2. Submit the Google Doc link below.",
        desc: "Write engaging tech content for our blog." 
    },
    { 
        id: 2, 
        category: "Transcription",
        title: "Audio Transcription", 
        company: "Zuku Support", 
        location: "Remote", 
        salary: 350, 
        instructions: "1. Listen to the provided audio file.\n2. Type out the conversation accurately.\n3. Paste link to the text file.",
        desc: "Convert customer support audio to text." 
    },
    { 
        id: 3, 
        category: "Passive",
        title: "Honeygain Passive Income", 
        company: "PassiveEarn", 
        location: "Global", 
        salary: 200, 
        instructions: "1. Share your unused internet bandwidth.\n2. Upload a screenshot link showing 24hrs of activity.",
        desc: "Earn while you sleep by sharing internet." 
    }
];

// 2. STATE (Memory)
let balance = localStorage.getItem('kaziBalance') ? parseFloat(localStorage.getItem('kaziBalance')) : 0;
let tasksCompleted = localStorage.getItem('kaziTasks') ? parseInt(localStorage.getItem('kaziTasks')) : 0;
let transactions = localStorage.getItem('kaziHistory') ? JSON.parse(localStorage.getItem('kaziHistory')) : [];

// 3. CORE FUNCTIONS
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

function filterJobs(category) {
    if (category === 'All') {
        renderJobs(jobData);
    } else {
        const filtered = jobData.filter(j => j.category === category);
        renderJobs(filtered);
    }
}

function viewJob(id) {
    const job = jobData.find(j => j.id === id);
    const modal = document.getElementById('uiModal');
    document.getElementById('modalContent').innerHTML = `
        <span class="close-btn" onclick="closeModal()">&times;</span>
        <h2 style="color: var(--primary);">${job.title}</h2>
        <div style="background: #f0f7ff; padding: 15px; border-radius: 10px; margin: 15px 0;">
            <h4><i class="fas fa-book"></i> Instructions:</h4>
            <p style="white-space: pre-line; margin-top: 10px;">${job.instructions}</p>
        </div>
        <label>Paste Proof (Link):</label>
        <input type="text" id="workLink" placeholder="https://..." style="width:100%; padding:12px; margin:10px 0; border:1px solid #ddd; border-radius:8px;">
        <button class="btn-primary" style="width:100%" onclick="submitWithProof(${job.salary}, '${job.title}')">Submit Work</button>
    `;
    modal.style.display = 'flex';
}

function submitWithProof(amount, title) {
    const proof = document.getElementById('workLink').value;
    if(!proof) { alert("Please provide proof of work!"); return; }
    
    balance += amount;
    tasksCompleted += 1;
    transactions.unshift({ id: Date.now(), type: `Task: ${title}`, amount: amount, date: new Date().toLocaleDateString() });

    localStorage.setItem('kaziBalance', balance);
    localStorage.setItem('kaziTasks', tasksCompleted);
    localStorage.setItem('kaziHistory', JSON.stringify(transactions));

    updateDashboardUI();
    alert("Success! Money added to dashboard.");
    closeModal();
}

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
    const phone = prompt("Enter M-Pesa number:");
    if(phone) {
        localStorage.setItem('kaziPhone', phone);
        document.getElementById('phone-display').innerText = phone;
    }
}

// 4. NAVIGATION
function openAuth() {
    goToDashboard(); // Simple bypass for now
}

function goToDashboard() {
    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('dashboard-view').classList.remove('hidden');
    updateDashboardUI();
    const savedPhone = localStorage.getItem('kaziPhone');
    if(savedPhone) document.getElementById('phone-display').innerText = savedPhone;
}

function showHome() { location.reload(); }
function closeModal() { document.getElementById('uiModal').style.display = 'none'; }
function toggleDark() { document.body.classList.toggle('dark'); }

// Run on load
renderJobs(jobData);

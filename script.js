// 1. DATA & INITIAL STATE
const jobData = [
    { id: 1, title: "Graphic Designer", company: "Canvas Co", location: "Nairobi", salary: 450, desc: "Create logos and social media posts. Earn KES 450 per task." },
    { id: 2, title: "Transcription", company: "Zuku", location: "Mombasa", salary: 300, desc: "Convert 10 minutes of audio to text. Earn KES 300 per task." },
    { id: 3, title: "Data Entry", company: "TechSafi", location: "Remote", salary: 800, desc: "Input spreadsheet data correctly. Earn KES 800 per task." }
];

let balance = localStorage.getItem('kaziBalance') ? parseFloat(localStorage.getItem('kaziBalance')) : 0;
let tasksCompleted = localStorage.getItem('kaziTasks') ? parseInt(localStorage.getItem('kaziTasks')) : 0;
let transactions = localStorage.getItem('kaziHistory') ? JSON.parse(localStorage.getItem('kaziHistory')) : [];

// 2. RENDERING FUNCTIONS
function renderJobs(list) {
    const container = document.getElementById('jobContainer');
    if(!container) return;
    container.innerHTML = list.map(job => `
        <div class="job-card">
            <h3>${job.title}</h3>
            <p><i class="fas fa-building"></i> ${job.company} • <i class="fas fa-map-marker-alt"></i> ${job.location}</p>
            <p style="color:var(--primary); font-weight:700; margin-top:5px;">Earn KES ${job.salary}</p>
            <div class="job-actions">
                <button class="btn-primary" onclick="viewJob(${job.id})">View Details</button>
            </div>
        </div>
    `).join('');
}

function renderTransactions() {
    const list = document.getElementById('transaction-list');
    if (!list) return;
    if (transactions.length === 0) {
        list.innerHTML = `<p style="color: var(--muted);">No transactions yet.</p>`;
        return;
    }

    list.innerHTML = transactions.map(t => `
        <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
            <span>${t.type} - ${t.date}</span>
            <span style="color: var(--success); font-weight: bold;">+ KES ${t.amount}</span>
        </div>
    `).join('');
}

// 3. CORE LOGIC (Earn & Withdraw)
function viewJob(id) {
    const job = jobData.find(j => j.id === id);
    const modal = document.getElementById('uiModal');
    document.getElementById('modalContent').innerHTML = `
        <span class="close-btn" onclick="closeModal()">&times;</span>
        <h2>${job.title}</h2>
        <p><strong>Reward:</strong> KES ${job.salary}</p>
        <hr style="margin:15px 0; opacity:0.1">
        <label>Paste Work Link (Proof of completion):</label>
        <input type="text" id="workLink" placeholder="https://..." style="width:100%; padding:12px; margin-top:10px; border-radius:8px; border:1px solid #ddd;">
        <button class="btn-primary" style="width:100%; margin-top:20px;" onclick="submitWithProof(${job.salary}, '${job.title}')">Submit Proof of Work</button>
    `;
    modal.style.display = 'flex';
}

function submitWithProof(amount, title) {
    const proof = document.getElementById('workLink').value;
    if(!proof || proof.length < 5) {
        alert("Please provide a valid link to your work!");
        return;
    }
    completeTask(amount, title);
}

function completeTask(amount, title) {
    balance += amount;
    tasksCompleted += 1;

    // Record Transaction
    const newTransaction = {
        id: Date.now(),
        type: `Task: ${title}`,
        amount: amount,
        date: new Date().toLocaleDateString()
    };
    transactions.unshift(newTransaction);

    // Save to LocalStorage
    localStorage.setItem('kaziBalance', balance);
    localStorage.setItem('kaziTasks', tasksCompleted);
    localStorage.setItem('kaziHistory', JSON.stringify(transactions));

    updateDashboardUI();
    renderTransactions();
    alert(`Good job! KES ${amount} added to your account.`);
    closeModal();
}

function triggerWithdraw(method) {
    if(balance < 100) {
        alert("Minimum withdrawal is KES 100");
        return;
    }
    
    const confirmWithdraw = confirm(`Withdraw KES ${balance} to your ${method} account?`);
    if(confirmWithdraw) {
        // Record Withdrawal in History
        const withdrawTx = {
            id: Date.now(),
            type: `Withdrawal (${method})`,
            amount: -balance, // Negative for withdrawal
            date: new Date().toLocaleDateString()
        };
        transactions.unshift(withdrawTx);
        
        balance = 0;
        localStorage.setItem('kaziBalance', 0);
        localStorage.setItem('kaziHistory', JSON.stringify(transactions));
        
        updateDashboardUI();
        renderTransactions();
        alert("Withdrawal successful! Processing may take 24 hours.");
    }
}

// 4. NAVIGATION & UI
function updateDashboardUI() {
    const balEl = document.getElementById('balance-display');
    const taskEl = document.getElementById('task-count');
    if(balEl) balEl.innerText = `KES ${balance.toLocaleString()}`;
    if(taskEl) taskEl.innerText = tasksCompleted;
}

function goToDashboard() {
    closeModal();
    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('dashboard-view').classList.remove('hidden');
    
    updateDashboardUI();
    renderTransactions();

    const savedPhone = localStorage.getItem('kaziPhone');
    if(savedPhone) {
        const phoneDisp = document.getElementById('phone-display');
        if(phoneDisp) phoneDisp.innerText = savedPhone;
    }

    document.getElementById('nav-actions').innerHTML = `
        <button class="icon-btn" onclick="toggleDark()"><i class="fas fa-moon"></i></button>
        <button class="btn-secondary" onclick="location.reload()">Logout</button>
    `;
}

function linkWallet() {
    const phone = prompt("Enter your M-Pesa Number:");
    if (phone && phone.length >= 10) {
        localStorage.setItem('kaziPhone', phone);
        const phoneDisp = document.getElementById('phone-display');
        if(phoneDisp) phoneDisp.innerText = phone;
        alert("Wallet Linked!");
    }
}

// 5. UTILS
function searchJobs() {
    const term = document.getElementById('jobInput').value.toLowerCase();
    const filtered = jobData.filter(j => j.title.toLowerCase().includes(term));
    renderJobs(filtered);
}

function openAuth() {
    const modal = document.getElementById('uiModal');
    document.getElementById('modalContent').innerHTML = `
        <span class="close-btn" onclick="closeModal()">&times;</span>
        <h3>Welcome to KaziLink</h3>
        <input type="text" id="userName" placeholder="Your Name" style="width:100%; padding:12px; margin:15px 0; border-radius:10px; border:1px solid #ddd;">
        <button class="btn-primary" style="width:100%" onclick="goToDashboard()">Log In</button>
    `;
    modal.style.display = 'flex';
}

function showHome() { location.reload(); }
function closeModal() { document.getElementById('uiModal').style.display = 'none'; }
function toggleDark() { document.body.classList.toggle('dark'); }

// Run on load
renderJobs(jobData);

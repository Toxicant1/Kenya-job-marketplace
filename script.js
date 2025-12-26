const jobData = [
    { id: 1, title: "Graphic Designer", company: "Canvas Co", location: "Nairobi", salary: 450, desc: "Create logos and social media posts. Earn KES 450 per task." },
    { id: 2, title: "Transcription", company: "Zuku", location: "Mombasa", salary: 300, desc: "Convert 10 minutes of audio to text. Earn KES 300 per task." },
    { id: 3, title: "Data Entry", company: "TechSafi", location: "Remote", salary: 800, desc: "Input spreadsheet data correctly. Earn KES 800 per task." }
];

// Memory variables
let balance = localStorage.getItem('kaziBalance') ? parseFloat(localStorage.getItem('kaziBalance')) : 0;
let tasksCompleted = localStorage.getItem('kaziTasks') ? parseInt(localStorage.getItem('kaziTasks')) : 0;

function renderJobs(list) {
    const container = document.getElementById('jobContainer');
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

function viewJob(id) {
    const job = jobData.find(j => j.id === id);
    const modal = document.getElementById('uiModal');
    document.getElementById('modalContent').innerHTML = `
        <span class="close-btn" onclick="closeModal()">&times;</span>
        <h2>${job.title}</h2>
        <p><strong>Pay:</strong> KES ${job.salary}</p>
        <hr style="margin:15px 0; opacity:0.1">
        <p>${job.desc}</p>
        <button class="btn-primary" style="width:100%; margin-top:20px;" onclick="completeTask(${job.salary})">Submit Finished Work</button>
    `;
    modal.style.display = 'flex';
}

function completeTask(amount) {
    balance += amount;
    tasksCompleted += 1;
    // Save to browser memory
    localStorage.setItem('kaziBalance', balance);
    localStorage.setItem('kaziTasks', tasksCompleted);
    
    updateDashboardUI();
    alert(`Good job! KES ${amount} added to your account.`);
    closeModal();
}

function updateDashboardUI() {
    document.getElementById('balance-display').innerText = `KES ${balance.toLocaleString()}`;
    document.getElementById('task-count').innerText = tasksCompleted;
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

function goToDashboard() {
    closeModal();
    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('dashboard-view').classList.remove('hidden');
    updateDashboardUI();
    document.getElementById('nav-actions').innerHTML = `
        <button class="icon-btn" onclick="toggleDark()"><i class="fas fa-moon"></i></button>
        <button class="btn-secondary" onclick="location.reload()">Logout</button>
    `;
}

function searchJobs() {
    const term = document.getElementById('jobInput').value.toLowerCase();
    const filtered = jobData.filter(j => j.title.toLowerCase().includes(term));
    renderJobs(filtered);
}

function triggerWithdraw(method) {
    if(balance < 100) {
        alert("Minimum withdrawal is KES 100");
    } else {
        alert(`Processing KES ${balance} withdrawal to your ${method} account...`);
        balance = 0;
        localStorage.setItem('kaziBalance', 0);
        updateDashboardUI();
    }
}

function showHome() { location.reload(); }
function closeModal() { document.getElementById('uiModal').style.display = 'none'; }
function toggleDark() { document.body.classList.toggle('dark'); }

// Run on load
renderJobs(jobData);

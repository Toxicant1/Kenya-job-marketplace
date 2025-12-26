// 1. Elements
const jobFeed = document.getElementById('job-feed-section');
const dashboard = document.getElementById('dashboard-section');
const jobForm = document.getElementById('job-form');
const jobList = document.getElementById('job-list');

// 2. Navigation Logic (Making buttons work)
document.getElementById('show-dash-btn').addEventListener('click', () => {
    jobFeed.classList.add('hidden');
    dashboard.classList.remove('hidden');
});

document.getElementById('show-jobs-btn').addEventListener('click', () => {
    dashboard.classList.add('hidden');
    jobFeed.classList.remove('hidden');
});

// 3. Save and Load Jobs (Local Storage)
let jobs = JSON.parse(localStorage.getItem('kenya_jobs')) || [];

function displayJobs() {
    jobList.innerHTML = '';
    jobs.forEach((job, index) => {
        jobList.innerHTML += `
            <div class="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                <h4 class="text-xl font-bold text-blue-700">${job.title}</h4>
                <p class="text-gray-600">${job.company} — <span class="text-gray-400">${job.location}</span></p>
                <a href="https://wa.me/${job.whatsapp}?text=I%20am%20interested%20in%20the%20${job.title}%20position" 
                   target="_blank" 
                   class="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded text-sm font-bold">
                   Apply via WhatsApp
                </a>
            </div>
        `;
    });
}

// 4. Handle Form Submission
jobForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newJob = {
        title: document.getElementById('job-title').value,
        company: document.getElementById('job-company').value,
        location: document.getElementById('job-location').value,
        whatsapp: document.getElementById('job-whatsapp').value
    };

    jobs.push(newJob);
    localStorage.setItem('kenya_jobs', JSON.stringify(jobs)); // Save it!
    
    jobForm.reset();
    alert("Job Posted Successfully!");
    
    // Switch back to feed
    dashboard.classList.add('hidden');
    jobFeed.classList.remove('hidden');
    displayJobs();
});

// Initial Load
displayJobs();

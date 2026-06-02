const API = 'http://localhost:5000/api';

function parseSkills(value) {
  return String(value || '').split(',').map(s => s.trim()).filter(Boolean);
}

function buildJobPayload(formData) {
  return {
    userId: formData.get('userId'),
    jobTitle: formData.get('jobTitle'),
    companyInformation: formData.get('companyInformation'),
    jobDescription: formData.get('jobDescription'),
    requiredEducationLevel: formData.get('requiredEducationLevel'),
    requiredSkills: parseSkills(formData.get('requiredSkills')),
    yearsOfExperience: Number(formData.get('yearsOfExperience') || 0),
    workMode: formData.get('workMode'),
    jobLocation: formData.get('jobLocation'),
    jobType: formData.get('jobType') || '',
    salaryMin: Number(formData.get('salaryMin') || 0),
    salaryMax: Number(formData.get('salaryMax') || 0),
  };
}

// Create job
document.getElementById('jobForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const output = document.getElementById('jobOutput');
  try {
    const res = await fetch(`${API}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildJobPayload(new FormData(event.target))),
    });
    output.textContent = JSON.stringify(await res.json(), null, 2);
    event.target.reset();
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
});

// Update job
document.getElementById('updateJobForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const output = document.getElementById('updateJobOutput');
  const formData = new FormData(event.target);
  const jobId = formData.get('jobId');
  try {
    const res = await fetch(`${API}/jobs/${jobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildJobPayload(formData)),
    });
    output.textContent = JSON.stringify(await res.json(), null, 2);
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
});

// Search candidates (employer homepage + search)
document.getElementById('candidateSearchForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const output = document.getElementById('candidateSearchOutput');
  const formData = new FormData(event.target);
  const params = new URLSearchParams();
  for (const [key, value] of formData.entries()) {
    if (String(value).trim()) params.append(key, value);
  }
  try {
    const res = await fetch(`${API}/candidates?${params}`);
    output.textContent = JSON.stringify(await res.json(), null, 2);
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
});

// Load all jobs
document.getElementById('loadJobs').addEventListener('click', async () => {
  const output = document.getElementById('allJobsOutput');
  try {
    const res = await fetch(`${API}/jobs`);
    output.textContent = JSON.stringify(await res.json(), null, 2);
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
});

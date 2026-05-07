const API = 'http://localhost:5000/api';
const jobForm = document.getElementById('jobForm');
const loadJobsBtn = document.getElementById('loadJobs');
const jobOutput = document.getElementById('jobOutput');

jobForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(jobForm);
  const payload = {
    userId: formData.get('userId'),
    jobTitle: formData.get('jobTitle'),
    companyInformation: formData.get('companyInformation'),
    jobDescription: formData.get('jobDescription'),
    requiredEducationLevel: formData.get('requiredEducationLevel'),
    requiredSkills: String(formData.get('requiredSkills') || '').split(',').map(item => item.trim()).filter(Boolean),
    yearsOfExperience: Number(formData.get('yearsOfExperience')),
    workMode: formData.get('workMode'),
    jobLocation: formData.get('jobLocation'),
    jobType: formData.get('jobType'),
    salaryMin: Number(formData.get('salaryMin') || 0),
    salaryMax: Number(formData.get('salaryMax') || 0)
  };

  const response = await fetch(`${API}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  jobOutput.textContent = JSON.stringify(result, null, 2);
  jobForm.reset();
});

loadJobsBtn.addEventListener('click', async () => {
  const response = await fetch(`${API}/jobs`);
  const result = await response.json();
  jobOutput.textContent = JSON.stringify(result, null, 2);
});

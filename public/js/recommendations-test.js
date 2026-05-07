const API = 'http://localhost:5000/api';
const candidateIdInput = document.getElementById('candidateId');
const jobIdInput = document.getElementById('jobId');
const candidateRecBtn = document.getElementById('candidateRecBtn');
const jobRecBtn = document.getElementById('jobRecBtn');
const candidateRecOutput = document.getElementById('candidateRecOutput');
const jobRecOutput = document.getElementById('jobRecOutput');

candidateRecBtn.addEventListener('click', async () => {
  const id = candidateIdInput.value.trim();
  const response = await fetch(`${API}/recommendations/jobs/${id}?limit=10`);
  const result = await response.json();
  candidateRecOutput.textContent = JSON.stringify(result, null, 2);
});

jobRecBtn.addEventListener('click', async () => {
  const id = jobIdInput.value.trim();
  const response = await fetch(`${API}/recommendations/candidates/${id}?limit=10`);
  const result = await response.json();
  jobRecOutput.textContent = JSON.stringify(result, null, 2);
});

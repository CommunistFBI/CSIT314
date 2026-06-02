const API = 'http://localhost:5000/api';

// Create candidate
document.getElementById('candidateForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const output = document.getElementById('candidateOutput');
  try {
    const res = await fetch(`${API}/candidates`, { method: 'POST', body: new FormData(event.target) });
    output.textContent = JSON.stringify(await res.json(), null, 2);
    event.target.reset();
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
});

// Update candidate
document.getElementById('updateCandidateForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const output = document.getElementById('updateCandidateOutput');
  const formData = new FormData(event.target);
  const candidateId = formData.get('candidateId');
  formData.delete('candidateId');
  try {
    const res = await fetch(`${API}/candidates/${candidateId}`, { method: 'PUT', body: formData });
    output.textContent = JSON.stringify(await res.json(), null, 2);
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
});

// Search / browse jobs (candidate homepage + search)
document.getElementById('jobSearchForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const output = document.getElementById('jobSearchOutput');
  const formData = new FormData(event.target);
  const params = new URLSearchParams();
  for (const [key, value] of formData.entries()) {
    if (String(value).trim()) params.append(key, value);
  }
  try {
    const res = await fetch(`${API}/jobs?${params}`);
    output.textContent = JSON.stringify(await res.json(), null, 2);
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
});

// Load all candidates
document.getElementById('loadCandidates').addEventListener('click', async () => {
  const output = document.getElementById('allCandidatesOutput');
  try {
    const res = await fetch(`${API}/candidates`);
    output.textContent = JSON.stringify(await res.json(), null, 2);
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
});

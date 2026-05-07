const API = 'http://localhost:5000/api';
const candidateForm = document.getElementById('candidateForm');
const loadCandidatesBtn = document.getElementById('loadCandidates');
const candidateOutput = document.getElementById('candidateOutput');

candidateForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(candidateForm);
  const response = await fetch(`${API}/candidates`, { method: 'POST', body: formData });
  const result = await response.json();
  candidateOutput.textContent = JSON.stringify(result, null, 2);
  candidateForm.reset();
});

loadCandidatesBtn.addEventListener('click', async () => {
  const response = await fetch(`${API}/candidates`);
  const result = await response.json();
  candidateOutput.textContent = JSON.stringify(result, null, 2);
});

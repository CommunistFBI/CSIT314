const API = 'http://localhost:5000/api';
const STORAGE_KEY = 'talentMatchingCurrentUser';

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const authOutput = document.getElementById('authOutput');
const sessionStatus = document.getElementById('sessionStatus');

const candidateSection = document.getElementById('candidateSection');
const employerSection = document.getElementById('employerSection');
const recommendationsSection = document.getElementById('recommendationsSection');

const candidateForm = document.getElementById('candidateForm');
const candidateOutput = document.getElementById('candidateOutput');
const loadCandidateProfileBtn = document.getElementById('loadCandidateProfileBtn');
const candidateRecommendationsPanel = document.getElementById('candidateRecommendationsPanel');
const candidateRecommendationsOutput = document.getElementById('candidateRecommendationsOutput');

const jobForm = document.getElementById('jobForm');
const jobOutput = document.getElementById('jobOutput');
const loadEmployerJobsBtn = document.getElementById('loadEmployerJobsBtn');
const employerRecommendationsPanel = document.getElementById('employerRecommendationsPanel');
const employerJobSelect = document.getElementById('employerJobSelect');
const loadEmployerRecommendationsBtn = document.getElementById('loadEmployerRecommendationsBtn');
const employerRecommendationsOutput = document.getElementById('employerRecommendationsOutput');
const refreshRecommendationsBtn = document.getElementById('refreshRecommendationsBtn');

const jobSearchForm = document.getElementById('jobSearchForm');
const candidateSearchForm = document.getElementById('candidateSearchForm');
const searchOutput = document.getElementById('searchOutput');

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch (error) {
    return null;
  }
}

function setCurrentUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEY);
}

function renderJson(el, data) {
  el.textContent = JSON.stringify(data, null, 2);
}

function formToQueryString(form) {
  const params = new URLSearchParams();
  const formData = new FormData(form);

  formData.forEach((value, key) => {
    if (String(value || '').trim() !== '') {
      params.append(key, value);
    }
  });

  return params.toString();
}

async function getJson(path) {
  const response = await fetch(`${API}${path}`);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Request failed.');
  }
  return result;
}

async function postJson(path, payload) {
  const response = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Request failed.');
  }
  return result;
}

function setSectionVisibility(user) {
  const role = user?.role || '';
  candidateSection.classList.toggle('hidden', role !== 'candidate');
  employerSection.classList.toggle('hidden', role !== 'employer');
  recommendationsSection.classList.toggle('hidden', !role);
  candidateRecommendationsPanel.classList.toggle('hidden', role !== 'candidate');
  employerRecommendationsPanel.classList.toggle('hidden', role !== 'employer');

  if (!user) {
    sessionStatus.textContent = 'Not logged in.';
    authOutput.textContent = 'Waiting...';
    return;
  }

  sessionStatus.textContent = `Logged in as ${user.email} (${user.role}, ${user.membershipType})`;
}

async function handleRegister(event) {
  event.preventDefault();
  const formData = new FormData(registerForm);

  try {
    const result = await postJson('/auth/register', {
      email: formData.get('email'),
      password: formData.get('password'),
      role: formData.get('role'),
      isMember: formData.get('isMember') === 'true'
    });
    setCurrentUser(result.data);
    renderJson(authOutput, result);
    setSectionVisibility(result.data);
    registerForm.reset();
    await loadRoleData();
  } catch (error) {
    renderJson(authOutput, { success: false, message: error.message });
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const formData = new FormData(loginForm);

  try {
    const result = await postJson('/auth/login', {
      email: formData.get('email'),
      password: formData.get('password')
    });
    setCurrentUser(result.data);
    renderJson(authOutput, result);
    setSectionVisibility(result.data);
    loginForm.reset();
    await loadRoleData();
  } catch (error) {
    renderJson(authOutput, { success: false, message: error.message });
  }
}

async function submitCandidateProfile(event) {
  event.preventDefault();
  const user = getCurrentUser();
  if (!user) return;

  const formData = new FormData(candidateForm);
  formData.append('userId', user.id);

  try {
    const response = await fetch(`${API}/candidates`, { method: 'POST', body: formData });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to create candidate profile.');
    renderJson(candidateOutput, result);
    candidateForm.reset();
    await loadCandidateRecommendations();
  } catch (error) {
    renderJson(candidateOutput, { success: false, message: error.message });
  }
}

async function submitJob(event) {
  event.preventDefault();
  const user = getCurrentUser();
  if (!user) return;

  const formData = new FormData(jobForm);
  const payload = {
    userId: user.id,
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

  try {
    const result = await postJson('/jobs', payload);
    renderJson(jobOutput, result);
    jobForm.reset();
    await loadEmployerJobs();
  } catch (error) {
    renderJson(jobOutput, { success: false, message: error.message });
  }
}

async function loadCandidateProfile() {
  const user = getCurrentUser();
  if (!user) return null;

  try {
    const result = await getJson(`/candidates/user/${user.id}`);
    renderJson(candidateOutput, result);
    return result.data;
  } catch (error) {
    renderJson(candidateOutput, { success: false, message: error.message });
    return null;
  }
}

async function loadCandidateRecommendations() {
  const user = getCurrentUser();
  if (!user) return;

  const candidate = await loadCandidateProfile();
  if (!candidate) {
    candidateRecommendationsOutput.textContent = 'Create a candidate profile first to test recommendations.';
    return;
  }

  try {
    const result = await getJson(`/recommendations/jobs/${candidate.id}?limit=50`);
    renderJson(candidateRecommendationsOutput, result);
  } catch (error) {
    renderJson(candidateRecommendationsOutput, { success: false, message: error.message });
  }
}

async function loadEmployerJobs() {
  const user = getCurrentUser();
  if (!user) return [];

  try {
    const result = await getJson(`/jobs?userId=${encodeURIComponent(user.id)}`);
    renderJson(jobOutput, result);
    const jobs = result.data || [];
    employerJobSelect.innerHTML = '<option value="">Select one of your jobs</option>' +
      jobs.map(job => `<option value="${job.id}">${job.jobTitle} (${job.companyInformation})</option>`).join('');
    return jobs;
  } catch (error) {
    renderJson(jobOutput, { success: false, message: error.message });
    employerJobSelect.innerHTML = '<option value="">Select one of your jobs</option>';
    return [];
  }
}

async function loadEmployerRecommendations() {
  const jobId = employerJobSelect.value;
  if (!jobId) {
    renderJson(employerRecommendationsOutput, { success: false, message: 'Select one of your jobs first.' });
    return;
  }

  try {
    const result = await getJson(`/recommendations/candidates/${jobId}?limit=50`);
    renderJson(employerRecommendationsOutput, result);
  } catch (error) {
    renderJson(employerRecommendationsOutput, { success: false, message: error.message });
  }
}

async function searchJobs(event) {
  event.preventDefault();
  try {
    const queryString = formToQueryString(jobSearchForm);
    const result = await getJson(`/jobs${queryString ? `?${queryString}` : ''}`);
    renderJson(searchOutput, result);
  } catch (error) {
    renderJson(searchOutput, { success: false, message: error.message });
  }
}

async function searchCandidates(event) {
  event.preventDefault();
  try {
    const queryString = formToQueryString(candidateSearchForm);
    const result = await getJson(`/candidates${queryString ? `?${queryString}` : ''}`);
    renderJson(searchOutput, result);
  } catch (error) {
    renderJson(searchOutput, { success: false, message: error.message });
  }
}

async function loadRoleData() {
  const user = getCurrentUser();
  setSectionVisibility(user);

  if (!user) {
    candidateOutput.textContent = 'No candidate profile loaded.';
    candidateRecommendationsOutput.textContent = 'No recommendation data loaded.';
    jobOutput.textContent = 'No employer jobs loaded.';
    employerRecommendationsOutput.textContent = 'No recommendation data loaded.';
    employerJobSelect.innerHTML = '<option value="">Select one of your jobs</option>';
    return;
  }

  if (user.role === 'candidate') {
    await loadCandidateRecommendations();
  }

  if (user.role === 'employer') {
    await loadEmployerJobs();
  }
}

registerForm.addEventListener('submit', handleRegister);
loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', () => {
  clearCurrentUser();
  setSectionVisibility(null);
  loadRoleData();
});
candidateForm.addEventListener('submit', submitCandidateProfile);
jobForm.addEventListener('submit', submitJob);
loadCandidateProfileBtn.addEventListener('click', loadCandidateRecommendations);
loadEmployerJobsBtn.addEventListener('click', loadEmployerJobs);
loadEmployerRecommendationsBtn.addEventListener('click', loadEmployerRecommendations);
refreshRecommendationsBtn.addEventListener('click', loadRoleData);
jobSearchForm.addEventListener('submit', searchJobs);
candidateSearchForm.addEventListener('submit', searchCandidates);

setSectionVisibility(getCurrentUser());
loadRoleData();

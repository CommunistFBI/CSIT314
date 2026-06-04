// Central API
// Base URL falls back to localhost:5000 if REACT_APP_API_URL not set in .env

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

async function request(method, path, body = null) {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${BASE}${path}`, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `Request failed: ${res.status}`);
    return data;
}

// Auth
export const apiRegister      = (email, password, role) => request('POST', '/api/auth/register', { email, password, role });
export const apiLogin         = (email, password) => request('POST', '/api/auth/login', { email, password });
export const apiSetMembership = (userId, isMember) => request('PATCH', `/api/auth/${userId}/membership`, { isMember });

// Candidates
export const apiGetCandidates    = (params = {}) => request('GET', `/api/candidates?${new URLSearchParams(params)}`);
export const apiGetCandidateById = (id) => request('GET', `/api/candidates/${id}`);
export const apiGetCandidateByUser = (userId) => request('GET', `/api/candidates/user/${userId}`);
export const apiCreateCandidate  = (formData) => fetch(`${BASE}/api/candidates`, { method: 'POST', body: formData }).then(r => r.json().then(d => { if (!r.ok) throw new Error(d.message); return d; })); // multipart
export const apiUpdateCandidate  = (id, formData) => fetch(`${BASE}/api/candidates/${id}`, { method: 'PUT', body: formData }).then(r => r.json().then(d => { if (!r.ok) throw new Error(d.message); return d; })); // multipart

// Jobs
export const apiGetJobs    = (params = {}) => request('GET', `/api/jobs?${new URLSearchParams(params)}`);
export const apiGetJobById = (id) => request('GET', `/api/jobs/${id}`);
export const apiCreateJob  = (body) => request('POST', '/api/jobs', body);
export const apiUpdateJob  = (id, body) => request('PUT', `/api/jobs/${id}`, body);

// Recommendations
export const apiRecommendJobs       = (candidateId) => request('GET', `/api/recommendations/jobs/${candidateId}`);
export const apiRecommendCandidates = (jobId) => request('GET', `/api/recommendations/candidates/${jobId}`);

// Applications
export const apiApply           = (jobId, candidateId) => request('POST', '/api/applications', { jobId, candidateId });
export const apiGetApplications = (params = {}) => request('GET', `/api/applications?${new URLSearchParams(params)}`);
export const apiUpdateAppStatus = (id, status) => request('PATCH', `/api/applications/${id}`, { status });

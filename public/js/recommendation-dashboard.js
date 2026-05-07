const els = {
      baseUrl: document.getElementById('baseUrl'),
      reloadAllBtn: document.getElementById('reloadAllBtn'),
      candidateSelect: document.getElementById('candidateSelect'),
      candidateLimit: document.getElementById('candidateLimit'),
      loadJobsBtn: document.getElementById('loadJobsBtn'),
      candidateStatus: document.getElementById('candidateStatus'),
      candidateDetails: document.getElementById('candidateDetails'),
      jobRecommendations: document.getElementById('jobRecommendations'),
      jobSelect: document.getElementById('jobSelect'),
      jobLimit: document.getElementById('jobLimit'),
      loadCandidatesBtn: document.getElementById('loadCandidatesBtn'),
      jobStatus: document.getElementById('jobStatus'),
      jobDetails: document.getElementById('jobDetails'),
      candidateRecommendations: document.getElementById('candidateRecommendations')
    };

    let candidatesCache = [];
    let jobsCache = [];

    function getBaseUrl() {
      return els.baseUrl.value.trim().replace(/\/+$/, '');
    }

    function safeArray(value) {
      return Array.isArray(value) ? value : [];
    }

    function normaliseApiArray(payload) {
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload.data)) return payload.data;
      if (Array.isArray(payload.results)) return payload.results;
      if (Array.isArray(payload.candidates)) return payload.candidates;
      if (Array.isArray(payload.jobs)) return payload.jobs;
      return [];
    }

    function setStatus(el, message, type = '') {
      el.className = 'status' + (type ? ' ' + type : '');
      el.textContent = message;
    }

    function escapeHtml(str) {
      return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function renderPills(items) {
      const arr = safeArray(items).filter(Boolean);
      if (!arr.length) return '<span class="muted">None</span>';
      return arr.map(item => `<span class="pill">${escapeHtml(item)}</span>`).join('');
    }

    function getCandidateName(candidate) {
      return candidate.fullName || candidate.name || `Candidate #${candidate.id}`;
    }

    function getJobTitle(job) {
      return job.jobTitle || job.title || `Job #${job.id}`;
    }

    function renderCandidateCard(candidate) {
      const skills = candidate.skills || candidate.skillSet || [];
      const preferences = candidate.preferences || [];
      return `
        <div class="item">
          <h3>${escapeHtml(getCandidateName(candidate))}</h3>
          <div class="meta"><strong>ID:</strong> ${escapeHtml(candidate.id)}</div>
          <div class="meta"><strong>Education:</strong> ${escapeHtml(candidate.education || 'N/A')}</div>
          <div class="meta"><strong>Major:</strong> ${escapeHtml(candidate.major || 'N/A')}</div>
          <div class="meta"><strong>Experience:</strong> ${escapeHtml(candidate.yearsOfExperience ?? 'N/A')} years</div>
          <div class="meta"><strong>Contact:</strong> ${escapeHtml(candidate.contactInformation || 'N/A')}</div>
          <div class="meta"><strong>Skills:</strong></div>
          <div>${renderPills(skills)}</div>
          <div class="meta"><strong>Preferences:</strong></div>
          <div>${renderPills(preferences)}</div>
        </div>
      `;
    }

    function renderJobCard(job) {
      const skills = job.requiredSkills || job.skills || [];
      return `
        <div class="item">
          <h3>${escapeHtml(getJobTitle(job))}</h3>
          <div class="meta"><strong>ID:</strong> ${escapeHtml(job.id)}</div>
          <div class="meta"><strong>Company:</strong> ${escapeHtml(job.companyInformation || job.company || 'N/A')}</div>
          <div class="meta"><strong>Education:</strong> ${escapeHtml(job.requiredEducationLevel || 'N/A')}</div>
          <div class="meta"><strong>Experience:</strong> ${escapeHtml(job.yearsOfExperience ?? 'N/A')} years</div>
          <div class="meta"><strong>Work Mode:</strong> ${escapeHtml(job.workMode || 'N/A')}</div>
          <div class="meta"><strong>Location:</strong> ${escapeHtml(job.jobLocation || 'N/A')}</div>
          <div class="meta"><strong>Description:</strong> ${escapeHtml(job.jobDescription || 'N/A')}</div>
          <div class="meta"><strong>Required Skills:</strong></div>
          <div>${renderPills(skills)}</div>
        </div>
      `;
    }

    function renderRecommendationCard(item, type) {
      const score = item.matchScore ?? item.score ?? item.recommendationScore;
      const details = item.matchDetails || item.reason || item.explanation;

      if (type === 'job') {
        return `
          <div class="item">
            <h3>${escapeHtml(getJobTitle(item))}</h3>
            <div class="meta"><strong>Company:</strong> ${escapeHtml(item.companyInformation || item.company || 'N/A')}</div>
            <div class="meta"><strong>Location:</strong> ${escapeHtml(item.jobLocation || 'N/A')}</div>
            <div class="meta"><strong>Work Mode:</strong> ${escapeHtml(item.workMode || 'N/A')}</div>
            <div class="meta"><strong>Score:</strong> ${escapeHtml(score ?? 'N/A')}</div>
            <div class="meta"><strong>Required Skills:</strong></div>
            <div>${renderPills(item.requiredSkills || [])}</div>
            ${details ? `<div class="meta"><strong>Why matched:</strong> ${escapeHtml(details)}</div>` : ''}
          </div>
        `;
      }

      return `
        <div class="item">
          <h3>${escapeHtml(getCandidateName(item))}</h3>
          <div class="meta"><strong>Education:</strong> ${escapeHtml(item.education || 'N/A')}</div>
          <div class="meta"><strong>Major:</strong> ${escapeHtml(item.major || 'N/A')}</div>
          <div class="meta"><strong>Experience:</strong> ${escapeHtml(item.yearsOfExperience ?? 'N/A')} years</div>
          <div class="meta"><strong>Score:</strong> ${escapeHtml(score ?? 'N/A')}</div>
          <div class="meta"><strong>Skills:</strong></div>
          <div>${renderPills(item.skills || [])}</div>
          ${details ? `<div class="meta"><strong>Why matched:</strong> ${escapeHtml(details)}</div>` : ''}
        </div>
      `;
    }

    async function apiGet(path) {
      const res = await fetch(`${getBaseUrl()}${path}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || `Request failed with status ${res.status}`);
      }
      return data;
    }

    function populateCandidateSelect() {
      if (!candidatesCache.length) {
        els.candidateSelect.innerHTML = '<option value="">No candidates found</option>';
        return;
      }
      els.candidateSelect.innerHTML = '<option value="">Select a candidate</option>' +
        candidatesCache.map(candidate => `
          <option value="${candidate.id}">
            ${escapeHtml(getCandidateName(candidate))} (ID: ${escapeHtml(candidate.id)})
          </option>
        `).join('');
    }

    function populateJobSelect() {
      if (!jobsCache.length) {
        els.jobSelect.innerHTML = '<option value="">No jobs found</option>';
        return;
      }
      els.jobSelect.innerHTML = '<option value="">Select a job</option>' +
        jobsCache.map(job => `
          <option value="${job.id}">
            ${escapeHtml(getJobTitle(job))} (ID: ${escapeHtml(job.id)})
          </option>
        `).join('');
    }

    async function loadInitialData() {
      setStatus(els.candidateStatus, 'Loading candidates...');
      setStatus(els.jobStatus, 'Loading jobs...');

      try {
        const [candidatePayload, jobPayload] = await Promise.all([
          apiGet('/api/candidates'),
          apiGet('/api/jobs')
        ]);

        candidatesCache = normaliseApiArray(candidatePayload);
        jobsCache = normaliseApiArray(jobPayload);

        populateCandidateSelect();
        populateJobSelect();

        setStatus(els.candidateStatus, `Loaded ${candidatesCache.length} candidate(s).`, 'success');
        setStatus(els.jobStatus, `Loaded ${jobsCache.length} job(s).`, 'success');
      } catch (error) {
        setStatus(els.candidateStatus, error.message, 'error');
        setStatus(els.jobStatus, error.message, 'error');
      }
    }

    async function loadRecommendedJobs() {
      const candidateId = els.candidateSelect.value;
      const limit = els.candidateLimit.value;

      els.candidateDetails.innerHTML = '';
      els.jobRecommendations.innerHTML = '';

      if (!candidateId) {
        setStatus(els.candidateStatus, 'Please select a candidate first.', 'error');
        return;
      }

      const candidate = candidatesCache.find(c => String(c.id) === String(candidateId));
      if (candidate) {
        els.candidateDetails.innerHTML = renderCandidateCard(candidate);
      }

      setStatus(els.candidateStatus, 'Loading job recommendations...');

      try {
        const payload = await apiGet(`/api/recommendations/jobs/${candidateId}?limit=${limit}`);
        const recommendations = normaliseApiArray(payload);

        if (!recommendations.length) {
          els.jobRecommendations.innerHTML = '<div class="item muted">No recommendations found for this candidate.</div>';
          setStatus(els.candidateStatus, 'No job recommendations found.', 'error');
          return;
        }

        els.jobRecommendations.innerHTML = recommendations
          .map(job => renderRecommendationCard(job, 'job'))
          .join('');

        setStatus(els.candidateStatus, `Loaded ${recommendations.length} recommended job(s).`, 'success');
      } catch (error) {
        setStatus(els.candidateStatus, error.message, 'error');
      }
    }

    async function loadRecommendedCandidates() {
      const jobId = els.jobSelect.value;
      const limit = els.jobLimit.value;

      els.jobDetails.innerHTML = '';
      els.candidateRecommendations.innerHTML = '';

      if (!jobId) {
        setStatus(els.jobStatus, 'Please select a job first.', 'error');
        return;
      }

      const job = jobsCache.find(j => String(j.id) === String(jobId));
      if (job) {
        els.jobDetails.innerHTML = renderJobCard(job);
      }

      setStatus(els.jobStatus, 'Loading candidate recommendations...');

      try {
        const payload = await apiGet(`/api/recommendations/candidates/${jobId}?limit=${limit}`);
        const recommendations = normaliseApiArray(payload);

        if (!recommendations.length) {
          els.candidateRecommendations.innerHTML = '<div class="item muted">No recommendations found for this job.</div>';
          setStatus(els.jobStatus, 'No candidate recommendations found.', 'error');
          return;
        }

        els.candidateRecommendations.innerHTML = recommendations
          .map(candidate => renderRecommendationCard(candidate, 'candidate'))
          .join('');

        setStatus(els.jobStatus, `Loaded ${recommendations.length} recommended candidate(s).`, 'success');
      } catch (error) {
        setStatus(els.jobStatus, error.message, 'error');
      }
    }

    els.reloadAllBtn.addEventListener('click', loadInitialData);
    els.loadJobsBtn.addEventListener('click', loadRecommendedJobs);
    els.loadCandidatesBtn.addEventListener('click', loadRecommendedCandidates);

    loadInitialData();

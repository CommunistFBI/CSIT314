const store = require('../data/store');

async function applyForJob(req, res) {
  try {
    const { jobId, candidateId } = req.body;
    if (!jobId || !candidateId) {
      return res.status(400).json({ success: false, message: 'jobId and candidateId are required.' });
    }
    const job = await store.findJobById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
    const candidate = await store.findCandidateById(candidateId);
    if (!candidate) return res.status(404).json({ success: false, message: 'Candidate profile not found.' });

    const application = await store.insertApplication(jobId, candidateId);
    res.status(201).json({ success: true, message: 'Application submitted successfully.', data: application });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ success: false, message: 'You have already applied for this job.' });
    }
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

async function getApplications(req, res) {
  try {
    const { jobId, candidateId } = req.query;
    const applications = await store.getApplications({ jobId, candidateId });
    res.json({ success: true, count: applications.length, data: applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

async function updateApplicationStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['Pending', 'Reviewed', 'Shortlisted', 'Rejected', 'Accepted'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(', ')}` });
    }
    const updated = await store.updateApplicationStatus(id, status);
    if (!updated) return res.status(404).json({ success: false, message: 'Application not found.' });
    res.json({ success: true, message: `Application ${status.toLowerCase()}.`, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

module.exports = { applyForJob, getApplications, updateApplicationStatus };

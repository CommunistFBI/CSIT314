const { getCandidates, getJobs, getUsers } = require('../data/store');
const { getTopJobsForCandidate, getTopCandidatesForJob } = require('../services/matchingService');
const { toNumber } = require('../utils/parseHelpers');

function getMembershipStatus(userId, fallback = false) {
  const user = getUsers().find(item => String(item.id) === String(userId));
  return Boolean(user?.isMember || fallback);
}

function getEffectiveLimit(requestedLimit, totalAvailable, isMember) {
  if (isMember) return totalAvailable;

  const numericLimit = toNumber(requestedLimit, 10);
  if (numericLimit <= 0) return 10;

  return Math.min(numericLimit, 10);
}

function recommendJobsForCandidate(req, res) {
  const candidate = getCandidates().find(item => item.id === req.params.candidateId);

  if (!candidate) {
    return res.status(404).json({ success: false, message: 'Candidate not found.' });
  }

  const jobs = getJobs();
  const isMember = getMembershipStatus(candidate.userId, candidate.isMember);
  const effectiveLimit = getEffectiveLimit(req.query.limit, jobs.length, isMember);
  const recommendations = getTopJobsForCandidate(candidate, jobs, effectiveLimit);

  res.json({
    success: true,
    membershipActive: isMember,
    recommendationLimit: isMember ? 'unlimited' : effectiveLimit,
    candidate,
    count: recommendations.length,
    data: recommendations
  });
}

function recommendCandidatesForJob(req, res) {
  const job = getJobs().find(item => item.id === req.params.jobId);

  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }

  const candidates = getCandidates();
  const isMember = getMembershipStatus(job.userId, job.isMember);
  const effectiveLimit = getEffectiveLimit(req.query.limit, candidates.length, isMember);
  const recommendations = getTopCandidatesForJob(job, candidates, effectiveLimit);

  res.json({
    success: true,
    membershipActive: isMember,
    recommendationLimit: isMember ? 'unlimited' : effectiveLimit,
    job,
    count: recommendations.length,
    data: recommendations
  });
}

module.exports = {
  recommendJobsForCandidate,
  recommendCandidatesForJob
};

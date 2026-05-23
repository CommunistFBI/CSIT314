const { fuzzyIncludes } = require('../utils/searchHelpers');

function normalize(value) {
  return String(value || '').toLowerCase();
}

function includesKeyword(haystack, needle) {
  return fuzzyIncludes(haystack, needle) || normalize(haystack).includes(normalize(needle));
}

function countSkillMatches(candidateSkills = [], requiredSkills = []) {
  const candidateSet = new Set(candidateSkills.map(skill => normalize(skill)));
  let exactMatches = 0;
  let fuzzyMatches = 0;

  requiredSkills.forEach(skill => {
    const normalizedSkill = normalize(skill);
    if (candidateSet.has(normalizedSkill)) {
      exactMatches += 1;
      return;
    }

    if (candidateSkills.some(candidateSkill => includesKeyword(candidateSkill, skill) || includesKeyword(skill, candidateSkill))) {
      fuzzyMatches += 1;
    }
  });

  return exactMatches + fuzzyMatches;
}

function getMatchReasonsForJob(candidate, job, skillMatches) {
  const reasons = [];

  if (skillMatches > 0) reasons.push(`${skillMatches} skill match${skillMatches > 1 ? 'es' : ''}`);
  if (includesKeyword(candidate.education, job.requiredEducationLevel)) reasons.push('education level aligns');
  if (includesKeyword(candidate.major, job.jobDescription)) reasons.push('major is relevant to the description');
  if ((candidate.yearsOfExperience || 0) >= (job.yearsOfExperience || 0)) reasons.push('experience meets requirement');
  if (includesKeyword(job.workMode, candidate.preferredWorkingMode)) reasons.push('preferred work mode matches');
  if (includesKeyword(job.jobLocation, candidate.preferredLocation)) reasons.push('preferred location matches');
  if (includesKeyword(candidate.workExperience, job.jobDescription)) reasons.push('work experience is relevant to the job description');

  const matchedPreferences = (candidate.preferences || []).filter(preference =>
    includesKeyword(job.jobTitle, preference) ||
    includesKeyword(job.jobDescription, preference) ||
    includesKeyword(job.workMode, preference) ||
    includesKeyword(job.jobLocation, preference) ||
    includesKeyword(job.jobType, preference)
  );

  if (matchedPreferences.length > 0) {
    reasons.push(`preferences matched: ${matchedPreferences.join(', ')}`);
  }

  return reasons;
}

function getMatchReasonsForCandidate(job, candidate, skillMatches) {
  const reasons = [];

  if (skillMatches > 0) reasons.push(`${skillMatches} required skill match${skillMatches > 1 ? 'es' : ''}`);
  if (includesKeyword(candidate.education, job.requiredEducationLevel)) reasons.push('education requirement aligns');
  if ((candidate.yearsOfExperience || 0) >= (job.yearsOfExperience || 0)) reasons.push('experience requirement met');
  if (includesKeyword(candidate.major, job.jobDescription)) reasons.push('major is relevant');
  if (includesKeyword(candidate.preferredLocation, job.jobLocation)) reasons.push('candidate preferred location matches');
  if (includesKeyword(candidate.preferredWorkingMode, job.workMode)) reasons.push('candidate preferred work mode matches');
  if (includesKeyword(candidate.workExperience, job.jobDescription)) reasons.push('candidate work experience matches the JD');

  return reasons;
}

function calculateJobScore(candidate, job) {
  let score = 0;

  const skillMatches = countSkillMatches(candidate.skills, job.requiredSkills);
  score += skillMatches * 18;

  if (includesKeyword(candidate.education, job.requiredEducationLevel)) score += 14;
  if (includesKeyword(candidate.major, job.jobDescription)) score += 12;
  if ((candidate.yearsOfExperience || 0) >= (job.yearsOfExperience || 0)) score += 12;
  if (includesKeyword(job.workMode, candidate.preferredWorkingMode)) score += 10;
  if (includesKeyword(job.jobLocation, candidate.preferredLocation)) score += 10;
  if (includesKeyword(candidate.workExperience, job.jobDescription)) score += 8;

  (candidate.preferences || []).forEach(preference => {
    if (
      includesKeyword(job.jobTitle, preference) ||
      includesKeyword(job.jobDescription, preference) ||
      includesKeyword(job.workMode, preference) ||
      includesKeyword(job.jobLocation, preference) ||
      includesKeyword(job.jobType, preference)
    ) {
      score += 5;
    }
  });

  return {
    score,
    reasons: getMatchReasonsForJob(candidate, job, skillMatches)
  };
}

function calculateCandidateScore(job, candidate) {
  let score = 0;

  const skillMatches = countSkillMatches(candidate.skills, job.requiredSkills);
  score += skillMatches * 20;

  if (includesKeyword(candidate.education, job.requiredEducationLevel)) score += 14;
  if ((candidate.yearsOfExperience || 0) >= (job.yearsOfExperience || 0)) score += 12;
  if (includesKeyword(candidate.major, job.jobDescription)) score += 10;
  if (includesKeyword(candidate.preferredLocation, job.jobLocation)) score += 8;
  if (includesKeyword(candidate.preferredWorkingMode, job.workMode)) score += 8;
  if (includesKeyword(candidate.workExperience, job.jobDescription)) score += 8;

  return {
    score,
    reasons: getMatchReasonsForCandidate(job, candidate, skillMatches)
  };
}

function getTopJobsForCandidate(candidate, jobs, limit = 10) {
  return jobs
    .map(job => {
      const result = calculateJobScore(candidate, job);
      return {
        ...job,
        matchScore: result.score,
        matchReasons: result.reasons
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

function getTopCandidatesForJob(job, candidates, limit = 10) {
  return candidates
    .map(candidate => {
      const result = calculateCandidateScore(job, candidate);
      return {
        ...candidate,
        matchScore: result.score,
        matchReasons: result.reasons
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

module.exports = {
  getTopJobsForCandidate,
  getTopCandidatesForJob,
};

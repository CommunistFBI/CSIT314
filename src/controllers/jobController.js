const { getJobs, saveJobs, generateId, getUsers } = require('../data/store');
const { parseArrayField, toNumber } = require('../utils/parseHelpers');
const { fuzzyIncludes, objectToSearchText } = require('../utils/searchHelpers');

function buildJobPayload(req, user, existingJob = null) {
  const now = new Date().toISOString();

  return {
    id: existingJob?.id || generateId('job'),
    userId: user.id,
    employerEmail: user.email,
    jobTitle: String(req.body.jobTitle || existingJob?.jobTitle || '').trim(),
    companyInformation: String(req.body.companyInformation || existingJob?.companyInformation || '').trim(),
    jobDescription: String(req.body.jobDescription || existingJob?.jobDescription || '').trim(),
    requiredEducationLevel: String(req.body.requiredEducationLevel || existingJob?.requiredEducationLevel || '').trim(),
    requiredSkills: req.body.requiredSkills !== undefined
      ? parseArrayField(req.body.requiredSkills)
      : (existingJob?.requiredSkills || []),
    yearsOfExperience: req.body.yearsOfExperience !== undefined
      ? toNumber(req.body.yearsOfExperience)
      : toNumber(existingJob?.yearsOfExperience),
    workMode: String(req.body.workMode || existingJob?.workMode || '').trim(),
    jobLocation: String(req.body.jobLocation || existingJob?.jobLocation || '').trim(),
    jobType: String(req.body.jobType || existingJob?.jobType || '').trim(),
    salaryMin: req.body.salaryMin !== undefined ? toNumber(req.body.salaryMin) : toNumber(existingJob?.salaryMin),
    salaryMax: req.body.salaryMax !== undefined ? toNumber(req.body.salaryMax) : toNumber(existingJob?.salaryMax),
    isMember: Boolean(user.isMember),
    membershipType: user.isMember ? 'membership' : 'non-membership',
    createdAt: existingJob?.createdAt || now,
    updatedAt: now
  };
}

function validateJobPayload(job) {
  if (!job.jobTitle || !job.companyInformation || !job.jobDescription || !job.requiredEducationLevel || !job.workMode || !job.jobLocation) {
    return 'jobTitle, companyInformation, jobDescription, requiredEducationLevel, workMode, and jobLocation are required.';
  }

  if (!job.requiredSkills.length) {
    return 'At least one required skill is required.';
  }

  return '';
}

function createJob(req, res) {
  const jobs = getJobs();
  const users = getUsers();
  const userId = String(req.body.userId || '').trim();

  if (!userId) {
    return res.status(400).json({ success: false, message: 'userId is required to create a job.' });
  }

  const user = users.find(item => item.id === userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  if (user.role !== 'employer') {
    return res.status(403).json({ success: false, message: 'Only employer accounts can create jobs.' });
  }

  const newJob = buildJobPayload(req, user);
  const validationMessage = validateJobPayload(newJob);
  if (validationMessage) {
    return res.status(400).json({ success: false, message: validationMessage });
  }

  saveJobs([newJob, ...jobs]);
  res.status(201).json({ success: true, message: 'Job created successfully.', data: newJob });
}

function updateJob(req, res) {
  const jobs = getJobs();
  const jobIndex = jobs.findIndex(item => item.id === req.params.id);

  if (jobIndex === -1) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }

  const existingJob = jobs[jobIndex];
  const user = getUsers().find(item => item.id === existingJob.userId) || {
    id: existingJob.userId,
    email: existingJob.employerEmail,
    isMember: existingJob.isMember
  };

  const updatedJob = buildJobPayload(req, user, existingJob);
  const validationMessage = validateJobPayload(updatedJob);
  if (validationMessage) {
    return res.status(400).json({ success: false, message: validationMessage });
  }

  jobs[jobIndex] = updatedJob;
  saveJobs(jobs);

  res.json({ success: true, message: 'Job updated successfully.', data: updatedJob });
}

function getAllJobs(req, res) {
  const {
    q = '',
    search = '',
    workMode = '',
    location = '',
    minExperience = '',
    maxExperience = '',
    userId = '',
    skill = '',
    jobType = '',
    minSalary = '',
    maxSalary = ''
  } = req.query;

  const keyword = q || search;
  let jobs = getJobs();

  if (userId) {
    jobs = jobs.filter(job => String(job.userId) === String(userId));
  }

  if (keyword) {
    jobs = jobs.filter(job => fuzzyIncludes(objectToSearchText(job, [
      'jobTitle',
      'companyInformation',
      'jobDescription',
      'requiredEducationLevel',
      'requiredSkills',
      'workMode',
      'jobLocation',
      'jobType',
      'employerEmail'
    ]), keyword));
  }

  if (skill) {
    jobs = jobs.filter(job => fuzzyIncludes((job.requiredSkills || []).join(' '), skill));
  }

  if (workMode) {
    jobs = jobs.filter(job => fuzzyIncludes(job.workMode, workMode));
  }

  if (location) {
    jobs = jobs.filter(job => fuzzyIncludes(job.jobLocation, location));
  }

  if (jobType) {
    jobs = jobs.filter(job => fuzzyIncludes(job.jobType, jobType));
  }

  if (minExperience !== '') {
    const minimum = toNumber(minExperience);
    jobs = jobs.filter(job => job.yearsOfExperience >= minimum);
  }

  if (maxExperience !== '') {
    const maximum = toNumber(maxExperience);
    jobs = jobs.filter(job => job.yearsOfExperience <= maximum);
  }

  if (minSalary !== '') {
    const minimumSalary = toNumber(minSalary);
    jobs = jobs.filter(job => toNumber(job.salaryMax || job.salaryMin) >= minimumSalary);
  }

  if (maxSalary !== '') {
    const maximumSalary = toNumber(maxSalary);
    jobs = jobs.filter(job => toNumber(job.salaryMin || job.salaryMax) <= maximumSalary);
  }

  res.json({ success: true, count: jobs.length, data: jobs });
}

function getJobById(req, res) {
  const job = getJobs().find(item => item.id === req.params.id);

  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }

  res.json({ success: true, data: job });
}

module.exports = {
  createJob,
  updateJob,
  getAllJobs,
  getJobById
};

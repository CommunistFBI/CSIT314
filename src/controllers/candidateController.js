const store = require('../data/store');
const { parseArrayField, toNumber } = require('../utils/parseHelpers');
const { fuzzyIncludes, objectToSearchText } = require('../utils/searchHelpers');

function buildCandidatePayload(req, user, existingCandidate = null) {
  const now = new Date().toISOString();
  const files = req.files || {};
  const resumeFile = files.resume?.[0] || null;
  const coverLetterFile = files.coverLetter?.[0] || null;
  const imageFile = files.profileImage?.[0] || null;

  return {
    id: existingCandidate?.id || store.generateId('cand'),
    userId: user.id,
    userEmail: user.email,
    fullName: String(req.body.fullName || existingCandidate?.fullName || '').trim(),
    contactInformation: String(req.body.contactInformation || existingCandidate?.contactInformation || '').trim(),
    education: String(req.body.education || existingCandidate?.education || '').trim(),
    major: String(req.body.major || existingCandidate?.major || '').trim(),
    yearsOfExperience: req.body.yearsOfExperience !== undefined
      ? toNumber(req.body.yearsOfExperience)
      : toNumber(existingCandidate?.yearsOfExperience),
    workExperience: String(req.body.workExperience || existingCandidate?.workExperience || '').trim(),
    skills: req.body.skills !== undefined
      ? parseArrayField(req.body.skills)
      : (existingCandidate?.skills || []),
    preferredWorkingMode: String(req.body.preferredWorkingMode || existingCandidate?.preferredWorkingMode || '').trim(),
    preferredLocation: String(req.body.preferredLocation || existingCandidate?.preferredLocation || '').trim(),
    preferences: req.body.preferences !== undefined
      ? parseArrayField(req.body.preferences)
      : (existingCandidate?.preferences || []),
    resumeFileName: resumeFile ? resumeFile.originalname : (existingCandidate?.resumeFileName || null),
    resumePath: resumeFile ? `/uploads/${resumeFile.filename}` : (existingCandidate?.resumePath || null),
    coverLetterFileName: coverLetterFile ? coverLetterFile.originalname : (existingCandidate?.coverLetterFileName || null),
    coverLetterPath: coverLetterFile ? `/uploads/${coverLetterFile.filename}` : (existingCandidate?.coverLetterPath || null),
    profileImageFileName: imageFile ? imageFile.originalname : (existingCandidate?.profileImageFileName || null),
    profileImagePath: imageFile ? `/uploads/${imageFile.filename}` : (existingCandidate?.profileImagePath || null),
    isMember: Boolean(user.isMember),
    membershipType: user.isMember ? 'membership' : 'non-membership',
    createdAt: existingCandidate?.createdAt || now,
    updatedAt: now,
  };
}

function validateCandidatePayload(candidate) {
  if (!candidate.fullName || !candidate.contactInformation || !candidate.education || !candidate.major) {
    return 'fullName, contactInformation, education, and major are required.';
  }
  if (!candidate.workExperience) {
    return 'workExperience is required for the enhanced candidate profile.';
  }
  if (!candidate.skills.length) {
    return 'At least one skill is required.';
  }
  if (!candidate.preferredWorkingMode || !candidate.preferredLocation) {
    return 'preferredWorkingMode and preferredLocation are required.';
  }
  return '';
}

async function createCandidate(req, res) {
  const userId = String(req.body.userId || '').trim();

  if (!userId) {
    return res.status(400).json({ success: false, message: 'userId is required to create a candidate profile.' });
  }

  const user = await store.findUserById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  if (user.role !== 'candidate') {
    return res.status(403).json({ success: false, message: 'Only candidate accounts can create candidate profiles.' });
  }

  const existingCandidate = await store.findCandidateByUserId(userId);
  if (existingCandidate) {
    return res.status(409).json({ success: false, message: 'This user already has a candidate profile.', data: existingCandidate });
  }

  const newCandidate = buildCandidatePayload(req, user);
  const validationMessage = validateCandidatePayload(newCandidate);
  if (validationMessage) {
    return res.status(400).json({ success: false, message: validationMessage });
  }

  const created = await store.insertCandidate(newCandidate);
  res.status(201).json({ success: true, message: 'Candidate profile created successfully.', data: created });
}

async function updateCandidate(req, res) {
  const existingCandidate = await store.findCandidateById(req.params.id);
  if (!existingCandidate) {
    return res.status(404).json({ success: false, message: 'Candidate not found.' });
  }

  const user = (await store.findUserById(existingCandidate.userId)) || {
    id: existingCandidate.userId,
    email: existingCandidate.userEmail,
    isMember: existingCandidate.isMember,
  };

  const updatedCandidate = buildCandidatePayload(req, user, existingCandidate);
  const validationMessage = validateCandidatePayload(updatedCandidate);
  if (validationMessage) {
    return res.status(400).json({ success: false, message: validationMessage });
  }

  const result = await store.updateCandidateById(req.params.id, updatedCandidate);
  res.json({ success: true, message: 'Candidate profile updated successfully.', data: result });
}

async function getAllCandidates(req, res) {
  const {
    q = '',
    search = '',
    skill = '',
    education = '',
    minExperience = '',
    preferredWorkingMode = '',
    preferredLocation = '',
    location = '',
    userId = '',
  } = req.query;

  const keyword = q || search;
  let candidates = await store.getCandidates();

  if (userId) {
    candidates = candidates.filter(c => String(c.userId) === String(userId));
  }
  if (keyword) {
    candidates = candidates.filter(c => fuzzyIncludes(objectToSearchText(c, [
      'fullName', 'contactInformation', 'education', 'major', 'workExperience',
      'skills', 'preferredWorkingMode', 'preferredLocation', 'preferences', 'userEmail',
    ]), keyword));
  }
  if (skill) {
    candidates = candidates.filter(c => fuzzyIncludes((c.skills || []).join(' '), skill));
  }
  if (education) {
    candidates = candidates.filter(c => fuzzyIncludes(c.education, education));
  }
  if (preferredWorkingMode) {
    candidates = candidates.filter(c => fuzzyIncludes(c.preferredWorkingMode, preferredWorkingMode));
  }
  const locationFilter = preferredLocation || location;
  if (locationFilter) {
    candidates = candidates.filter(c => fuzzyIncludes(c.preferredLocation, locationFilter));
  }
  if (minExperience !== '') {
    const minimum = toNumber(minExperience);
    candidates = candidates.filter(c => c.yearsOfExperience >= minimum);
  }

  res.json({ success: true, count: candidates.length, data: candidates });
}

async function getCandidateById(req, res) {
  const candidate = await store.findCandidateById(req.params.id);
  if (!candidate) {
    return res.status(404).json({ success: false, message: 'Candidate not found.' });
  }
  res.json({ success: true, data: candidate });
}

async function getCandidateByUserId(req, res) {
  const candidate = await store.findCandidateByUserId(req.params.userId);
  if (!candidate) {
    return res.status(404).json({ success: false, message: 'Candidate profile not found for this user.' });
  }
  res.json({ success: true, data: candidate });
}

module.exports = {
  createCandidate,
  updateCandidate,
  getAllCandidates,
  getCandidateById,
  getCandidateByUserId,
};

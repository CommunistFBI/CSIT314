const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const CANDIDATES_FILE = path.join(DATA_DIR, 'candidates.json');
const JOBS_FILE = path.join(DATA_DIR, 'jobs.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureFile(filePath, defaultValue = []) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
  }
}

function readJson(filePath) {
  ensureFile(filePath);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getCandidates() {
  return readJson(CANDIDATES_FILE);
}

function saveCandidates(candidates) {
  writeJson(CANDIDATES_FILE, candidates);
}

function getJobs() {
  return readJson(JOBS_FILE);
}

function saveJobs(jobs) {
  writeJson(JOBS_FILE, jobs);
}

function getUsers() {
  return readJson(USERS_FILE);
}

function saveUsers(users) {
  writeJson(USERS_FILE, users);
}

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

function seedDataIfEmpty() {
  ensureFile(CANDIDATES_FILE, []);
  ensureFile(JOBS_FILE, []);
  ensureFile(USERS_FILE, []);

  const candidates = getCandidates();
  const jobs = getJobs();

  if (candidates.length === 0) {
    saveCandidates([
      {
        id: generateId('cand'),
        userId: null,
        userEmail: null,
        fullName: 'Aisha Khan',
        contactInformation: 'aisha.khan@email.com | +61 400 111 222',
        education: 'Bachelor of Computer Science',
        major: 'Software Engineering',
        yearsOfExperience: 2,
        workExperience: 'Built full stack university and internship projects using React, Node.js, Express and SQL.',
        skills: ['JavaScript', 'Node.js', 'React', 'SQL'],
        preferredWorkingMode: 'Remote',
        preferredLocation: 'Sydney',
        preferences: ['remote', 'software engineer', 'full stack'],
        isMember: false,
        membershipType: 'non-membership',
        resumeFileName: null,
        resumePath: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: generateId('cand'),
        userId: null,
        userEmail: null,
        fullName: 'Bilal Ahmed',
        contactInformation: 'bilal.ahmed@email.com | +61 400 222 333',
        education: 'Master of Data Science',
        major: 'Data Science',
        yearsOfExperience: 3,
        workExperience: 'Analysed datasets, created dashboards, cleaned data with Python and wrote SQL reports.',
        skills: ['Python', 'Machine Learning', 'Pandas', 'SQL'],
        preferredWorkingMode: 'Hybrid',
        preferredLocation: 'Melbourne',
        preferences: ['hybrid', 'data analyst', 'machine learning'],
        isMember: false,
        membershipType: 'non-membership',
        resumeFileName: null,
        resumePath: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: generateId('cand'),
        userId: null,
        userEmail: null,
        fullName: 'Sara Noor',
        contactInformation: 'sara.noor@email.com | +61 400 333 444',
        education: 'Bachelor of Information Technology',
        major: 'Cybersecurity',
        yearsOfExperience: 1,
        workExperience: 'Supported Linux systems, network troubleshooting and basic security documentation.',
        skills: ['Networking', 'Linux', 'Security', 'Documentation'],
        preferredWorkingMode: 'On-site',
        preferredLocation: 'Wollongong',
        preferences: ['on-site', 'security analyst'],
        isMember: false,
        membershipType: 'non-membership',
        resumeFileName: null,
        resumePath: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);
  }

  if (jobs.length === 0) {
    saveJobs([
      {
        id: generateId('job'),
        userId: null,
        employerEmail: null,
        jobTitle: 'Junior Full Stack Developer',
        companyInformation: 'TechNova Pty Ltd',
        jobDescription: 'Build web applications using JavaScript, Node.js, React and SQL. Collaborate with frontend and backend teams.',
        requiredEducationLevel: 'Bachelor degree',
        requiredSkills: ['JavaScript', 'Node.js', 'React', 'SQL'],
        yearsOfExperience: 1,
        workMode: 'Remote',
        jobLocation: 'Sydney',
        jobType: 'Full-time',
        salaryMin: 70000,
        salaryMax: 90000,
        isMember: false,
        membershipType: 'non-membership',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: generateId('job'),
        userId: null,
        employerEmail: null,
        jobTitle: 'Data Analyst',
        companyInformation: 'InsightWave Analytics',
        jobDescription: 'Analyse datasets with Python, SQL and dashboards. Communicate findings to stakeholders and support data-driven decisions.',
        requiredEducationLevel: 'Bachelor degree',
        requiredSkills: ['Python', 'SQL', 'Analytics', 'Dashboarding'],
        yearsOfExperience: 2,
        workMode: 'Hybrid',
        jobLocation: 'Melbourne',
        jobType: 'Full-time',
        salaryMin: 75000,
        salaryMax: 95000,
        isMember: false,
        membershipType: 'non-membership',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: generateId('job'),
        userId: null,
        employerEmail: null,
        jobTitle: 'IT Support and Security Assistant',
        companyInformation: 'SecureBridge Solutions',
        jobDescription: 'Support internal systems, troubleshoot user issues, maintain Linux environments and follow basic security procedures.',
        requiredEducationLevel: 'Diploma or Bachelor degree',
        requiredSkills: ['Linux', 'Networking', 'Security', 'Troubleshooting'],
        yearsOfExperience: 1,
        workMode: 'On-site',
        jobLocation: 'Wollongong',
        jobType: 'Entry-level',
        salaryMin: 55000,
        salaryMax: 70000,
        isMember: false,
        membershipType: 'non-membership',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);
  }
}

module.exports = {
  getCandidates,
  saveCandidates,
  getJobs,
  saveJobs,
  getUsers,
  saveUsers,
  generateId,
  seedDataIfEmpty
};

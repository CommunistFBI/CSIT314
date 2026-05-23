require('dotenv').config();
const store = require('./data/store');

const PASSWORD = 'Password123';

const candidateData = [
  { email: 'alice.johnson@email.com', name: 'Alice Johnson', contact: '0411 111 001', education: "Bachelor's Degree", major: 'Computer Science', exp: 3, workExp: 'Frontend developer at WebCo for 3 years building React dashboards and SPAs.', skills: ['JavaScript', 'React', 'Node.js', 'CSS'], mode: 'Remote', location: 'Sydney, NSW', prefs: ['Tech', 'Startup', 'Remote-first'] },
  { email: 'bob.chen@email.com', name: 'Bob Chen', contact: '0411 111 002', education: "Master's Degree", major: 'Data Science', exp: 5, workExp: 'Data scientist at AnalyticsCo building ML models for churn prediction and forecasting.', skills: ['Python', 'SQL', 'Machine Learning', 'TensorFlow'], mode: 'Hybrid', location: 'Melbourne, VIC', prefs: ['Finance', 'Data', 'AI'] },
  { email: 'carol.smith@email.com', name: 'Carol Smith', contact: '0411 111 003', education: "Bachelor's Degree", major: 'Design', exp: 2, workExp: 'UX designer at DesignHub creating wireframes, prototypes and user flows for mobile apps.', skills: ['Figma', 'CSS', 'UI Design', 'Prototyping'], mode: 'Remote', location: 'Brisbane, QLD', prefs: ['Creative', 'Remote-first', 'Product'] },
  { email: 'david.kim@email.com', name: 'David Kim', contact: '0411 111 004', education: "Bachelor's Degree", major: 'Software Engineering', exp: 4, workExp: 'Backend developer at EnterpriseSoft building REST APIs and microservices in Java.', skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'], mode: 'On-site', location: 'Sydney, NSW', prefs: ['Enterprise', 'Finance'] },
  { email: 'emma.wilson@email.com', name: 'Emma Wilson', contact: '0411 111 005', education: "Bachelor's Degree", major: 'Information Technology', exp: 6, workExp: 'DevOps engineer managing cloud infrastructure for SaaS products on AWS and Azure.', skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform'], mode: 'Remote', location: 'Perth, WA', prefs: ['Cloud', 'Remote-first'] },
  { email: 'frank.nguyen@email.com', name: 'Frank Nguyen', contact: '0411 111 006', education: "Bachelor's Degree", major: 'Computer Science', exp: 3, workExp: 'Full stack developer building e-commerce platforms using React and Node.js.', skills: ['React', 'Node.js', 'MongoDB', 'AWS'], mode: 'Hybrid', location: 'Sydney, NSW', prefs: ['Startup', 'Tech', 'E-commerce'] },
  { email: 'grace.lee@email.com', name: 'Grace Lee', contact: '0411 111 007', education: "Bachelor's Degree", major: 'Computer Science', exp: 4, workExp: 'iOS developer with 5 published apps on the App Store totalling 100k+ downloads.', skills: ['Swift', 'iOS', 'SwiftUI', 'Xcode'], mode: 'On-site', location: 'Melbourne, VIC', prefs: ['Mobile', 'Product', 'Health'] },
  { email: 'henry.brown@email.com', name: 'Henry Brown', contact: '0411 111 008', education: "Bachelor's Degree", major: 'Statistics', exp: 2, workExp: 'Data analyst creating Tableau dashboards and weekly reports for business stakeholders.', skills: ['Python', 'Tableau', 'SQL', 'Excel'], mode: 'Hybrid', location: 'Adelaide, SA', prefs: ['Finance', 'Data', 'Consulting'] },
  { email: 'iris.taylor@email.com', name: 'Iris Taylor', contact: '0411 111 009', education: "Bachelor's Degree", major: 'Computer Science', exp: 3, workExp: 'Frontend developer specialising in Vue.js applications for fintech clients.', skills: ['Vue.js', 'TypeScript', 'CSS', 'JavaScript'], mode: 'Remote', location: 'Sydney, NSW', prefs: ['Fintech', 'Remote-first', 'Tech'] },
  { email: 'james.martin@email.com', name: 'James Martin', contact: '0411 111 010', education: "Master's Degree", major: 'Artificial Intelligence', exp: 5, workExp: 'ML engineer developing deep learning models for NLP and computer vision at AI startup.', skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP'], mode: 'Remote', location: 'Brisbane, QLD', prefs: ['AI', 'Research', 'Startup'] },
  { email: 'kate.davis@email.com', name: 'Kate Davis', contact: '0411 111 011', education: "Bachelor's Degree", major: 'Cybersecurity', exp: 4, workExp: 'Security analyst conducting penetration testing and vulnerability assessments for banks.', skills: ['Cybersecurity', 'Python', 'Linux', 'Networking'], mode: 'On-site', location: 'Sydney, NSW', prefs: ['Security', 'Enterprise', 'Finance'] },
  { email: 'liam.anderson@email.com', name: 'Liam Anderson', contact: '0411 111 012', education: "Bachelor's Degree", major: 'Cloud Computing', exp: 5, workExp: 'Cloud engineer designing and deploying multi-cloud architectures for enterprise clients.', skills: ['AWS', 'Azure', 'Terraform', 'Kubernetes'], mode: 'Remote', location: 'Melbourne, VIC', prefs: ['Cloud', 'Remote-first', 'Enterprise'] },
];

const employerData = [
  { email: 'hiring@techcorp.com',        company: 'TechCorp',      isMember: true  },
  { email: 'jobs@startupxyz.com',         company: 'StartupXYZ',    isMember: false },
  { email: 'recruit@financeplus.com',     company: 'FinancePlus',   isMember: true  },
  { email: 'talent@healthtech.com',       company: 'HealthTech',    isMember: false },
  { email: 'careers@cloudsystems.com',    company: 'CloudSystems',  isMember: true  },
  { email: 'hr@datavision.com',           company: 'DataVision',    isMember: false },
];

const jobData = [
  { employer: 'hiring@techcorp.com',      title: 'Senior Frontend Developer',       company: 'TechCorp — Sydney tech company',            desc: 'Join our frontend team building React applications for millions of users worldwide.',           edu: "Bachelor's Degree in Computer Science", skills: ['React', 'JavaScript', 'TypeScript', 'CSS'],        mode: 'Remote',   loc: 'Sydney, NSW',    type: 'Full-time', min: 100000, max: 140000, exp: 3 },
  { employer: 'hiring@techcorp.com',      title: 'Backend Engineer',                company: 'TechCorp — Sydney tech company',            desc: 'Build scalable backend services and APIs powering our high-traffic platform.',                edu: "Bachelor's Degree in Computer Science", skills: ['Node.js', 'PostgreSQL', 'Redis', 'AWS'],           mode: 'Hybrid',   loc: 'Sydney, NSW',    type: 'Full-time', min: 110000, max: 150000, exp: 4 },
  { employer: 'jobs@startupxyz.com',      title: 'Full Stack Developer',            company: 'StartupXYZ — Fast-growing SaaS startup',   desc: 'Work across the full stack building our product from the ground up in a small agile team.',  edu: "Bachelor's Degree",                    skills: ['React', 'Node.js', 'MongoDB', 'AWS'],              mode: 'Remote',   loc: 'Melbourne, VIC', type: 'Full-time', min: 90000,  max: 120000, exp: 2 },
  { employer: 'jobs@startupxyz.com',      title: 'Product Designer',                company: 'StartupXYZ — Fast-growing SaaS startup',   desc: 'Design beautiful intuitive interfaces for our B2B platform used by thousands of teams.',     edu: "Bachelor's Degree in Design",          skills: ['Figma', 'UI Design', 'CSS', 'Prototyping'],        mode: 'Remote',   loc: 'Brisbane, QLD',  type: 'Full-time', min: 85000,  max: 110000, exp: 2 },
  { employer: 'recruit@financeplus.com',  title: 'Data Scientist',                  company: 'FinancePlus — Leading financial services',  desc: 'Build ML models for risk assessment, fraud detection and customer analytics.',               edu: "Master's Degree in Data Science",      skills: ['Python', 'SQL', 'Machine Learning', 'TensorFlow'], mode: 'On-site',  loc: 'Sydney, NSW',    type: 'Full-time', min: 120000, max: 160000, exp: 4 },
  { employer: 'recruit@financeplus.com',  title: 'Data Analyst',                    company: 'FinancePlus — Leading financial services',  desc: 'Analyse financial data and produce insights to guide business strategy.',                    edu: "Bachelor's Degree in Statistics",      skills: ['SQL', 'Python', 'Tableau', 'Excel'],               mode: 'Hybrid',   loc: 'Sydney, NSW',    type: 'Full-time', min: 80000,  max: 105000, exp: 2 },
  { employer: 'talent@healthtech.com',    title: 'Machine Learning Engineer',       company: 'HealthTech — Digital health innovator',     desc: 'Apply ML to medical imaging and patient data to improve healthcare outcomes at scale.',      edu: "Master's Degree in AI or Computer Science", skills: ['Python', 'TensorFlow', 'PyTorch', 'Docker'],   mode: 'Hybrid',   loc: 'Brisbane, QLD',  type: 'Full-time', min: 130000, max: 170000, exp: 5 },
  { employer: 'talent@healthtech.com',    title: 'iOS Developer',                   company: 'HealthTech — Digital health innovator',     desc: 'Build our patient-facing iOS app used by thousands of patients every day.',                 edu: "Bachelor's Degree in Computer Science", skills: ['Swift', 'iOS', 'SwiftUI', 'Xcode'],               mode: 'On-site',  loc: 'Melbourne, VIC', type: 'Full-time', min: 100000, max: 135000, exp: 3 },
  { employer: 'careers@cloudsystems.com', title: 'Cloud Architect',                 company: 'CloudSystems — Enterprise cloud solutions', desc: 'Design and implement cloud architectures for large enterprise clients across APAC.',          edu: "Bachelor's Degree in IT",              skills: ['AWS', 'Azure', 'Terraform', 'Kubernetes'],         mode: 'Remote',   loc: 'Perth, WA',      type: 'Full-time', min: 150000, max: 200000, exp: 7 },
  { employer: 'careers@cloudsystems.com', title: 'DevOps Engineer',                 company: 'CloudSystems — Enterprise cloud solutions', desc: 'Build and maintain CI/CD pipelines and cloud infrastructure for enterprise clients.',         edu: "Bachelor's Degree in IT",              skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins'],          mode: 'Hybrid',   loc: 'Sydney, NSW',    type: 'Full-time', min: 110000, max: 145000, exp: 4 },
  { employer: 'hr@datavision.com',        title: 'Business Intelligence Developer', company: 'DataVision — Data analytics consultancy',  desc: 'Build BI dashboards and reports for enterprise clients using Power BI and Tableau.',        edu: "Bachelor's Degree in Business or IT",  skills: ['Power BI', 'SQL', 'Tableau', 'DAX'],               mode: 'Hybrid',   loc: 'Melbourne, VIC', type: 'Full-time', min: 90000,  max: 120000, exp: 3 },
  { employer: 'hr@datavision.com',        title: 'Data Engineer',                   company: 'DataVision — Data analytics consultancy',  desc: 'Design and build data pipelines and warehouses for large-scale data processing.',           edu: "Bachelor's Degree in Computer Science", skills: ['Python', 'SQL', 'Apache Spark', 'AWS'],            mode: 'Hybrid',   loc: 'Sydney, NSW',    type: 'Full-time', min: 110000, max: 145000, exp: 4 },
];

async function seed() {
  console.log('Seeding database...\n');
  const now = new Date().toISOString();

  for (const c of candidateData) {
    const userId = store.generateId('user');
    await store.insertUser({ id: userId, email: c.email, role: 'candidate', passwordSalt: null, passwordHash: PASSWORD, isMember: false, membershipType: 'non-membership', createdAt: now, updatedAt: now });
    await store.insertCandidate({ id: store.generateId('cand'), userId, userEmail: c.email, fullName: c.name, contactInformation: c.contact, education: c.education, major: c.major, yearsOfExperience: c.exp, workExperience: c.workExp, skills: c.skills, preferredWorkingMode: c.mode, preferredLocation: c.location, preferences: c.prefs, resumeFileName: null, resumePath: null, coverLetterFileName: null, coverLetterPath: null, profileImageFileName: null, profileImagePath: null, isMember: false, membershipType: 'non-membership', createdAt: now, updatedAt: now });
    console.log(`[candidate] ${c.email}`);
  }

  const employerUsers = {};
  for (const e of employerData) {
    const userId = store.generateId('user');
    const user = await store.insertUser({ id: userId, email: e.email, role: 'employer', passwordSalt: null, passwordHash: PASSWORD, isMember: e.isMember, membershipType: e.isMember ? 'membership' : 'non-membership', createdAt: now, updatedAt: now });
    employerUsers[e.email] = user;
    console.log(`[employer]  ${e.email}  member=${e.isMember}`);
  }

  for (const j of jobData) {
    const employer = employerUsers[j.employer];
    await store.insertJob({ id: store.generateId('job'), userId: employer.id, employerEmail: j.employer, jobTitle: j.title, companyInformation: j.company, jobDescription: j.desc, requiredEducationLevel: j.edu, requiredSkills: j.skills, yearsOfExperience: j.exp, workMode: j.mode, jobLocation: j.loc, jobType: j.type, salaryMin: j.min, salaryMax: j.max, isMember: employer.isMember, membershipType: employer.isMember ? 'membership' : 'non-membership', createdAt: now, updatedAt: now });
    console.log(`[job]       ${j.title}`);
  }

  console.log('\nDone! 12 candidates, 6 employers, 12 jobs inserted.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});

const pool = require('../config/db');

function mapUser(row) {
  if (!row) return null;
  return {
    id: row.userid,
    email: row.email,
    role: row.role,
    passwordSalt: row.passwordsalt,
    passwordHash: row.passwordhash,
    isMember: row.ismember,
    membershipType: row.membershiptype,
    createdAt: row.createdat,
    updatedAt: row.updatedat,
  };
}

function mapCandidate(row, skills = []) {
  if (!row) return null;
  return {
    id: row.candidateid,
    userId: row.userid,
    userEmail: row.useremail,
    fullName: row.fullname,
    contactInformation: row.contactinformation,
    education: row.education,
    major: row.major,
    yearsOfExperience: row.yearsofexperience,
    workExperience: row.workexperience,
    skills,
    preferredWorkingMode: row.preferredworkingmode,
    preferredLocation: row.preferredlocation,
    preferences: row.preferences || [],
    resumeFileName: row.resumefilename,
    resumePath: row.resumepath,
    coverLetterFileName: row.coverletterfilename,
    coverLetterPath: row.coverletterpath,
    profileImageFileName: row.profileimagefilename,
    profileImagePath: row.profileimagepath,
    isMember: row.ismember,
    membershipType: row.membershiptype,
    createdAt: row.createdat,
    updatedAt: row.updatedat,
  };
}

function mapJob(row, requiredSkills = []) {
  if (!row) return null;
  return {
    id: row.jobid,
    userId: row.userid,
    employerEmail: row.employeremail,
    jobTitle: row.jobtitle,
    companyInformation: row.companyinformation,
    jobDescription: row.jobdescription,
    requiredEducationLevel: row.requirededucationlevel,
    yearsOfExperience: row.yearsofexperience,
    workMode: row.workmode,
    jobLocation: row.joblocation,
    jobType: row.jobtype,
    salaryMin: row.salarymin,
    salaryMax: row.salarymax,
    requiredSkills,
    isMember: row.ismember,
    membershipType: row.membershiptype,
    createdAt: row.createdat,
    updatedAt: row.updatedat,
  };
}

function mapApplication(row) {
  if (!row) return null;
  return {
    id: row.applicationid,
    jobId: row.jobid,
    candidateId: row.candidateid,
    status: row.status,
    appliedAt: row.appliedat,
    jobTitle: row.jobtitle || null,
    companyInformation: row.companyinformation || null,
    employerEmail: row.employeremail || null,
    candidateName: row.fullname || null,
    candidateEmail: row.useremail || null,
    resumePath: row.resumepath || null,
    resumeFileName: row.resumefilename || null,
    coverLetterPath: row.coverletterpath || null,
    coverLetterFileName: row.coverletterfilename || null,
  };
}

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

async function _getSkillsMap(table, idCol, ids) {
  if (!ids.length) return {};
  const { rows } = await pool.query(
    `SELECT ${idCol}, skillname FROM "${table}" WHERE ${idCol} = ANY($1)`,
    [ids]
  );
  return rows.reduce((acc, r) => {
    const key = r[idCol];
    if (!acc[key]) acc[key] = [];
    acc[key].push(r.skillname);
    return acc;
  }, {});
}

async function _upsertSkills(table, idCol, id, skills) {
  await pool.query(`DELETE FROM "${table}" WHERE ${idCol} = $1`, [id]);
  for (const skill of (skills || [])) {
    await pool.query(
      `INSERT INTO "${table}" (${idCol}, skillname) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [id, skill]
    );
  }
}

// --- Users ---

async function getUsers() {
  const { rows } = await pool.query('SELECT * FROM "User" ORDER BY createdat DESC');
  return rows.map(mapUser);
}

async function findUserById(id) {
  const { rows } = await pool.query('SELECT * FROM "User" WHERE userid = $1', [id]);
  return mapUser(rows[0] || null);
}

async function findUserByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM "User" WHERE LOWER(email) = LOWER($1)', [email]);
  return mapUser(rows[0] || null);
}

async function insertUser(user) {
  const { rows } = await pool.query(
    `INSERT INTO "User" (userid, email, passwordhash, passwordsalt, role, ismember, membershiptype, createdat, updatedat)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [user.id, user.email, user.passwordHash, user.passwordSalt, user.role,
     user.isMember, user.membershipType, user.createdAt, user.updatedAt]
  );
  return mapUser(rows[0]);
}

async function updateUserById(id, updates) {
  const fields = ['updatedat = NOW()'];
  const values = [id];
  let i = 2;

  if (updates.isMember !== undefined) {
    fields.push(`ismember = $${i++}`);
    values.push(updates.isMember);
  }
  if (updates.membershipType !== undefined) {
    fields.push(`membershiptype = $${i++}`);
    values.push(updates.membershipType);
  }

  const { rows } = await pool.query(
    `UPDATE "User" SET ${fields.join(', ')} WHERE userid = $1 RETURNING *`,
    values
  );
  return mapUser(rows[0] || null);
}

async function saveUsers(users) {
  for (const u of users) {
    const existing = await findUserById(u.id);
    if (!existing) {
      await insertUser(u);
    } else {
      await updateUserById(u.id, u);
    }
  }
}

// --- Candidates ---

async function getCandidates() {
  const { rows } = await pool.query('SELECT * FROM "Candidate" ORDER BY createdat DESC');
  const skillMap = await _getSkillsMap('CandidateSkill', 'candidateid', rows.map(r => r.candidateid));
  return rows.map(r => mapCandidate(r, skillMap[r.candidateid] || []));
}

async function findCandidateById(id) {
  const { rows } = await pool.query('SELECT * FROM "Candidate" WHERE candidateid = $1', [id]);
  if (!rows[0]) return null;
  const skillMap = await _getSkillsMap('CandidateSkill', 'candidateid', [id]);
  return mapCandidate(rows[0], skillMap[id] || []);
}

async function findCandidateByUserId(userId) {
  const { rows } = await pool.query('SELECT * FROM "Candidate" WHERE userid = $1', [userId]);
  if (!rows[0]) return null;
  const id = rows[0].candidateid;
  const skillMap = await _getSkillsMap('CandidateSkill', 'candidateid', [id]);
  return mapCandidate(rows[0], skillMap[id] || []);
}

async function insertCandidate(candidate) {
  const { rows } = await pool.query(
    `INSERT INTO "Candidate"
       (candidateid, userid, useremail, fullname, contactinformation, education, major,
        yearsofexperience, workexperience, preferredworkingmode, preferredlocation,
        preferences, resumefilename, resumepath, coverletterfilename, coverletterpath,
        profileimagefilename, profileimagepath, ismember, membershiptype, createdat, updatedat)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
     RETURNING *`,
    [
      candidate.id, candidate.userId, candidate.userEmail, candidate.fullName,
      candidate.contactInformation, candidate.education, candidate.major,
      candidate.yearsOfExperience, candidate.workExperience,
      candidate.preferredWorkingMode, candidate.preferredLocation,
      JSON.stringify(candidate.preferences || []),
      candidate.resumeFileName, candidate.resumePath,
      candidate.coverLetterFileName, candidate.coverLetterPath,
      candidate.profileImageFileName, candidate.profileImagePath,
      candidate.isMember, candidate.membershipType,
      candidate.createdAt, candidate.updatedAt,
    ]
  );
  await _upsertSkills('CandidateSkill', 'candidateid', candidate.id, candidate.skills);
  return mapCandidate(rows[0], candidate.skills || []);
}

async function updateCandidateById(id, updates) {
  const { rows } = await pool.query(
    `UPDATE "Candidate" SET
       useremail=$2, fullname=$3, contactinformation=$4, education=$5, major=$6,
       yearsofexperience=$7, workexperience=$8, preferredworkingmode=$9,
       preferredlocation=$10, preferences=$11, resumefilename=$12, resumepath=$13,
       coverletterfilename=$14, coverletterpath=$15, profileimagefilename=$16,
       profileimagepath=$17, ismember=$18, membershiptype=$19, updatedat=NOW()
     WHERE candidateid=$1
     RETURNING *`,
    [
      id,
      updates.userEmail, updates.fullName, updates.contactInformation,
      updates.education, updates.major, updates.yearsOfExperience,
      updates.workExperience, updates.preferredWorkingMode, updates.preferredLocation,
      JSON.stringify(updates.preferences || []),
      updates.resumeFileName, updates.resumePath,
      updates.coverLetterFileName, updates.coverLetterPath,
      updates.profileImageFileName, updates.profileImagePath,
      updates.isMember, updates.membershipType,
    ]
  );
  await _upsertSkills('CandidateSkill', 'candidateid', id, updates.skills);
  return mapCandidate(rows[0], updates.skills || []);
}

async function saveCandidates(candidates) {
  for (const c of candidates) {
    const existing = await findCandidateById(c.id);
    if (!existing) {
      await insertCandidate(c);
    } else {
      await updateCandidateById(c.id, c);
    }
  }
}

// --- Jobs ---

async function getJobs() {
  const { rows } = await pool.query('SELECT * FROM "JobPosting" ORDER BY createdat DESC');
  const skillMap = await _getSkillsMap('JobSkill', 'jobid', rows.map(r => r.jobid));
  return rows.map(r => mapJob(r, skillMap[r.jobid] || []));
}

async function findJobById(id) {
  const { rows } = await pool.query('SELECT * FROM "JobPosting" WHERE jobid = $1', [id]);
  if (!rows[0]) return null;
  const skillMap = await _getSkillsMap('JobSkill', 'jobid', [id]);
  return mapJob(rows[0], skillMap[id] || []);
}

async function insertJob(job) {
  const { rows } = await pool.query(
    `INSERT INTO "JobPosting"
       (jobid, userid, employeremail, jobtitle, companyinformation, jobdescription,
        requirededucationlevel, yearsofexperience, workmode, joblocation, jobtype,
        salarymin, salarymax, ismember, membershiptype, createdat, updatedat)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
     RETURNING *`,
    [
      job.id, job.userId, job.employerEmail, job.jobTitle, job.companyInformation,
      job.jobDescription, job.requiredEducationLevel, job.yearsOfExperience,
      job.workMode, job.jobLocation, job.jobType,
      job.salaryMin, job.salaryMax,
      job.isMember, job.membershipType,
      job.createdAt, job.updatedAt,
    ]
  );
  await _upsertSkills('JobSkill', 'jobid', job.id, job.requiredSkills);
  return mapJob(rows[0], job.requiredSkills || []);
}

async function updateJobById(id, updates) {
  const { rows } = await pool.query(
    `UPDATE "JobPosting" SET
       employeremail=$2, jobtitle=$3, companyinformation=$4, jobdescription=$5,
       requirededucationlevel=$6, yearsofexperience=$7, workmode=$8, joblocation=$9,
       jobtype=$10, salarymin=$11, salarymax=$12, ismember=$13, membershiptype=$14,
       updatedat=NOW()
     WHERE jobid=$1
     RETURNING *`,
    [
      id,
      updates.employerEmail, updates.jobTitle, updates.companyInformation,
      updates.jobDescription, updates.requiredEducationLevel, updates.yearsOfExperience,
      updates.workMode, updates.jobLocation, updates.jobType,
      updates.salaryMin, updates.salaryMax,
      updates.isMember, updates.membershipType,
    ]
  );
  await _upsertSkills('JobSkill', 'jobid', id, updates.requiredSkills);
  return mapJob(rows[0], updates.requiredSkills || []);
}

async function saveJobs(jobs) {
  for (const j of jobs) {
    const existing = await findJobById(j.id);
    if (!existing) {
      await insertJob(j);
    } else {
      await updateJobById(j.id, j);
    }
  }
}

// --- Applications ---

async function insertApplication(jobId, candidateId) {
  const { rows } = await pool.query(
    `INSERT INTO "Application" (jobid, candidateid) VALUES ($1, $2) RETURNING *`,
    [jobId, candidateId]
  );
  return mapApplication(rows[0]);
}

async function getApplications({ jobId, candidateId } = {}) {
  let query = `
    SELECT a.*,
           jp.jobtitle, jp.companyinformation, jp.employeremail,
           c.fullname, c.useremail, c.resumepath, c.resumefilename,
           c.coverletterpath, c.coverletterfilename
    FROM "Application" a
    JOIN "JobPosting" jp ON jp.jobid = a.jobid
    JOIN "Candidate" c ON c.candidateid = a.candidateid
    WHERE 1=1`;
  const values = [];
  if (jobId) { values.push(jobId); query += ` AND a.jobid = $${values.length}`; }
  if (candidateId) { values.push(candidateId); query += ` AND a.candidateid = $${values.length}`; }
  query += ' ORDER BY a.appliedat DESC';
  const { rows } = await pool.query(query, values);
  return rows.map(mapApplication);
}

async function findApplicationById(id) {
  const { rows } = await pool.query(
    `SELECT a.*,
            jp.jobtitle, jp.companyinformation, jp.employeremail,
            c.fullname, c.useremail, c.resumepath, c.resumefilename,
            c.coverletterpath, c.coverletterfilename
     FROM "Application" a
     JOIN "JobPosting" jp ON jp.jobid = a.jobid
     JOIN "Candidate" c ON c.candidateid = a.candidateid
     WHERE a.applicationid = $1`,
    [id]
  );
  return mapApplication(rows[0] || null);
}

async function updateApplicationStatus(id, status) {
  const { rows } = await pool.query(
    `UPDATE "Application" SET status = $2 WHERE applicationid = $1 RETURNING *`,
    [id, status]
  );
  return mapApplication(rows[0] || null);
}

module.exports = {
  generateId,
  // users
  getUsers,
  saveUsers,
  findUserById,
  findUserByEmail,
  insertUser,
  updateUserById,
  // candidates
  getCandidates,
  saveCandidates,
  findCandidateById,
  findCandidateByUserId,
  insertCandidate,
  updateCandidateById,
  // jobs
  getJobs,
  saveJobs,
  findJobById,
  insertJob,
  updateJobById,
  // applications
  insertApplication,
  getApplications,
  findApplicationById,
  updateApplicationStatus,
};

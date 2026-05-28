-- ============================================================
-- Intelligent Talent Matching Platform
-- PostgreSQL Schema
-- CSIT314 Group Project
-- ============================================================



-- Drop everything for a clean slate
DROP TABLE IF EXISTS "Application"    CASCADE;
DROP TABLE IF EXISTS "JobSkill"        CASCADE;
DROP TABLE IF EXISTS "JobPosting"      CASCADE;
DROP TABLE IF EXISTS "CandidateSkill"  CASCADE;
DROP TABLE IF EXISTS "Candidate"       CASCADE;
DROP TABLE IF EXISTS "Employer"        CASCADE;
DROP TABLE IF EXISTS "User"            CASCADE;


-- Users (Candidates and Employers share this table)

CREATE TABLE "User" (
    userid         VARCHAR(64)  PRIMARY KEY,
    email          VARCHAR(255) NOT NULL UNIQUE,
    passwordhash   VARCHAR(512) NOT NULL,
    passwordsalt   VARCHAR(128),
    role           VARCHAR(20)  NOT NULL CHECK (role IN ('candidate', 'employer')),
    ismember       BOOLEAN      NOT NULL DEFAULT FALSE,
    membershiptype VARCHAR(50)  NOT NULL DEFAULT 'non-membership',
    createdat      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updatedat      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);


-- candidate 

CREATE TABLE "Candidate" (
    candidateid          VARCHAR(64)  PRIMARY KEY,
    userid               VARCHAR(64)  NOT NULL UNIQUE REFERENCES "User"(userid) ON DELETE CASCADE,
    useremail            VARCHAR(255),
    fullname             VARCHAR(255) NOT NULL,
    contactinformation   VARCHAR(255),
    education            VARCHAR(255),
    major                VARCHAR(255),
    yearsofexperience    INT          NOT NULL DEFAULT 0,
    workexperience       TEXT,
    preferredworkingmode VARCHAR(50),
    preferredlocation    VARCHAR(255),
    preferences          JSONB        NOT NULL DEFAULT '[]',
    resumefilename       VARCHAR(255),
    resumepath           TEXT,
    coverletterfilename  VARCHAR(255),
    coverletterpath      TEXT,
    profileimagefilename VARCHAR(255),
    profileimagepath     TEXT,
    ismember             BOOLEAN      NOT NULL DEFAULT FALSE,
    membershiptype       VARCHAR(50)  NOT NULL DEFAULT 'non-membership',
    createdat            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updatedat            TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE "CandidateSkill" (
    candidateskillid  SERIAL      PRIMARY KEY,
    candidateid       VARCHAR(64) NOT NULL REFERENCES "Candidate"(candidateid) ON DELETE CASCADE,
    skillname         VARCHAR(100) NOT NULL,
    UNIQUE (candidateid, skillname)
);


-- Employers

CREATE TABLE "Employer" (
    employerid   VARCHAR(64)  PRIMARY KEY,
    userid       VARCHAR(64)  NOT NULL UNIQUE REFERENCES "User"(userid) ON DELETE CASCADE,
    companyname  VARCHAR(255) NOT NULL,
    industry     VARCHAR(255),
    companysize  VARCHAR(100),
    website      VARCHAR(255),
    description  TEXT,
    createdat    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);


-- Job posting

CREATE TABLE "JobPosting" (
    jobid                  VARCHAR(64)  PRIMARY KEY,
    userid                 VARCHAR(64)  NOT NULL REFERENCES "User"(userid) ON DELETE CASCADE,
    employeremail          VARCHAR(255),
    jobtitle               VARCHAR(255) NOT NULL,
    companyinformation     VARCHAR(255) NOT NULL,
    jobdescription         TEXT         NOT NULL,
    requirededucationlevel VARCHAR(255),
    yearsofexperience      INT          NOT NULL DEFAULT 0,
    workmode               VARCHAR(50)  NOT NULL,
    joblocation            VARCHAR(255) NOT NULL,
    jobtype                VARCHAR(50),
    salarymin              INTEGER,
    salarymax              INTEGER,
    ismember               BOOLEAN      NOT NULL DEFAULT FALSE,
    membershiptype         VARCHAR(50)  NOT NULL DEFAULT 'non-membership',
    createdat              TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updatedat              TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE "JobSkill" (
    jobskillid  SERIAL      PRIMARY KEY,
    jobid       VARCHAR(64) NOT NULL REFERENCES "JobPosting"(jobid) ON DELETE CASCADE,
    skillname   VARCHAR(100) NOT NULL,
    UNIQUE (jobid, skillname)
);


-- applications

CREATE TABLE "Application" (
    applicationid  SERIAL      PRIMARY KEY,
    jobid          VARCHAR(64) NOT NULL REFERENCES "JobPosting"(jobid) ON DELETE CASCADE,
    candidateid    VARCHAR(64) NOT NULL REFERENCES "Candidate"(candidateid) ON DELETE CASCADE,
    status         VARCHAR(20) NOT NULL DEFAULT 'Pending'
                               CHECK (status IN ('Pending', 'Reviewed', 'Shortlisted', 'Rejected', 'Accepted')),
    appliedat      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (jobid, candidateid)
);


-- indexes
CREATE INDEX idx_user_email          ON "User"(email);
CREATE INDEX idx_candidate_userid    ON "Candidate"(userid);
CREATE INDEX idx_job_userid          ON "JobPosting"(userid);
CREATE INDEX idx_candidateskill_cand ON "CandidateSkill"(candidateid);
CREATE INDEX idx_jobskill_job        ON "JobSkill"(jobid);
CREATE INDEX idx_app_job             ON "Application"(jobid);
CREATE INDEX idx_app_candidate       ON "Application"(candidateid);

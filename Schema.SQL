-- ============================================================
-- Intelligent Talent Matching Platform
-- PostgreSQL Schema
-- CSIT314 Group Project
-- Group INSERT OUR NAME HERE
-- ============================================================

-- NOTES

-- DELETE CASCADE used throughout to support removing users
-- I'm using UNIQUE to stop Candidates from applying more than once to the same job
-- Reccomendations will need some work, currently untouched
-- Top K not implemented yet



-- ENUMS

CREATE TYPE WorkMode AS ENUM ('Remote', 'OnSite', 'Hybrid');
CREATE TYPE EducationLevel AS ENUM ('HighSchool', 'Associate', 'Bachelor', 'Master', 'PhD');
CREATE TYPE UserRole AS ENUM ('Candidate', 'Employer');

-- USERS (shared between Candidates and Employers)

CREATE TABLE "User" (
    UserID        SERIAL PRIMARY KEY,
    Email         VARCHAR(255) NOT NULL UNIQUE,
    PasswordHash  VARCHAR(255) NOT NULL,
    Role          UserRole     NOT NULL
);


-- CANDIDATES

CREATE TABLE "Candidate" (
    CandidateID       SERIAL PRIMARY KEY,
    UserID            INT          NOT NULL UNIQUE REFERENCES "User"(UserID) ON DELETE CASCADE,
    FullName          VARCHAR(255) NOT NULL,
    Phone             VARCHAR(50),
    Location          VARCHAR(255),
    ResumeURL         TEXT,                       -- path/URL to uploaded resume file. Placeholder
    EducationLevel    EducationLevel,
    FieldOfStudy      VARCHAR(255),
    YearsExperience   INT          NOT NULL DEFAULT 0,
    Bio               TEXT
);

-- Skills of a candidate
CREATE TABLE "CandidateSkill" (
    CandidateSkillID  SERIAL PRIMARY KEY,
    CandidateID       INT          NOT NULL REFERENCES "Candidate"(CandidateID) ON DELETE CASCADE,
    SkillName         VARCHAR(100) NOT NULL,
    UNIQUE (CandidateID, SkillName)
);

-- Candidate job-type / work-mode
CREATE TABLE "CandidatePreference" (
    PreferenceID      SERIAL PRIMARY KEY,
    CandidateID       INT      NOT NULL UNIQUE REFERENCES "Candidate"(CandidateID) ON DELETE CASCADE,
    PreferredWorkMode WorkMode,
    PreferredLocation VARCHAR(255),
    DesiredJobTitle   VARCHAR(255)
);

-- EMPLOYERS / COMPANIES

CREATE TABLE "Employer" (
    EmployerID      SERIAL PRIMARY KEY,
    UserID          INT          NOT NULL UNIQUE REFERENCES "User"(UserID) ON DELETE CASCADE,
    CompanyName     VARCHAR(255) NOT NULL,
    Industry        VARCHAR(255),
    CompanySize     VARCHAR(100),               -- String of employee range. "1-10", "50-200"
    Website         VARCHAR(255),
    Description     TEXT
);

-- JOB POSTINGS

CREATE TABLE "JobPosting" (
    JobID              SERIAL PRIMARY KEY,
    EmployerID         INT            NOT NULL REFERENCES "Employer"(EmployerID) ON DELETE CASCADE,
    JobTitle           VARCHAR(255)   NOT NULL,
    JobDescription     TEXT           NOT NULL,
    RequiredEducation  EducationLevel,
    YearsExperienceReq INT            NOT NULL DEFAULT 0,
    WorkMode           WorkMode       NOT NULL,
    JobLocation        VARCHAR(255),
    IsActive           BOOLEAN        NOT NULL DEFAULT TRUE -- Employers can take down listings but keep applications intakct
);

-- Skills required for a job posting
CREATE TABLE "JobSkill" (
    JobSkillID  SERIAL PRIMARY KEY,
    JobID       INT          NOT NULL REFERENCES "JobPosting"(JobID) ON DELETE CASCADE,
    SkillName   VARCHAR(100) NOT NULL,
    UNIQUE (JobID, SkillName)
);

-- APPLICATIONS
-- When a candidate applies to a job posting

CREATE TYPE ApplicationStatus AS ENUM ('Pending', 'Reviewed', 'Shortlisted', 'Rejected');

CREATE TABLE "Application" (
    ApplicationID  SERIAL PRIMARY KEY,
    JobID          INT               NOT NULL REFERENCES "JobPosting"(JobID) ON DELETE CASCADE,
    CandidateID    INT               NOT NULL REFERENCES "Candidate"(CandidateID) ON DELETE CASCADE,
    Status         ApplicationStatus NOT NULL DEFAULT 'Pending'
    UNIQUE (JobID, CandidateID)
);

-- INDEXES
-- Always hated this
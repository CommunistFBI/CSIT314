import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const EDUCATION_OPTIONS = ['Any', 'High School', 'Diploma', 'Bachelor', 'Master', 'PhD'];
const WORK_MODE_OPTIONS  = ['Remote', 'On-site', 'Hybrid'];
const JOB_TYPE_OPTIONS   = ['Full-time', 'Part-time', 'Contract', 'Internship'];

const EmployerJobFormPage = () => {
  const { user, addJob, loading, error } = useAppContext();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    jobTitle:                   '',
    companyInformation:         '',
    jobDescription:             '',
    requiredEducationLevel:     'Any',
    requiredSkills:             '',    // comma-separated
    yearsOfExperience:          '',
    workMode:                   'On-site',
    jobLocation:                '',
    jobType:                    'Full-time',
    salaryMin:                  '',
    salaryMax:                  '',
  });

  const [localError, setLocalError] = useState('');

  if (user && user.role !== 'employer') return <Navigate to="/home" />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    const skillList = form.requiredSkills.split(',').map(s => s.trim()).filter(Boolean);

    const body = {
      userId:                       user.id,
      employerEmail:                user.email,
      jobTitle:                     form.jobTitle.trim(),
      companyInformation:           form.companyInformation.trim(),
      jobDescription:               form.jobDescription.trim(),
      requiredEducationLevel:       form.requiredEducationLevel,
      requiredSkills:               skillList,
      yearsOfExperience:            Number(form.yearsOfExperience) || 0,
      workMode:                     form.workMode,
      jobLocation:                  form.jobLocation.trim(),
      jobType:                      form.jobType,
      salaryMin:                    form.salaryMin ? Number(form.salaryMin) : null,
      salaryMax:                    form.salaryMax ? Number(form.salaryMax) : null,
    };

    try {
      await addJob(body);
      navigate('/home');
    } catch (err) {
      setLocalError(err.message);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Create Job Posting</h2>

        <input name="jobTitle" placeholder="Job Title" required
          value={form.jobTitle} onChange={handleChange} />

        <input name="companyInformation" placeholder="Company Name" required
          value={form.companyInformation} onChange={handleChange} />

        <textarea name="jobDescription" placeholder="Job Description" required
          rows={5} value={form.jobDescription} onChange={handleChange} />

        <div>
          <label>Required Education Level</label>
          <select name="requiredEducationLevel" value={form.requiredEducationLevel} onChange={handleChange}>
            {EDUCATION_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        <input name="requiredSkills" placeholder="Required Skills (comma-separated)" required
          value={form.requiredSkills} onChange={handleChange} />

        <input name="yearsOfExperience" type="number" min="0" placeholder="Years of Experience Required"
          value={form.yearsOfExperience} onChange={handleChange} />

        <div>
          <label>Work Mode</label>
          <select name="workMode" value={form.workMode} onChange={handleChange}>
            {WORK_MODE_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        <input name="jobLocation" placeholder="Job Location (e.g. Sydney)" required
          value={form.jobLocation} onChange={handleChange} />

        <div>
          <label>Job Type</label>
          <select name="jobType" value={form.jobType} onChange={handleChange}>
            {JOB_TYPE_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        <div>
          <input name="salaryMin" type="number" min="0" placeholder="Salary Min (optional)"
            value={form.salaryMin} onChange={handleChange} />
          <input name="salaryMax" type="number" min="0" placeholder="Salary Max (optional)"
            value={form.salaryMax} onChange={handleChange} />
        </div>

        {(localError || error) && <p style={{ color: 'red' }}>{localError || error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Publishing...' : 'Publish Job'}
        </button>
      </form>
    </div>
  );
};

export default EmployerJobFormPage;
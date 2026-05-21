import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const EmployerJobFormPage = () => {
    const { user, addJob } = useAppContext();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '', company: '', description: '', requiredEducation: '',
        requiredSkills: '', yearsOfExperience: '', workMode: 'On-site', location: ''
    });

    if (user && user.role !== 'employer') return <Navigate to="/" />;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addJob({
            ...form,
            yearsOfExperience: Number(form.yearsOfExperience),
            requiredSkills: form.requiredSkills.split(',').map(s => s.trim()),
        });
        navigate('/');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Job Posting</h2>
            <input name="title" placeholder="Job Title" required onChange={handleChange} />
            <input name="company" placeholder="Company" required onChange={handleChange} />
            <textarea name="description" placeholder="Job Description" required onChange={handleChange} />
            <input name="requiredEducation" placeholder="Required Education" required onChange={handleChange} />
            <input name="requiredSkills" placeholder="Required Skills (comma separated)" required onChange={handleChange} />
            <input name="yearsOfExperience" type="number" placeholder="Years of Experience" required onChange={handleChange} />
            <select name="workMode" value={form.workMode} onChange={handleChange}>
                <option>Remote</option>
                <option>On-site</option>
                <option>Hybrid</option>
            </select>
            <input name="location" placeholder="Location" required onChange={handleChange} />
            <button type="submit">Publish Job</button>
        </form>
    );
};

export default EmployerJobFormPage;
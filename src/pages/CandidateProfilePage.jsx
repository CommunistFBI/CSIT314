import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const CandidateProfilePage = () => {
    const { user, candidates, addCandidateProfile, updateCandidateProfile } = useAppContext();
    const navigate = useNavigate();

    // State for form fields
    const [form, setForm] = useState({
        fullName: '',
        contact: '',
        education: '',
        major: '',
        yearsOfExperience: ''
    });

    // When the user logs in as an existing candidate, pre‑fill the form
    useEffect(() => {
        if (user && user.role === 'candidate') {
            // Check if this is an existing candidate (present in candidates array)
            const exists = candidates.some(c => c.id === user.id);
            if (exists) {
                setForm({
                    fullName: user.fullName || '',
                    contact: user.contact || '',
                    education: user.education || '',
                    major: user.major || '',
                    yearsOfExperience: user.yearsOfExperience || ''
                });
            }
        }
    }, [user, candidates]);

    // Prevent wrong role from accessing (optional)
    if (user && user.role !== 'candidate') return <Navigate to="/" />;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const profileData = {
            ...form,
            yearsOfExperience: Number(form.yearsOfExperience)
        };

        // Check if this is an existing candidate (by id)
        const exists = user && candidates.some(c => c.id === user.id);
        if (exists) {
            updateCandidateProfile(user.id, profileData);
        } else {
            // New candidate
            addCandidateProfile(profileData);
        }
        navigate('/');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{user && candidates.some(c => c.id === user.id) ? 'Edit Your Profile' : 'Create Candidate Profile'}</h2>
            <input name="fullName" placeholder="Full Name" required value={form.fullName} onChange={handleChange} />
            <input name="contact" placeholder="Contact" required value={form.contact} onChange={handleChange} />
            <input name="education" placeholder="Education (e.g., Bachelor of CS)" required value={form.education} onChange={handleChange} />
            <input name="major" placeholder="Major" required value={form.major} onChange={handleChange} />
            <input name="yearsOfExperience" type="number" placeholder="Years of Experience" required value={form.yearsOfExperience} onChange={handleChange} />
            <button type="submit">Save Profile</button>
        </form>
    );
};

export default CandidateProfilePage;
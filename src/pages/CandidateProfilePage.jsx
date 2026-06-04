import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const CandidateProfilePage = () => {
    const { user, candidateProfile, saveCandidateProfile, loading, error } = useAppContext();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: '', contactInformation: '', education: 'Bachelor', major: '',
        yearsOfExperience: '', workExperience: '', skills: '',
        preferredWorkingMode: 'Remote', preferredLocation: ''
    });

    useEffect(() => {
        if (candidateProfile) setForm({
            fullName: candidateProfile.fullName || '',
            contactInformation: candidateProfile.contactInformation || '',
            education: candidateProfile.education || 'Bachelor',
            major: candidateProfile.major || '',
            yearsOfExperience: candidateProfile.yearsOfExperience ?? '',
            workExperience: candidateProfile.workExperience || '',
            skills: candidateProfile.skills?.join(', ') || '',
            preferredWorkingMode: candidateProfile.preferredWorkingMode || 'Remote',
            preferredLocation: candidateProfile.preferredLocation || ''
        });
    }, [candidateProfile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('userId', user.id);
        fd.append('fullName', form.fullName);
        fd.append('contactInformation', form.contactInformation);
        fd.append('education', form.education);
        fd.append('major', form.major);
        fd.append('yearsOfExperience', form.yearsOfExperience);
        fd.append('workExperience', form.workExperience);
        fd.append('preferredWorkingMode', form.preferredWorkingMode);
        fd.append('preferredLocation', form.preferredLocation);
        form.skills.split(',').map(s => s.trim()).filter(Boolean).forEach(s => fd.append('skills', s));
        await saveCandidateProfile(fd);
        navigate('/home');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{candidateProfile ? 'Edit Profile' : 'Create Profile'}</h2>
            <input placeholder="Full Name" required value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
            <input placeholder="Contact" required value={form.contactInformation} onChange={e => setForm({...form, contactInformation: e.target.value})} />
            <select value={form.education} onChange={e => setForm({...form, education: e.target.value})}>
                {['High School','Diploma','Bachelor','Master','PhD','Other'].map(o => <option key={o}>{o}</option>)}
            </select>
            <input placeholder="Major" required value={form.major} onChange={e => setForm({...form, major: e.target.value})} />
            <input type="number" min="0" placeholder="Years of Experience" required value={form.yearsOfExperience} onChange={e => setForm({...form, yearsOfExperience: e.target.value})} />
            <textarea placeholder="Work Experience" required rows={4} value={form.workExperience} onChange={e => setForm({...form, workExperience: e.target.value})} />
            <input placeholder="Skills (comma-separated)" required value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} />
            <select value={form.preferredWorkingMode} onChange={e => setForm({...form, preferredWorkingMode: e.target.value})}>
                {['Remote','On-site','Hybrid'].map(o => <option key={o}>{o}</option>)}
            </select>
            <input placeholder="Preferred Location" required value={form.preferredLocation} onChange={e => setForm({...form, preferredLocation: e.target.value})} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Profile'}</button>
        </form>
    );
};

export default CandidateProfilePage;
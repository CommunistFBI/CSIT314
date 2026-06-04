import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { apiGetJobById, apiApply } from '../services/api';

const JobDetailPage = () => {
    const { id } = useParams();
    const { user, candidateProfile } = useAppContext();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [applied, setApplied] = useState(false);

    useEffect(() => {
        apiGetJobById(id).then(res => setJob(res.data));
    }, [id]);

    if (!job) return <p>Loading...</p>;

    return (
        <div className="detail-card">
            <button onClick={() => navigate(-1)}>Back</button>
            <h2>{job.jobTitle}</h2>
            <p><strong>Company:</strong> {job.companyInformation}</p>
            <p><strong>Description:</strong> {job.jobDescription}</p>
            <p><strong>Education Required:</strong> {job.requiredEducationLevel}</p>
            <p><strong>Skills:</strong> {job.requiredSkills?.join(', ')}</p>
            <p><strong>Experience:</strong> {job.yearsOfExperience} years</p>
            <p><strong>Work Mode:</strong> {job.workMode}</p>
            <p><strong>Location:</strong> {job.jobLocation}</p>
            {job.jobType && <p><strong>Type:</strong> {job.jobType}</p>}
            {job.salaryMin && <p><strong>Salary:</strong> ${job.salaryMin} - ${job.salaryMax}</p>}
            {user?.role === 'candidate' && (
                applied
                    ? <p>Applied!</p>
                    : <button onClick={() => apiApply(job.id, candidateProfile.id).then(() => setApplied(true))}>Apply</button>
            )}
        </div>
    );
};

export default JobDetailPage;
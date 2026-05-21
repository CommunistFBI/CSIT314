import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const JobDetailPage = () => {
    const { id } = useParams();
    const { jobs } = useAppContext();
    const job = jobs.find(j => j.id === Number(id));

    if (!job) return <p>Job not found.</p>;

    return (
        <div className="detail-card">
            <h2>{job.title}</h2>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Description:</strong> {job.description}</p>
            <p><strong>Education Required:</strong> {job.requiredEducation}</p>
            <p><strong>Skills:</strong> {job.requiredSkills.join(', ')}</p>
            <p><strong>Experience:</strong> {job.yearsOfExperience} years</p>
            <p><strong>Work Mode:</strong> {job.workMode}</p>
            <p><strong>Location:</strong> {job.location}</p>
        </div>
    );
};

export default JobDetailPage;
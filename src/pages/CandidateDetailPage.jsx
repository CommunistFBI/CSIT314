import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const CandidateDetailPage = () => {
    const { id } = useParams();
    const { candidates } = useAppContext();
    const candidate = candidates.find(c => c.id === Number(id));

    if (!candidate) return <p>Candidate not found.</p>;

    return (
        <div className="detail-card">
            <h2>{candidate.fullName}</h2>
            <p><strong>Contact:</strong> {candidate.contact}</p>
            <p><strong>Education:</strong> {candidate.education} ({candidate.major})</p>
            <p><strong>Experience:</strong> {candidate.yearsOfExperience} years</p>
            <p><strong>Skills:</strong> {(candidate.skills || []).join(', ') || 'N/A'}</p>
        </div>
    );
};

export default CandidateDetailPage;
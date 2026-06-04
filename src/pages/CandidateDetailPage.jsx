import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGetCandidateById } from '../services/api';

const CandidateDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [candidate, setCandidate] = useState(null);

    useEffect(() => {
        apiGetCandidateById(id).then(res => setCandidate(res.data));
    }, [id]);

    if (!candidate) return <p>Loading...</p>;

    return (
        <div className="detail-card">
            <button onClick={() => navigate(-1)}>Back</button>
            <h2>{candidate.fullName}</h2>
            <p><strong>Contact:</strong> {candidate.contactInformation}</p>
            <p><strong>Education:</strong> {candidate.education} - {candidate.major}</p>
            <p><strong>Experience:</strong> {candidate.yearsOfExperience} years</p>
            <p><strong>Skills:</strong> {candidate.skills?.join(', ')}</p>
            <p><strong>Work Experience:</strong> {candidate.workExperience}</p>
            <p><strong>Preferred Mode:</strong> {candidate.preferredWorkingMode}</p>
            <p><strong>Preferred Location:</strong> {candidate.preferredLocation}</p>
        </div>
    );
};

export default CandidateDetailPage;
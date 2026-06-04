import { Link } from 'react-router-dom';

const CandidateCard = ({ candidate }) => (
    <div className="card">
        <h3>{candidate.fullName}</h3>
        <p>{candidate.education} - {candidate.major}</p>
        <p>{candidate.yearsOfExperience} years experience</p>
        <p>{candidate.skills?.join(', ')}</p>
        {candidate.matchScore && <p>Match score: {candidate.matchScore}</p>}
        <Link to={`/candidate/${candidate.id}`}>View Profile</Link>
    </div>
);

export default CandidateCard;
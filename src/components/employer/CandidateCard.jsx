import { Link } from 'react-router-dom';

const CandidateCard = ({ candidate }) => (
    <div className="card">
        <h3>{candidate.fullName}</h3>
        <p>{candidate.education}</p>
        <p>{candidate.yearsOfExperience} years</p>
        <Link to={`/candidate/${candidate.id}`}>Profile</Link>
    </div>
);

export default CandidateCard;
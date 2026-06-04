import { Link } from 'react-router-dom';

const JobCard = ({ job }) => (
    <div className="card">
        <h3>{job.jobTitle}</h3>
        <p>{job.companyInformation}</p>
        <p>{job.workMode} - {job.jobLocation}</p>
        {job.matchScore && <p>Match score: {job.matchScore}</p>}
        <Link to={`/job/${job.id}`}>Details</Link>
    </div>
);

export default JobCard;
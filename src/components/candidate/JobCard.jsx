import { Link } from 'react-router-dom';

const JobCard = ({ job }) => (
    <div className="card">
        <h3>{job.title}</h3>
        <p>{job.company}</p>
        <p>{job.workMode} - {job.location}</p>
        <Link to={`/job/${job.id}`}>Details</Link>
    </div>
);

export default JobCard;
import { useAppContext } from '../../context/AppContext';
import JobCard from './JobCard';

const CandidateRecommendations = () => {
    const { candidateProfile, getRecommendedJobs } = useAppContext();
    const recommended = getRecommendedJobs(candidateProfile);

    return (
        <section>
            <h2>Recommended Jobs for You (Top 10)</h2>
            {recommended.length ? (
                <div className="grid">
                    {recommended.map(job => <JobCard key={job.id} job={job} />)}
                </div>
            ) : (
                <p>Complete your profile to see recommendations.</p>
            )}
        </section>
    );
};

export default CandidateRecommendations;
import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import JobCard from './JobCard';

const CandidateRecommendations = () => {
    const { candidateProfile, getRecommendedJobs } = useAppContext();
    const [recommended, setRecommended] = useState([]);

    useEffect(() => {
        if (candidateProfile?.id)
            getRecommendedJobs().then(setRecommended);
    }, [candidateProfile]);

    return (
        <section>
            <h2>Recommended Jobs for You</h2>
            {recommended.length
                ? recommended.map(job => <JobCard key={job.id} job={job} />)
                : <p>No recommendations yet. Complete your profile to see matches.</p>
            }
        </section>
    );
};

export default CandidateRecommendations;
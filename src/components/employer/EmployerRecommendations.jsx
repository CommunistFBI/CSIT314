import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import CandidateCard from './CandidateCard';

const EmployerRecommendations = () => {
    const { jobs, getRecommendedCandidates } = useAppContext();
    const [selectedJobId, setSelectedJobId] = useState('');
    const [recommended, setRecommended] = useState([]);

    const handleJobChange = (e) => {
        setSelectedJobId(e.target.value);
        if (e.target.value)
            getRecommendedCandidates(e.target.value).then(setRecommended);
        else
            setRecommended([]);
    };

    return (
        <section>
            <h2>Recommended Candidates</h2>
            <select value={selectedJobId} onChange={handleJobChange}>
                <option value="">-- Select a job --</option>
                {jobs.map(j => <option key={j.id} value={j.id}>{j.jobTitle}</option>)}
            </select>
            {recommended.map(c => <CandidateCard key={c.id} candidate={c} />)}
        </section>
    );
};

export default EmployerRecommendations;
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import CandidateCard from './CandidateCard';

const EmployerRecommendations = () => {
    const { jobs, getRecommendedCandidates } = useAppContext();
    const [selectedJobId, setSelectedJobId] = useState('');
    const job = jobs.find(j => j.id === Number(selectedJobId));
    const recommended = getRecommendedCandidates(job);

    return (
        <section>
            <h2>Recommended Candidates (Top 10)</h2>
            <select onChange={e => setSelectedJobId(e.target.value)} value={selectedJobId}>
                <option value="">-- Select a job --</option>
                {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
            </select>
            <div className="grid">
                {recommended.map(c => <CandidateCard key={c.id} candidate={c} />)}
            </div>
        </section>
    );
};

export default EmployerRecommendations;
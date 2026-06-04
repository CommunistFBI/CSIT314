import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import CandidateCard from './CandidateCard';

const CandidateList = () => {
    const { candidates, refreshCandidates } = useAppContext();
    const [keyword, setKeyword] = useState('');
    const [skill, setSkill] = useState('');
    const [education, setEducation] = useState('');
    const [workMode, setWorkMode] = useState('');
    const [minExp, setMinExp] = useState('');

    const search = (e) => {
        e.preventDefault();
        refreshCandidates({ q: keyword, skill, education, preferredWorkingMode: workMode, minExperience: minExp });
    };

    return (
        <section>
            <h2>All Candidates</h2>
            <form onSubmit={search}>
                <input placeholder="Search..." value={keyword} onChange={e => setKeyword(e.target.value)} />
                <input placeholder="Skill" value={skill} onChange={e => setSkill(e.target.value)} />
                <input placeholder="Education" value={education} onChange={e => setEducation(e.target.value)} />
                <select value={workMode} onChange={e => setWorkMode(e.target.value)}>
                    <option value="">Any work mode</option>
                    <option>Remote</option>
                    <option>On-site</option>
                    <option>Hybrid</option>
                </select>
                <input type="number" placeholder="Min experience (yrs)" value={minExp} onChange={e => setMinExp(e.target.value)} />
                <button type="submit">Search</button>
                <button type="button" onClick={() => { setKeyword(''); setSkill(''); setEducation(''); setWorkMode(''); setMinExp(''); refreshCandidates(); }}>Reset</button>
            </form>
            {candidates.map(c => <CandidateCard key={c.id} candidate={c} />)}
        </section>
    );
};

export default CandidateList;
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import CandidateCard from './CandidateCard';

const CandidateList = () => {
    const { candidates } = useAppContext();
    const [filters, setFilters] = useState({ skill: '', education: '', experience: '' });
    const [searchName, setSearchName] = useState('');

    const filtered = candidates.filter(c => {
        const nameMatch = !searchName || c.fullName.toLowerCase().includes(searchName.toLowerCase());
        const eduMatch = !filters.education || c.education.toLowerCase().includes(filters.education.toLowerCase());
        const expMatch = !filters.experience || c.yearsOfExperience >= Number(filters.experience);
        const skillMatch = !filters.skill || (c.skills && c.skills.some(skill => skill.toLowerCase().includes(filters.skill.toLowerCase())));
        return nameMatch && eduMatch && expMatch && skillMatch;
    });

    return (
        <section>
            <h2>All Candidates</h2>
            <div>
                <input placeholder="Skill" value={filters.skill}
                       onChange={e => setFilters({...filters, skill: e.target.value})} />
                <input placeholder="Education" value={filters.education}
                       onChange={e => setFilters({...filters, education: e.target.value})} />
                <input placeholder="Min experience" type="number" value={filters.experience}
                       onChange={e => setFilters({...filters, experience: e.target.value})} />
                <input placeholder="Search by name" value={searchName}
                       onChange={e => setSearchName(e.target.value)} />
            </div>
            <div className="grid">
                {filtered.map(c => <CandidateCard key={c.id} candidate={c} />)}
            </div>
        </section>
    );
};

export default CandidateList;
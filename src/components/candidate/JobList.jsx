import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import JobCard from './JobCard';

const JobList = () => {
    const { jobs } = useAppContext();
    const [search, setSearch] = useState('');

    const filtered = jobs.filter(job =>
        job.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section>
            <h2>All Jobs</h2>
            <input
                placeholder="Search in job description..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <div className="grid">
                {filtered.map(job => <JobCard key={job.id} job={job} />)}
            </div>
        </section>
    );
};

export default JobList;
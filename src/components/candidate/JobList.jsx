import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import JobCard from './JobCard';

const JobList = () => {
    const { jobs, refreshJobs } = useAppContext();
    const [keyword, setKeyword] = useState('');
    const [workMode, setWorkMode] = useState('');
    const [location, setLocation] = useState('');

    const search = (e) => {
        e.preventDefault();
        refreshJobs({ q: keyword, workMode, location });
    };

    return (
        <section>
            <h2>All Jobs</h2>
            <form onSubmit={search}>
                <input placeholder="Search..." value={keyword} onChange={e => setKeyword(e.target.value)} />
                <select value={workMode} onChange={e => setWorkMode(e.target.value)}>
                    <option value="">Any work mode</option>
                    <option>Remote</option>
                    <option>On-site</option>
                    <option>Hybrid</option>
                </select>
                <input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
                <button type="submit">Search</button>
                <button type="button" onClick={() => { setKeyword(''); setWorkMode(''); setLocation(''); refreshJobs(); }}>Reset</button>
            </form>
            {jobs.map(job => <JobCard key={job.id} job={job} />)}
        </section>
    );
};

export default JobList;
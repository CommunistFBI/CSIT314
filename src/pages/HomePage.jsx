import { useAppContext } from '../context/AppContext';
import CandidateRecommendations from '../components/candidate/CandidateRecommendations';
import JobList from '../components/candidate/JobList';
import EmployerRecommendations from '../components/employer/EmployerRecommendations';
import CandidateList from '../components/employer/CandidateList';

const HomePage = () => {
    const { user } = useAppContext();
    if (!user) return <p>Please log in.</p>;

    if (user.role === 'candidate') {
        return (
            <div>
                <h1>Welcome, {user.name}</h1>
                <CandidateRecommendations />
                <hr />
                <JobList />
            </div>
        );
    }

    return (
        <div>
            <h1>Welcome, {user.name}</h1>
            <EmployerRecommendations />
            <hr />
            <CandidateList />
        </div>
    );
};

export default HomePage;
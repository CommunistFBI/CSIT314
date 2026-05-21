import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const SelectIdentityPage = () => {
    const { role } = useParams(); // 'candidate' or 'employer'
    const { candidates, getEmployerOptions, login } = useAppContext();
    const navigate = useNavigate();

    const handleSelectCandidate = (candidate) => {
        login({
            id: candidate.id,
            role: 'candidate',
            name: candidate.fullName,
            ...candidate
        });
        navigate('/');
    };

    const handleSelectEmployer = (companyName) => {
        login({
            id: Date.now(),
            role: 'employer',
            name: companyName,
            company: companyName
        });
        navigate('/');
    };

    const handleNewCandidate = () => {
        navigate('/candidate/profile');
    };

    const handleNewEmployer = () => {
        navigate('/employer/post-job');
    };

    if (role === 'candidate') {
        return (
            <div className="container">
                <h2>Select Your Candidate Profile</h2>
                <div className="grid">
                    {candidates.map(candidate => (
                        <div
                            key={candidate.id}
                            className="card clickable"
                            onClick={() => handleSelectCandidate(candidate)}
                        >
                            <h3>{candidate.fullName}</h3>
                            <p>{candidate.education}</p>
                            <p>{candidate.yearsOfExperience} years experience</p>
                        </div>
                    ))}
                    <div
                        className="card clickable new-profile"
                        onClick={handleNewCandidate}
                    >
                        <h3>+ New Candidate</h3>
                        <p>Create your profile</p>
                    </div>
                </div>
            </div>
        );
    }

    if (role === 'employer') {
        const companies = getEmployerOptions();
        return (
            <div className="container">
                <h2>Select Your Company</h2>
                <div className="grid">
                    {companies.map((company, idx) => (
                        <div
                            key={idx}
                            className="card clickable"
                            onClick={() => handleSelectEmployer(company)}
                        >
                            <h3>{company}</h3>
                            <p>Existing employer</p>
                        </div>
                    ))}
                    <div
                        className="card clickable new-profile"
                        onClick={handleNewEmployer}
                    >
                        <h3>+ New Employer</h3>
                        <p>Create your company profile</p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default SelectIdentityPage;
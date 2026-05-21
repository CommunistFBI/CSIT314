import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();

    return (
        <div className="login-container">
            <h1>Login</h1>
            <button onClick={() => navigate('/select-identity/candidate')}>
                Login as Candidate
            </button>
            <button onClick={() => navigate('/select-identity/employer')}>
                Login as Employer
            </button>
        </div>
    );
};

export default LoginPage;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const LoginPage = () => {
    const { login, register, loading, error } = useAppContext();
    const navigate = useNavigate();
    const [mode, setMode] = useState('login');
    const [role, setRole] = useState('candidate');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        try {
            if (mode === 'register') {
                await register(email, password, role);
                navigate(role === 'candidate' ? '/candidate/profile' : '/employer/post-job');
            } else {
                await login(email, password);
                navigate('/home');
            }
        } catch (e) {
            setLocalError(e.message);
        }
    };

    return (
        <div className="login-container">
            <h1>Intelligent Talent Matching</h1>
            <div>
                <button onClick={() => setMode('login')}>Login</button>
                <button onClick={() => setMode('register')}>Register</button>
            </div>
            <form onSubmit={handleSubmit}>
                {mode === 'register' && (
                    <select value={role} onChange={e => setRole(e.target.value)}>
                        <option value="candidate">Candidate</option>
                        <option value="employer">Employer</option>
                    </select>
                )}
                <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
                {(localError || error) && <p style={{ color: 'red' }}>{localError || error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
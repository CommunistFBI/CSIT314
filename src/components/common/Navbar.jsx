import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const Navbar = () => {
    const { user, logout } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav>
            <Link to="/">Home</Link>{" "}
            {user ? (
                <>
                    <span>| {user.name} ({user.role})</span>{" "}
                    {user.role === 'candidate' && <Link to="/candidate/profile">Profile</Link>}
                    {user.role === 'employer' && <Link to="/employer/post-job">Post Job</Link>}
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </nav>
    );
};

export default Navbar;
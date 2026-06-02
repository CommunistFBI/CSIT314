import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Navbar from './components/common/Navbar';
import LoginPage from './pages/LoginPage';
import SelectIdentityPage from './pages/SelectIdentityPage';
import HomePage from './pages/HomePage';
import CandidateProfilePage from './pages/CandidateProfilePage';
import EmployerJobFormPage from './pages/EmployerJobFormPage';
import JobDetailPage from './pages/JobDetailPage';
import CandidateDetailPage from './pages/CandidateDetailPage';

const ProtectedRoute = ({ children, role }) => {
    const { user } = useAppContext();
    if (!user) return <Navigate to="/login" />;
    // if role mismatch, send to authenticated home page
    if (role && user.role !== role) return <Navigate to="/home" />;
    return children;
};

function App() {
    return (
        <AppProvider>
            <BrowserRouter>
                <Navbar />
                <div style={{ padding: '1rem' }}>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/select-identity/:role" element={<SelectIdentityPage />} />
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/home" element={
                            <ProtectedRoute><HomePage /></ProtectedRoute>
                        } />
                        <Route path="/candidate/profile" element={<CandidateProfilePage />} />
                        <Route path="/employer/post-job" element={<EmployerJobFormPage />} />
                        <Route path="/job/:id" element={<JobDetailPage />} />
                        <Route path="/candidate/:id" element={<CandidateDetailPage />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </AppProvider>
    );
}

export default App;
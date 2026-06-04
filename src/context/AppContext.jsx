import React, { createContext, useState, useContext, useEffect } from 'react';
import {
    apiLogin, apiRegister,
    apiGetCandidates, apiGetCandidateByUser,
    apiGetJobs,
    apiCreateCandidate, apiUpdateCandidate,
    apiCreateJob,
} from '../services/api';

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [candidateProfile, setCandidateProfile] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        apiGetJobs().then(res => setJobs(res.data));
        apiGetCandidates().then(res => setCandidates(res.data));
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiLogin(email, password);
            setUser(res.data);
            if (res.data.role === 'candidate') {
                apiGetCandidateByUser(res.data.id)
                    .then(r => setCandidateProfile(r.data))
                    .catch(e => console.log('no profile yet', e));
            }
            return res.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (email, password, role) => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiRegister(email, password, role);
            setUser(res.data);
            return res.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setCandidateProfile(null);
        setError(null);
    };

    const saveCandidateProfile = async (formData) => {
        let res;
        if (candidateProfile?.id) {
            res = await apiUpdateCandidate(candidateProfile.id, formData);
        } else {
            res = await apiCreateCandidate(formData);
        }
        setCandidateProfile(res.data);
        apiGetCandidates().then(r => setCandidates(r.data));
        return res.data;
    };

    const addJob = async (body) => {
        const res = await apiCreateJob(body);
        setJobs(prev => [res.data, ...prev]);
        return res.data;
    };

    const refreshJobs = async (params = {}) => {
        const res = await apiGetJobs(params);
        setJobs(res.data);
    };

    const refreshCandidates = async (params = {}) => {
        const res = await apiGetCandidates(params);
        setCandidates(res.data);
    };

    return (
        <AppContext.Provider value={{
            user, login, register, logout,
            loading, error,
            jobs, candidates,
            candidateProfile,
            saveCandidateProfile,
            addJob, refreshJobs, refreshCandidates,
        }}>
            {children}
        </AppContext.Provider>
    );
};
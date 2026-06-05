import React, { createContext, useState, useContext } from 'react';
import { mockJobs, mockCandidates } from '../data/mockData';

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [jobs, setJobs] = useState(mockJobs);
    const [candidates, setCandidates] = useState(mockCandidates);
    const [candidateProfile, setCandidateProfile] = useState(null);

    const login = (userData) => {
        setUser(userData);
        if (userData.role === 'candidate') {
            setCandidateProfile(userData);   // <-- this sets the profile for recommendations
        }
    };

    const logout = () => {
        setUser(null);
        setCandidateProfile(null);
    };

    const getRecommendedJobs = (profile) => {
        if (!profile) return [];
        return jobs
            .filter(job => {
                const eduMatch = !job.requiredEducation ||
                    profile.education.toLowerCase().includes(job.requiredEducation.toLowerCase());
                const expMatch = profile.yearsOfExperience >= (job.yearsOfExperience || 0);
                return eduMatch && expMatch;
            })
            .slice(0, 10);
    };

    const getRecommendedCandidates = (job) => {
        if (!job) return [];
        return candidates
            .filter(c => {
                const eduMatch = !job.requiredEducation ||
                    c.education.toLowerCase().includes(job.requiredEducation.toLowerCase());
                const expMatch = c.yearsOfExperience >= (job.yearsOfExperience || 0);
                return eduMatch && expMatch;
            })
            .slice(0, 10);
    };

    const addJob = (job) => {
        const newJob = { ...job, id: Date.now() };
        setJobs(prev => [...prev, newJob]);
        setUser({
            id: Date.now(),
            role: 'employer',
            name: job.company,
            company: job.company
        });
    };

    // For a brand‑new candidate
    const addCandidateProfile = (profile) => {
        const newCandidate = { ...profile, id: candidates.length + 1, skills: [] };
        setCandidateProfile(newCandidate);
        setCandidates(prev => [...prev, newCandidate]);
        setUser({
            id: newCandidate.id,
            role: 'candidate',
            name: newCandidate.fullName,
            ...newCandidate
        });
    };

    // For updating an existing candidate (e.g., after editing profile)
    const updateCandidateProfile = (userId, updatedData) => {
        setCandidates(prev =>
            prev.map(c => (c.id === userId ? { ...c, ...updatedData } : c))
        );
        const updated = { id: userId, role: 'candidate', ...updatedData };
        setCandidateProfile(updated);
        setUser(updated);
    };

    const getEmployerOptions = () => {
        return [...new Set(jobs.map(job => job.company))];
    };

    return (
        <AppContext.Provider value={{
            user, login, logout,
            jobs, candidates,
            candidateProfile, setCandidateProfile,
            getRecommendedJobs, getRecommendedCandidates,
            addJob, addCandidateProfile,
            updateCandidateProfile,
            getEmployerOptions
        }}>
            {children}
        </AppContext.Provider>
    );
};
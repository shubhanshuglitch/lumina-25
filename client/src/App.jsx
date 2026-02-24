import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MentorshipPage from './pages/MentorshipPage';
import EventsPage from './pages/EventsPage';
import UpdatesPage from './pages/UpdatesPage';
import SummarizerPage from './pages/SummarizerPage';
import CommunityPage from './pages/CommunityPage';
import RoomPage from './pages/RoomPage';
import CalendarPage from './pages/CalendarPage';
import SubmitEventPage from './pages/SubmitEventPage';
import SummaryDetailPage from './pages/SummaryDetailPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="container py-32 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-[var(--border)] border-t-[var(--accent-1)] mx-auto mb-4" />
                <p className="text-[var(--muted)] text-sm font-bold">Loading...</p>
            </div>
        </div>
    );
    if (!user) return <Navigate to="/login" />;
    return children;
};

function AppContent() {
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('nexus-theme') === 'dark' ||
            window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('nexus-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('nexus-theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <Header isDark={isDark} toggleTheme={toggleTheme} />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/mentorship" element={<MentorshipPage />} />
                        <Route path="/events" element={<EventsPage />} />
                        <Route path="/updates" element={<UpdatesPage />} />
                        <Route path="/summarizer" element={<ProtectedRoute><SummarizerPage /></ProtectedRoute>} />
                        <Route path="/summarizer/:id" element={<ProtectedRoute><SummaryDetailPage /></ProtectedRoute>} />
                        <Route path="/community" element={<CommunityPage />} />
                        <Route path="/room/:id" element={<ProtectedRoute><RoomPage /></ProtectedRoute>} />
                        <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
                        <Route path="/events/submit" element={<ProtectedRoute><SubmitEventPage /></ProtectedRoute>} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;

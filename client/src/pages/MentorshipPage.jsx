import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import {
    Users, Search, Filter, Calendar as CalendarIcon,
    ChevronRight, MapPin, GraduationCap, Star, BookOpen
} from 'lucide-react';

const MentorCard = ({ mentor }) => (
    <div className="card hover:shadow-2xl transition-all group flex flex-col h-full">
        <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[var(--accent-1)] to-[var(--accent-3)] flex items-center justify-center text-white font-black text-xl shadow-lg border-2 border-white ring-1 ring-[var(--border)]">
                {mentor.avatarInitials}
            </div>
            <div>
                <h4 className="text-lg font-bold group-hover:text-[var(--accent-1)] transition-colors">{mentor.name}</h4>
                <div className="flex items-center gap-2 text-[var(--muted)] text-xs font-medium mt-1">
                    <GraduationCap size={14} />
                    <span>{mentor.college} • Class of {mentor.year}</span>
                </div>
            </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
            {mentor.expertise.map((skill, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-[var(--glass)] text-[var(--muted)] text-[10px] font-bold uppercase tracking-wider border border-[var(--border)]">
                    {skill}
                </span>
            ))}
        </div>

        <p className="text-[var(--muted)] text-sm mb-6 flex-grow leading-relaxed">
            {mentor.bio || "Experienced mentor helping students navigate career paths and technical challenges."}
        </p>

        <div className="pt-4 border-t border-[var(--border)] mt-auto">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5 text-[var(--accent-2)]">
                    <Clock size={14} />
                    <span className="text-xs font-bold">{mentor.availability || 'Check availability'}</span>
                </div>
            </div>
            <div className="flex gap-2">
                <button className="btn primary flex-1 justify-center text-xs">Book 1:1 Session</button>
                <button className="btn flex-1 justify-center text-xs">View Profile</button>
            </div>
        </div>
    </div>
);

const Clock = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const MentorshipPage = () => {
    const [mentors, setMentors] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMentors();
    }, []);

    const fetchMentors = async (query = '') => {
        setLoading(true);
        try {
            const res = await api.get(query ? `/mentors/search?q=${query}` : '/mentors');
            setMentors(res.data);
        } catch (err) {
            console.error('Error fetching mentors:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchMentors(search);
    };

    return (
        <div className="container py-12 animate-in-up">
            {/* Hero Section */}
            <section className="grid lg:grid-cols-[1fr,420px] gap-10 items-center mb-12">
                <div className="glass-card">
                    <div className="kicker">Mentorship</div>
                    <h1 className="mb-6">Find mentors, join topic rooms, and schedule 1:1 sessions</h1>
                    <p className="lead mb-8">
                        Browse verified mentors by subject, join live discussion rooms, or request a private 1:1 session with seniors and faculty.
                    </p>

                    <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-2)]" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, expertise, or university..."
                                className="search-input pl-10 h-12 rounded-xl"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn primary h-12 px-8">Find a Mentor</button>
                        <button type="button" className="btn h-12 px-4" title="Filters">
                            <Filter size={20} />
                        </button>
                    </form>
                </div>

                <aside>
                    <div className="glass-card flex flex-col p-6 h-full">
                        <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Clock size={18} className="text-[var(--accent-1)]" />
                            Upcoming Sessions
                        </h4>

                        <div className="flex flex-col gap-4">
                            <div className="p-4 rounded-xl bg-[var(--glass)] border border-[var(--border)]">
                                <h5 className="font-bold text-sm mb-1">ML Office Hours</h5>
                                <p className="text-xs text-[var(--muted)] mb-3">Today • 4:00 PM • Room: ML-Discuss</p>
                                <Link to="/community" className="btn px-4 py-1.5 text-xs primary">Join Room</Link>
                            </div>

                            <div className="p-4 rounded-xl bg-[var(--glass)] border border-[var(--border)]">
                                <h5 className="font-bold text-sm mb-1">Career Prep Workshop</h5>
                                <p className="text-xs text-[var(--muted)] mb-3">Tomorrow • 11:00 AM • Virtual</p>
                                <button className="btn px-4 py-1.5 text-xs">Register</button>
                            </div>
                        </div>
                    </div>
                </aside>
            </section>

            {/* Mentor Grid */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">Featured Mentors</h2>
                    <div className="text-[var(--muted)] text-sm font-medium">{mentors.length} mentors available</div>
                </div>

                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-80 rounded-2xl skeleton border border-[var(--border)]"></div>
                        ))}
                    </div>
                ) : mentors.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
                        {mentors.map(mentor => (
                            <MentorCard key={mentor._id} mentor={mentor} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[var(--glass)] rounded-3xl border border-dashed border-[var(--border)]">
                        <Users size={48} className="mx-auto text-[var(--muted-2)] mb-4" />
                        <h3 className="text-xl font-bold mb-2">No mentors found</h3>
                        <p className="text-[var(--muted)]">Try adjusting your search or filters.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default MentorshipPage;

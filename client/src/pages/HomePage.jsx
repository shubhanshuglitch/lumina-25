import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import {
    Users, MessageSquare, BookOpen, FileText,
    ChevronRight, Search, Zap, Calendar, ArrowRight,
    TrendingUp, Sparkles, Clock
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, color, delay }) => (
    <div className="card hover:border-[var(--accent-1)] transition-all group animate-in-up" style={{ animationDelay: `${delay || 0}ms` }}>
        <div className={`p-3 rounded-xl mb-4 inline-block ${color} shadow-lg`}>
            <Icon size={24} className="text-white" />
        </div>
        <h4 className="text-lg font-bold mb-2 group-hover:text-[var(--accent-1)] transition-colors">{title}</h4>
        <p className="text-[var(--muted)] text-sm leading-relaxed">{description}</p>
    </div>
);

const SmallActionCard = ({ title, subtitle, info, buttonText, link, icon: Icon }) => (
    <div className="flex gap-4 p-4 rounded-xl bg-[var(--glass)] border border-[var(--border)] hover:bg-[var(--card)] transition-all shadow-sm">
        <div className="w-10 h-10 rounded-lg bg-[var(--glass)] flex items-center justify-center text-[var(--muted)] flex-shrink-0">
            {Icon ? <Icon size={20} /> : <Zap size={20} />}
        </div>
        <div className="flex-grow">
            <h5 className="font-bold text-sm mb-0.5">{title}</h5>
            <p className="text-xs text-[var(--muted)] mb-3">{subtitle}</p>
            {info && <div className="text-[10px] uppercase font-bold text-[var(--muted-2)] mb-3 tracking-wider">{info}</div>}
            <Link to={link || '#'} className="btn px-3 py-1.5 text-xs">
                {buttonText || 'Open'}
            </Link>
        </div>
    </div>
);

const HomePage = () => {
    const [events, setEvents] = useState([]);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventRes, noteRes] = await Promise.all([
                    api.get('/events?limit=2'),
                    api.get('/notes?limit=2')
                ]);
                setEvents(eventRes.data.slice(0, 2));
                setNotes(noteRes.data.slice(0, 2));
            } catch (err) {
                console.error('Error fetching home data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container py-12 animate-in-up">
            {/* Hero Section */}
            <section className="grid lg:grid-cols-[1fr,420px] gap-10 items-center mb-16">
                <div className="glass-card relative overflow-hidden">
                    {/* Decorative gradient blobs */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-[var(--accent-1)] to-transparent opacity-10 blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br from-[var(--accent-2)] to-transparent opacity-10 blur-3xl"></div>
                    
                    <div className="kicker">For students • By students</div>
                    <h1 className="mb-6 leading-[1.1]">
                        Everything you need for college life — <span className="gradient-text">mentorship, notes, and AI tools.</span>
                    </h1>
                    <p className="lead max-w-2xl mb-8">
                        Connect with seniors, find curated lecture notes, auto-summarize long resources, and keep up with hackathons — all in one unified, smart dashboard.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mb-10">
                        <Link to="/mentorship" className="btn primary px-8 py-3 text-base">Start Mentorship</Link>
                        <Link to="/summarizer" className="btn px-8 py-3 text-base">Try AI Summarizer</Link>
                        <div className="flex-grow hidden sm:block"></div>
                        <div className="relative w-full sm:w-auto mt-4 sm:mt-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-2)]" size={18} />
                            <input
                                type="text"
                                placeholder="Search notes, events..."
                                className="search-input pl-10 w-full sm:w-64 py-2.5 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={Users}
                            title="Mentorship"
                            description="Connect with seniors for 1:1 sessions or join topic-based chat rooms."
                            color="bg-orange-400"
                            delay={100}
                        />
                        <FeatureCard
                            icon={BookOpen}
                            title="Lecture Notes"
                            description="Access a repository of notes uploaded by faculty and verified seniors."
                            color="bg-emerald-500"
                            delay={200}
                        />
                        <FeatureCard
                            icon={Sparkles}
                            title="AI Summarizer"
                            description="Upload PDFs or PPTs to generate instant summaries and practice quizzes."
                            color="bg-indigo-500"
                            delay={300}
                        />
                    </div>
                </div>

                {/* Aside Sidebar */}
                <aside className="h-full">
                    <div className="glass-card h-full flex flex-col p-6">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-bold">Today</h3>
                                <p className="text-xs text-[var(--muted)] font-medium">Quick actions & recent items</p>
                            </div>
                            <div className="badge flex items-center gap-1">
                                <Clock size={12} />
                                <span>LIVE</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-5">
                            {loading ? (
                                <div className="text-[var(--muted)] text-sm italic">Loading updates...</div>
                            ) : (
                                <>
                                    {events.length > 0 && events.map(event => (
                                        <SmallActionCard
                                            key={event._id}
                                            title={event.title}
                                            subtitle={`${event.location} • ${new Date(event.date).toLocaleDateString()}`}
                                            info={event.type}
                                            buttonText="Join"
                                            link="/events"
                                            icon={Calendar}
                                        />
                                    ))}

                                    {notes.length > 0 && notes.map(note => (
                                        <SmallActionCard
                                            key={note._id}
                                            title={`New notes: ${note.subject}`}
                                            subtitle={`Uploaded by ${note.uploadedBy?.name}`}
                                            info="Resource"
                                            buttonText="Open"
                                            link="/updates"
                                            icon={FileText}
                                        />
                                    ))}

                                    <SmallActionCard
                                        title="Try AI Summarizer"
                                        subtitle="Convert long PDFs into 3-min summaries."
                                        info="New Feature"
                                        buttonText="Upload"
                                        link="/summarizer"
                                        icon={Sparkles}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </aside>
            </section>

            {/* Explore Section */}
            <section className="mb-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold">Explore Features</h2>
                        <p className="text-[var(--muted)] text-sm">Designed for vibrant campus communities</p>
                    </div>
                    <Link to="/mentorship" className="text-[var(--accent-1)] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                        See all features <ChevronRight size={16} />
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="card group cursor-pointer transition-all">
                        <div className="h-40 rounded-xl mb-6 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-950/30 dark:to-orange-900/20 flex items-center justify-center">
                            <Calendar size={60} className="text-orange-400 group-hover:scale-110 transition-transform" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Event Feed</h3>
                        <p className="text-[var(--muted)] text-sm mb-6">A news-style feed for upcoming hackathons, socials, and workshops. Filter by your interests.</p>
                        <Link to="/events" className="btn w-full justify-center">Browse Events</Link>
                    </div>

                    <div className="card group cursor-pointer transition-all">
                        <div className="h-40 rounded-xl mb-6 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-950/30 dark:to-emerald-900/20 flex items-center justify-center">
                            <MessageSquare size={60} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Community Chat</h3>
                        <p className="text-[var(--muted)] text-sm mb-6">Real-time chat rooms for societies, clubs, and study groups. Meet people sharing your goals.</p>
                        <Link to="/community" className="btn w-full justify-center">Open Community</Link>
                    </div>

                    <div className="card group cursor-pointer transition-all">
                        <div className="h-40 rounded-xl mb-6 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-950/30 dark:to-indigo-900/20 flex items-center justify-center">
                            <TrendingUp size={60} className="text-indigo-500 group-hover:scale-110 transition-transform" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Goal Tracking</h3>
                        <p className="text-[var(--muted)] text-sm mb-6">Personalized dashboard to keep track of your notes, calendar events, and mentorship bookings.</p>
                        <Link to="/calendar" className="btn w-full justify-center">My Schedule</Link>
                    </div>
                </div>
            </section>

            {/* Stats / CTA */}
            <section className="glass-card bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-3)] py-16 px-10 text-center relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
                
                <div className="relative z-10">
                    <div className="flex justify-center gap-12 mb-10">
                        <div>
                            <div className="text-4xl font-black text-white mb-1">5K+</div>
                            <div className="text-white/60 text-xs font-bold uppercase tracking-widest">Students</div>
                        </div>
                        <div className="w-px bg-white/20"></div>
                        <div>
                            <div className="text-4xl font-black text-white mb-1">200+</div>
                            <div className="text-white/60 text-xs font-bold uppercase tracking-widest">Mentors</div>
                        </div>
                        <div className="w-px bg-white/20"></div>
                        <div>
                            <div className="text-4xl font-black text-white mb-1">50+</div>
                            <div className="text-white/60 text-xs font-bold uppercase tracking-widest">Universities</div>
                        </div>
                    </div>
                    <h2 className="text-white text-3xl mb-4 font-black">Join the Nexus Community Today</h2>
                    <p className="text-white/80 max-w-xl mx-auto mb-10 text-lg leading-relaxed">
                        The best time to start networking and building your academic presence is today. Connect, share, and grow with Nexus.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/login" className="bg-white text-[var(--accent-1)] px-10 py-4 rounded-xl font-black text-lg shadow-2xl hover:bg-neutral-50 hover:scale-105 transition-all no-underline">
                            Create Free Account
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;

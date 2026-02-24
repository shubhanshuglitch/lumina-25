import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import {
    Calendar, MapPin, Tag, Search,
    ChevronRight, Sparkles, Clock, PlusCircle
} from 'lucide-react';

const EventCard = ({ event }) => (
    <div className="card hover:shadow-2xl transition-all group border-l-4 border-l-[var(--accent-1)]">
        <div className="flex justify-between items-start mb-4">
            <div className="badge bg-[var(--glass)] px-3 py-1 text-[10px] uppercase font-black tracking-widest text-[var(--accent-1)]">
                {event.type}
            </div>
            <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${event.status === 'in-progress' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                }`}>
                {event.status}
            </div>
        </div>

        <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--accent-1)] transition-colors">{event.title}</h3>
        <p className="text-[var(--muted)] text-sm mb-6 line-clamp-2">{event.description}</p>

        <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-[var(--muted-2)] text-xs font-bold">
                <Calendar size={14} className="text-[var(--accent-3)]" />
                <span>{new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--muted-2)] text-xs font-bold">
                <MapPin size={14} className="text-[var(--accent-2)]" />
                <span>{event.location}</span>
            </div>
        </div>

        <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--glass)] flex items-center justify-center text-[var(--muted)] font-bold text-[10px] border border-[var(--border)]">
                    {event.submittedBy?.avatarInitials}
                </div>
                <span className="text-[10px] font-bold text-[var(--muted)]">{event.submittedBy?.name}</span>
            </div>
            <button className="btn px-4 py-1.5 text-xs">Details</button>
        </div>
    </div>
);

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async (query = '') => {
        setLoading(true);
        try {
            const res = await api.get(query ? `/events/search?q=${query}` : '/events');
            setEvents(res.data);
        } catch (err) {
            console.error('Error fetching events:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchEvents(search);
    };

    return (
        <div className="container py-12 animate-in-up">
            <section className="grid lg:grid-cols-[1fr,420px] gap-10 items-center mb-12">
                <div className="glass-card">
                    <div className="kicker">Campus Events</div>
                    <h1 className="mb-6">Aggregated feed of upcoming hackathons, workshops and socials</h1>
                    <p className="lead mb-8">
                        Stay updated with everything happening on campus. From technical hackathons to social club meetups, find your next big opportunity here.
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <form onSubmit={handleSearch} className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-2)]" size={18} />
                            <input
                                type="text"
                                placeholder="Search events, topics..."
                                className="search-input pl-10 h-12 rounded-xl"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </form>
                        <Link to="/events/submit" className="btn primary h-12 px-6">
                            <PlusCircle size={20} />
                            <span>Submit Event</span>
                        </Link>
                    </div>
                </div>

                <aside>
                    <div className="glass-card p-6 h-full flex flex-col">
                        <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-[var(--accent-1)]">
                            <Sparkles size={18} />
                            Top This Week
                        </h4>
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/30 group cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-950/50 transition-colors">
                                <h5 className="font-bold text-sm text-orange-900 dark:text-orange-300 group-hover:text-[var(--accent-1)] mb-1">Nexus 2025</h5>
                                <p className="text-[10px] text-orange-700 dark:text-orange-400 font-bold uppercase tracking-wider mb-2">Virtual Hackathon • 12 Nov</p>
                                <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400">
                                    <Clock size={12} />
                                    <span>In Progress</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 group cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors">
                                <h5 className="font-bold text-sm text-emerald-900 dark:text-emerald-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-200 mb-1">React-Native Day</h5>
                                <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">Workshop • 15 Nov</p>
                            </div>
                        </div>
                        <Link to="/calendar" className="mt-8 text-center text-xs font-bold text-[var(--muted-2)] hover:text-[var(--text)] transition-colors underline underline-offset-4">
                            View Calendar View
                        </Link>
                    </div>
                </aside>
            </section>

            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">Event Feed</h2>
                    <div className="text-[var(--muted)] text-sm font-medium">{events.length} events found</div>
                </div>

                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-72 rounded-2xl skeleton border border-[var(--border)]"></div>
                        ))}
                    </div>
                ) : events.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
                        {events.map(event => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[var(--glass)] rounded-3xl border border-dashed border-[var(--border)]">
                        <Calendar size={48} className="mx-auto text-[var(--muted-2)] mb-4" />
                        <h3 className="text-xl font-bold mb-2">No events found</h3>
                        <p className="text-[var(--muted)]">Be the first to submit an exciting campus event!</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default EventsPage;

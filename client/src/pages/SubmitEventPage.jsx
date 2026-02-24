import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import {
    ChevronLeft, PlusCircle, Calendar, MapPin,
    Type, AlignLeft, Send, Sparkles, CheckCircle
} from 'lucide-react';

const SubmitEventPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        type: 'hackathon',
        location: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/events', formData);
            setSuccess(true);
            setTimeout(() => navigate('/events'), 2000);
        } catch (err) {
            console.error('Submit error:', err);
            alert('Failed to submit event. Please check all fields.');
        } finally {
            setLoading(false);
        }
    };

    if (success) return (
        <div className="container py-32 text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-black mb-2">Event Submitted!</h2>
            <p className="text-[var(--muted)]">Your event is now live on the feed. Redirecting...</p>
        </div>
    );

    return (
        <div className="container py-12 animate-in-up max-w-2xl">
            <Link to="/events" className="inline-flex items-center gap-2 text-[var(--muted-2)] font-bold mb-8 hover:text-[var(--text)] transition-colors no-underline uppercase tracking-widest text-[10px]">
                <ChevronLeft size={16} /> Back to Feed
            </Link>

            <div className="glass-card p-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 text-[var(--accent-1)] flex items-center justify-center">
                        <PlusCircle size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black">Submit Campus Event</h1>
                        <div className="flex items-center gap-2 text-[var(--muted-2)] text-[10px] font-black uppercase tracking-widest mt-1">
                            <Sparkles size={12} /> Live on Feed
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-[var(--muted-2)] mb-2">Event Title</label>
                        <div className="relative">
                            <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-2)]" size={18} />
                            <input
                                type="text"
                                name="title"
                                required
                                placeholder="e.g. Nexus Hackathon '25"
                                className="search-input pl-10 h-12 rounded-xl"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-[var(--muted-2)] mb-2">Date & Time</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-2)]" size={18} />
                                <input
                                    type="datetime-local"
                                    name="date"
                                    required
                                    className="search-input pl-10 h-12 rounded-xl"
                                    value={formData.date}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-[var(--muted-2)] mb-2">Event Type</label>
                            <select
                                name="type"
                                required
                                className="search-input h-12 rounded-xl border-0 bg-[var(--glass)]"
                                value={formData.type}
                                onChange={handleChange}
                            >
                                <option value="hackathon">Hackathon</option>
                                <option value="workshop">Workshop</option>
                                <option value="social">Social</option>
                                <option value="seminar">Seminar</option>
                                <option value="club">Club Meeting</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-[var(--muted-2)] mb-2">Location / Link</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-2)]" size={18} />
                            <input
                                type="text"
                                name="location"
                                required
                                placeholder="e.g. Auditorium B or Zoom Link"
                                className="search-input pl-10 h-12 rounded-xl"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-[var(--muted-2)] mb-2">Description</label>
                        <div className="relative">
                            <AlignLeft className="absolute left-3 top-4 text-[var(--muted-2)]" size={18} />
                            <textarea
                                name="description"
                                required
                                rows="5"
                                placeholder="Provide details about the event, speakers, and requirements..."
                                className="search-input pl-10 py-4 rounded-xl resize-none"
                                value={formData.description}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn primary w-full py-4 h-auto justify-center gap-2 group shadow-2xl"
                        >
                            {loading ? 'Submitting...' : (
                                <>
                                    <Send size={20} />
                                    <span className="font-black tracking-widest uppercase text-sm">Publish Now</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubmitEventPage;

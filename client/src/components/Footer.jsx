import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Github, Twitter, MessageCircle } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="mt-auto border-t border-[var(--border)] bg-[var(--panel-opaque)]">
            <div className="container mx-auto px-6">
                {/* Main footer content */}
                <div className="py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-1)] via-[var(--accent-2)] to-[var(--accent-3)] flex items-center justify-center text-white font-black text-lg border border-white/20">
                                N
                            </div>
                            <div className="font-bold text-[var(--text)] text-lg">Nexus</div>
                        </div>
                        <p className="text-[var(--muted)] text-sm leading-relaxed mb-4 max-w-xs">
                            Your smart campus hub for mentorship, notes, events, and AI-powered study tools.
                        </p>
                        <div className="flex items-center gap-3">
                            <a href="#" className="w-8 h-8 rounded-lg bg-[var(--glass)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--glass-2)] transition-all">
                                <Github size={16} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-lg bg-[var(--glass)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--glass-2)] transition-all">
                                <Twitter size={16} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-lg bg-[var(--glass)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--glass-2)] transition-all">
                                <MessageCircle size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-2)] mb-4">Platform</h4>
                        <div className="flex flex-col gap-2">
                            <Link to="/mentorship" className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors no-underline">Mentorship</Link>
                            <Link to="/updates" className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors no-underline">Updates & Notes</Link>
                            <Link to="/summarizer" className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors no-underline">AI Summarizer</Link>
                            <Link to="/events" className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors no-underline">Events</Link>
                        </div>
                    </div>

                    {/* Community */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-2)] mb-4">Community</h4>
                        <div className="flex flex-col gap-2">
                            <Link to="/community" className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors no-underline">Chat Rooms</Link>
                            <Link to="/calendar" className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors no-underline">Calendar</Link>
                            <Link to="/events/submit" className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors no-underline">Submit Event</Link>
                        </div>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-2)] mb-4">Legal</h4>
                        <div className="flex flex-col gap-2">
                            <Link to="/privacy" className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors no-underline">Privacy Policy</Link>
                            <Link to="/terms" className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors no-underline">Terms of Service</Link>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="py-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-[var(--muted)] text-sm flex items-center gap-1.5">
                        Made with <Heart size={14} className="text-red-400 fill-current animate-pulse" /> by students
                    </div>
                    <div className="text-[12px] text-[var(--muted-2)]">
                        &copy; {new Date().getFullYear()} Nexus Studio. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

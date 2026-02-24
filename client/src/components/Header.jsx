import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, LogIn, User, Search, Calendar as CalendarIcon, Menu, X } from 'lucide-react';

const Header = ({ isDark, toggleTheme }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const navLinks = [
        { label: 'Mentorship', path: '/mentorship' },
        { label: 'Updates & Notes', path: '/updates' },
        { label: 'Smart Summarizer', path: '/summarizer' },
        { label: 'Events', path: '/events' },
        { label: 'Community', path: '/community' },
    ];

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <header className={`sticky top-0 z-50 backdrop-blur-md bg-opacity-80 border-b border-[var(--border)] bg-[var(--panel-opaque)] transition-shadow duration-300 ${scrolled ? 'shadow-lg shadow-black/[0.04]' : ''}`}>
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Brand */}
                <Link to="/" className="flex items-center gap-3 no-underline group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-1)] via-[var(--accent-2)] to-[var(--accent-3)] flex items-center justify-center shadow-lg text-white font-black text-xl border border-white/20 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                        N
                    </div>
                    <div className="hidden sm:block">
                        <div className="font-extrabold text-[var(--text)] text-lg leading-tight">Nexus</div>
                        <div className="text-[var(--muted-2)] text-[10px] tracking-wider uppercase font-bold">Smart Campus Hub</div>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`px-4 py-2 rounded-xl text-[13px] font-bold uppercase tracking-wider transition-all no-underline relative ${
                                isActive(link.path)
                                    ? 'text-[var(--accent-1)] bg-[var(--glass)]'
                                    : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--glass)]'
                            }`}
                        >
                            {link.label}
                            {isActive(link.path) && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-[var(--accent-1)]"></span>}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <Link to="/calendar" className="btn hidden sm:flex" title="Calendar">
                        <CalendarIcon size={18} />
                        <span className="hidden xl:inline">Calendar</span>
                    </Link>

                    <button
                        onClick={toggleTheme}
                        className="btn aspect-square p-2 group"
                        title="Toggle theme"
                    >
                        {isDark ? <Sun size={20} className="text-yellow-400 group-hover:rotate-45 transition-transform duration-300" /> : <Moon size={20} className="group-hover:-rotate-12 transition-transform duration-300" />}
                    </button>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link to="/" className="flex items-center gap-2 no-underline group">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--accent-4)] to-[var(--accent-2)] flex items-center justify-center text-white font-bold border-2 border-white shadow-sm">
                                    {user.avatarInitials}
                                </div>
                                <span className="hidden md:inline font-bold text-[var(--text)] text-sm">{user.name}</span>
                            </Link>
                            <button onClick={logout} className="btn text-xs px-3 py-2">Logout</button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn primary flex items-center gap-2 shadow-xl hover:shadow-2xl transition-shadow">
                            <LogIn size={18} />
                            <span>Get Started</span>
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden btn p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="bg-[var(--panel)] border-b border-[var(--border)] p-4">
                    <div className="flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`px-4 py-3 rounded-lg font-bold no-underline transition-all ${
                                    isActive(link.path)
                                        ? 'text-[var(--accent-1)] bg-[var(--glass)]'
                                        : 'text-[var(--muted)] hover:bg-[var(--glass)]'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link to="/calendar" className="btn flex justify-center mt-2" onClick={() => setIsMenuOpen(false)}>
                            <CalendarIcon size={18} />
                            <span>Calendar</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

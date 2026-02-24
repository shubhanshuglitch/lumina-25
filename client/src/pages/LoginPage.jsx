import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, LogIn, ChevronRight, GraduationCap } from 'lucide-react';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData);
            }
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-20 flex justify-center items-center animate-in-up">
            <div className="w-full max-w-md">
                <div className="glass-card mb-4 text-center relative overflow-hidden">
                    {/* Decorative background */}
                    <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-br from-[var(--accent-1)] to-transparent opacity-10 blur-2xl"></div>
                    <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-gradient-to-br from-[var(--accent-3)] to-transparent opacity-10 blur-2xl"></div>
                    
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent-1)] to-[var(--accent-3)] mx-auto mb-6 flex items-center justify-center text-white font-black text-2xl shadow-xl border border-white/20 animate-float">
                        N
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{isLogin ? 'Welcome back' : 'Join Nexus'}</h2>
                    <p className="text-[var(--muted)] text-sm mb-8">
                        {isLogin ? 'Sign in to access your dashboard' : 'Create an account to start your journey'}
                    </p>

                    <form onSubmit={handleSubmit} className="text-left">
                        {!isLogin && (
                            <div className="mb-4">
                                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted-2)] mb-2">Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-2)]" size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="search-input pl-10"
                                        placeholder="Your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted-2)] mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-2)]" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="search-input pl-10"
                                    placeholder="name@college.edu"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted-2)] mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-2)]" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    className="search-input pl-10"
                                    placeholder="Min. 8 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="mb-6">
                                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted-2)] mb-2">I am a</label>
                                <div className="flex gap-4">
                                    <label className="flex-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="student"
                                            checked={formData.role === 'student'}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        <div className={`p-3 text-center rounded-xl border-2 transition-all ${formData.role === 'student' ? 'border-[var(--accent-1)] bg-[var(--glass)] font-bold' : 'border-transparent bg-[var(--glass-2)]'}`}>
                                            Student
                                        </div>
                                    </label>
                                    <label className="flex-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="mentor"
                                            checked={formData.role === 'mentor'}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        <div className={`p-3 text-center rounded-xl border-2 transition-all ${formData.role === 'mentor' ? 'border-[var(--accent-1)] bg-[var(--glass)] font-bold' : 'border-transparent bg-[var(--glass-2)]'}`}>
                                            Mentor
                                        </div>
                                    </label>
                                </div>
                            </div>
                        )}

                        {error && <div className="mb-6 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium border border-red-200 dark:border-red-900/30">{error}</div>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn primary w-full py-3 h-auto text-lg flex items-center justify-center gap-2 group"
                        >
                            {loading ? 'Processing...' : (
                                <>
                                    <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
                                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-[var(--muted)] text-sm font-bold hover:text-[var(--text)] transition-colors"
                    >
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

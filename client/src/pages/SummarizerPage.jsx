import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import {
    Sparkles, Upload, FileText, ChevronRight,
    Brain, Zap, BookOpen, Clock, AlertCircle
} from 'lucide-react';

const SummaryCard = ({ summary }) => (
    <Link to={`/summarizer/${summary._id}`} className="card hover:border-[var(--accent-1)] transition-all group no-underline">
        <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Brain size={20} />
            </div>
            <div className="flex-grow min-w-0">
                <h4 className="text-sm font-bold group-hover:text-[var(--accent-1)] transition-colors truncate">{summary.title}</h4>
                <div className="text-[10px] text-[var(--muted-2)] font-bold uppercase tracking-widest truncate">{summary.originalFileName}</div>
            </div>
        </div>
        <p className="text-[var(--muted)] text-xs line-clamp-2 mb-4 leading-relaxed">
            {summary.summaryText}
        </p>
        <div className="flex items-center justify-between text-[10px] text-[var(--muted-2)] font-bold border-t border-[var(--border)] pt-4">
            <span className="flex items-center gap-1"><Clock size={10} /> {new Date(summary.createdAt).toLocaleDateString()}</span>
            <span className="text-[var(--accent-1)] uppercase tracking-tighter">View Summary</span>
        </div>
    </Link>
);

const SummarizerPage = () => {
    const [summaries, setSummaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSummaries();
    }, []);

    const fetchSummaries = async () => {
        setLoading(true);
        try {
            const res = await api.get('/summaries');
            setSummaries(res.data);
        } catch (err) {
            console.error('Error fetching summaries:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name.split('.')[0]);

        try {
            const res = await api.post('/summaries/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate(`/summarizer/${res.data._id}`);
        } catch (err) {
            console.error('Upload error:', err);
            alert('Upload failed. Only PDF/Text files are supported in this demo.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container py-12 animate-in-up">
            <section className="grid lg:grid-cols-[1fr,420px] gap-10 items-center mb-12">
                <div className="glass-card">
                    <div className="kicker">Smart Summarizer</div>
                    <h1 className="mb-6">Upload files and get crisp summaries, key points and quizzes</h1>
                    <p className="lead mb-8">
                        Supports PDF, PPT and Word documents. Uses AI to instantly extract key concepts, generate bulleted summaries, and create practice material.
                    </p>

                    <form onSubmit={handleUpload} className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative flex-grow w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--border)] rounded-2xl cursor-pointer hover:bg-[var(--glass)] hover:border-[var(--accent-1)] transition-all group/upload">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="text-[var(--muted-2)] mb-2 group-hover/upload:text-[var(--accent-1)] group-hover/upload:-translate-y-1 transition-all" size={24} />
                                    <p className="text-xs text-[var(--muted)] font-bold">
                                        {file ? file.name : <><span className="text-[var(--accent-1)]">Click to upload</span> or drag and drop</>}
                                    </p>
                                    <p className="text-[10px] text-[var(--muted-2)] mt-1 uppercase tracking-widest font-black">PDF, TXT (Max 50MB)</p>
                                </div>
                                <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} accept=".pdf,.txt" />
                            </label>
                        </div>
                        <button
                            type="submit"
                            disabled={!file || uploading}
                            className="btn primary h-auto py-4 px-10 w-full sm:w-auto self-stretch flex-col justify-center gap-1 shadow-2xl"
                        >
                            {uploading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : (
                                <>
                                    <div className="flex items-center gap-2 font-black text-lg">
                                        <Sparkles size={20} /> Summarize
                                    </div>
                                    <div className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Process with AI</div>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <aside>
                    <div className="glass-card p-6 h-full flex flex-col">
                        <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-indigo-600">
                            <Clock size={18} />
                            Recent History
                        </h4>
                        <div className="space-y-4">
                            {summaries.length > 0 ? summaries.slice(0, 3).map(s => (
                                <Link to={`/summarizer/${s._id}`} key={s._id} className="flex gap-3 p-3 rounded-xl hover:bg-[var(--glass)] transition-colors cursor-pointer no-underline text-inherit">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                                        <Brain size={16} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold leading-tight truncate w-48">{s.title}</div>
                                        <div className="text-[10px] text-[var(--muted-2)] mt-0.5">{new Date(s.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </Link>
                            )) : (
                                <div className="text-center py-8">
                                    <div className="text-[var(--muted-2)] text-xs mb-2 italic">No history yet</div>
                                    <p className="text-[10px] text-[var(--muted)]">Your summaries will appear here.</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 p-4 rounded-xl border border-dashed border-[var(--border)] bg-amber-50/30 dark:bg-amber-950/20">
                            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-[10px] uppercase tracking-widest mb-2">
                                <AlertCircle size={12} /> Pro Tip
                            </div>
                            <p className="text-[10px] text-amber-800 dark:text-amber-300 font-medium leading-normal">
                                Detailed PDFs result in better practice quizzes. Try uploading your lecture slides before major exams!
                            </p>
                        </div>
                    </div>
                </aside>
            </section>

            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">Your Summaries</h2>
                    <div className="text-[var(--muted)] text-sm font-medium">{summaries.length} total generated</div>
                </div>

                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-48 rounded-2xl skeleton border border-[var(--border)]"></div>
                        ))}
                    </div>
                ) : summaries.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
                        {summaries.map(s => (
                            <SummaryCard key={s._id} summary={s} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-[var(--glass)] rounded-3xl border border-dashed border-[var(--border)]">
                        <Zap size={48} className="mx-auto text-[var(--muted-2)] mb-4" />
                        <h3 className="text-xl font-bold mb-2">Ready to save time?</h3>
                        <p className="text-[var(--muted)] max-w-sm mx-auto">Upload a document above to get your first AI-powered summary and auto-generated study materials.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default SummarizerPage;

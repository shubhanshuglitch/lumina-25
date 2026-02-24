import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import {
    FileText, Download, Clock, ChevronLeft,
    Brain, Sparkles, BookOpen, ExternalLink, RefreshCw
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

const SummaryDetailPage = () => {
    const { id } = useParams();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await api.get(`/summaries/${id}`);
                setSummary(res.data);
            } catch (err) {
                console.error('Error fetching summary:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, [id]);

    if (loading) return (
        <div className="container py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--accent-1)] border-t-transparent mx-auto mb-4" />
            <p className="text-[var(--muted)] font-bold">Extracting key concepts...</p>
        </div>
    );

    if (!summary) return (
        <div className="container py-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Summary not found</h2>
            <Link to="/summarizer" className="btn primary">Go Back</Link>
        </div>
    );

    return (
        <div className="container py-12 animate-in-up">
            <Link to="/summarizer" className="inline-flex items-center gap-2 text-[var(--muted-2)] font-bold mb-8 hover:text-[var(--text)] transition-colors no-underline uppercase tracking-widest text-[10px]">
                <ChevronLeft size={16} /> Back to Summarizer
            </Link>

            <div className="grid lg:grid-cols-[1fr,360px] gap-8">
                <div className="space-y-8">
                    <div className="glass-card">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <div className="badge bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-2">AI Generated</div>
                                <h1 className="text-3xl font-black">{summary.title}</h1>
                                <div className="flex items-center gap-3 text-[var(--muted-2)] text-xs font-bold mt-2">
                                    <FileText size={14} />
                                    <span>{summary.originalFileName}</span>
                                    <span className="opacity-20">•</span>
                                    <Clock size={14} />
                                    <span>{new Date(summary.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <a
                                href={`${API_URL}${summary.originalFileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn bg-[var(--glass)] hover:bg-[var(--border)]"
                            >
                                <ExternalLink size={18} />
                                <span className="hidden sm:inline">Original File</span>
                            </a>
                        </div>

                        <div className="prose prose-stone prose-indigo max-w-none">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-600">
                                <Brain size={22} /> Executive Summary
                            </h3>
                            <p className="text-[var(--text)] leading-relaxed bg-[var(--glass)] p-6 rounded-2xl border border-[var(--border)] whitespace-pre-wrap">
                                {summary.summaryText}
                            </p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8">
                        <div className="glass-card">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-[var(--accent-2)]">
                                <Sparkles size={20} /> Key Takeaways
                            </h3>
                            <ul className="space-y-4">
                                {summary.keyPoints.map((point, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-[var(--muted)] leading-relaxed">
                                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-black">
                                            {i + 1}
                                        </div>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="glass-card">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-[var(--accent-3)]">
                                <BookOpen size={20} /> Practice Flashcards
                            </h3>
                            <div className="space-y-4">
                                {summary.flashcards.map((card, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 group cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-1">Concept {i + 1}</div>
                                        <div className="font-bold text-sm text-amber-900 dark:text-amber-200 group-hover:text-[var(--accent-1)] transition-colors mb-1">{card.question}</div>
                                        <div className="text-xs text-amber-700 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">{card.answer}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="space-y-6">
                    <div className="glass-card p-6 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white border-0 shadow-2xl">
                        <h4 className="text-lg font-bold mb-3">Save time on studying?</h4>
                        <p className="text-indigo-100 text-xs leading-relaxed mb-6">
                            Our AI extracted {summary.keyPoints.length} key points and {summary.flashcards.length} concepts from your document. Use these to prep for your next quiz!
                        </p>
                        <button className="btn w-full bg-white/20 border-white/20 text-white hover:bg-white/30 font-black tracking-widest text-[10px] uppercase py-3">
                            Export as PDF
                        </button>
                    </div>

                    <div className="glass-card p-6">
                        <h4 className="font-bold text-sm mb-4">Actions</h4>
                        <div className="space-y-2">
                            <button className="btn w-full justify-start text-xs">
                                <RefreshCw size={14} /> Re-generate Summary
                            </button>
                            <button className="btn w-full justify-start text-xs border-red-100 text-red-600 hover:bg-red-50">
                                Delete Record
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default SummaryDetailPage;

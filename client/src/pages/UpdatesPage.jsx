import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import {
    FileText, Download, Upload, Search,
    ChevronRight, BookOpen, Clock, Tag, ExternalLink,
    Plus, Filter, X, Sparkles
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

const NoteCard = ({ note }) => (
    <div className="card hover:shadow-2xl transition-all group">
        <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <FileText size={24} />
            </div>
            <div className="flex flex-col items-end">
                <div className="text-[10px] font-black uppercase text-[var(--muted-2)] tracking-widest">{note.subject}</div>
                <div className="text-[10px] text-[var(--muted)] mt-1">{new Date(note.createdAt).toLocaleDateString()}</div>
            </div>
        </div>

        <h4 className="text-lg font-bold mb-2 group-hover:text-[var(--accent-2)] transition-colors">{note.title}</h4>
        <p className="text-[var(--muted)] text-sm mb-6 line-clamp-2">{note.description || "Lecture notes and resources for student reference."}</p>

        <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-[var(--glass)] flex items-center justify-center text-[var(--muted)] font-bold text-[10px] border border-[var(--border)]">
                {note.uploadedBy?.avatarInitials}
            </div>
            <div className="text-[10px] font-bold text-[var(--muted)]">
                <div>{note.uploadedBy?.name}</div>
                <div className="opacity-60 uppercase tracking-tighter">Contributor</div>
            </div>
        </div>

        <div className="flex gap-2">
            <a
                href={`${API_URL}${note.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn flex-1 justify-center text-xs"
            >
                <ExternalLink size={14} /> View
            </a>
            <a
                href={`${API_URL}/api/notes/${note._id}/download`}
                className="btn primary flex-1 justify-center text-xs shadow-none"
            >
                <Download size={14} /> Download
            </a>
        </div>
    </div>
);

const UpdatesPage = () => {
    const [notes, setNotes] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Upload form state
    const [uploadData, setUploadData] = useState({ title: '', subject: '', description: '', file: null });
    const [uploadLoading, setUploadLoading] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async (query = '') => {
        setLoading(true);
        try {
            const res = await api.get(query ? `/notes/search?q=${query}` : '/notes');
            setNotes(res.data);
        } catch (err) {
            console.error('Error fetching notes:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchNotes(search);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadData.file) return alert('Please select a file');

        setUploadLoading(true);
        const formData = new FormData();
        formData.append('title', uploadData.title);
        formData.append('subject', uploadData.subject);
        formData.append('description', uploadData.description);
        formData.append('file', uploadData.file);

        try {
            await api.post('/notes/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setIsUploadModalOpen(false);
            setUploadData({ title: '', subject: '', description: '', file: null });
            fetchNotes();
        } catch (err) {
            console.error('Upload error:', err);
            alert('Upload failed');
        } finally {
            setUploadLoading(false);
        }
    };

    return (
        <div className="container py-12 animate-in-up relative">
            <section className="grid lg:grid-cols-[1fr,420px] gap-10 items-center mb-12">
                <div className="glass-card">
                    <div className="kicker">Updates & Notes</div>
                    <h1 className="mb-6">Centralized dashboard for timetables, lecture notes and announcements</h1>
                    <p className="lead mb-8">
                        Access curated study materials and stay up to date with the latest course announcements. Verified seniors and faculty can contribute resources.
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <form onSubmit={handleSearch} className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-2)]" size={18} />
                            <input
                                type="text"
                                placeholder="Search by subject, title, or keyword..."
                                className="search-input pl-10 h-12 rounded-xl"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </form>
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="btn primary h-12 px-6"
                        >
                            <Upload size={20} />
                            <span>Upload Resource</span>
                        </button>
                    </div>
                </div>

                <aside>
                    <div className="glass-card p-6 h-full flex flex-col">
                        <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-[var(--accent-2)]">
                            <Clock size={18} />
                            Recent Activity
                        </h4>
                        <div className="space-y-4">
                            {notes.slice(0, 3).map(note => (
                                <div key={note._id} className="flex gap-3 p-3 rounded-xl hover:bg-[var(--glass)] transition-colors cursor-pointer">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                        <FileText size={16} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold leading-tight">{note.title}</div>
                                        <div className="text-[10px] text-[var(--muted-2)] mt-0.5">Uploaded {new Date(note.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link to="/summarizer" className="mt-8 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30 flex items-center gap-3 group no-underline">
                            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                                <Sparkles size={20} />
                            </div>
                            <div className="flex-grow">
                                <div className="text-xs font-black text-indigo-900 dark:text-indigo-300 leading-tight">AI Summarizer</div>
                                <div className="text-[10px] text-indigo-700 dark:text-indigo-400 font-bold uppercase tracking-wider">Try now</div>
                            </div>
                            <ChevronRight size={18} className="text-indigo-400 dark:text-indigo-500 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </aside>
            </section>

            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">Repository</h2>
                    <div className="flex items-center gap-4">
                        <div className="text-[var(--muted)] text-sm font-medium">{notes.length} resources available</div>
                        <button className="btn px-3 py-1.5 text-xs">
                            <Filter size={14} /> Filter
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-64 rounded-2xl skeleton border border-[var(--border)]"></div>
                        ))}
                    </div>
                ) : notes.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
                        {notes.map(note => (
                            <NoteCard key={note._id} note={note} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[var(--glass)] rounded-3xl border border-dashed border-[var(--border)]">
                        <BookOpen size={48} className="mx-auto text-[var(--muted-2)] mb-4" />
                        <h3 className="text-xl font-bold mb-2">Repository is empty</h3>
                        <p className="text-[var(--muted)]">Upload the first study material for your campus.</p>
                    </div>
                )}
            </section>

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="modal-overlay animate-in">
                    <div className="glass-card w-full max-w-md p-8 relative shadow-2xl animate-scale-in">
                        <button
                            onClick={() => setIsUploadModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-[var(--muted)] hover:text-[var(--text)]"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-2xl font-bold mb-6">Upload Resource</h3>

                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted-2)] mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. DS Lecture 08"
                                    className="search-input"
                                    value={uploadData.title}
                                    onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted-2)] mb-2">Subject</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Data Structures"
                                    className="search-input"
                                    value={uploadData.subject}
                                    onChange={(e) => setUploadData({ ...uploadData, subject: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted-2)] mb-2">Description</label>
                                <textarea
                                    rows="3"
                                    className="search-input resize-none"
                                    placeholder="Brief summary of the resource..."
                                    value={uploadData.description}
                                    onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted-2)] mb-2">File</label>
                                <input
                                    type="file"
                                    required
                                    className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[var(--glass)] file:text-[var(--muted)] hover:file:bg-[var(--border)]"
                                    onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0] })}
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={uploadLoading}
                                    className="btn primary w-full py-3 h-auto justify-center gap-2"
                                >
                                    {uploadLoading ? 'Uploading...' : (
                                        <>
                                            <Upload size={20} />
                                            <span>Publish to Repository</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdatesPage;

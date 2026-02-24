import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import {
    Users, MessageSquare, Search, Plus,
    ChevronRight, Hash, Globe, Lock, Shield
} from 'lucide-react';

const RoomCard = ({ room }) => (
    <div className="card hover:shadow-2xl transition-all group flex flex-col">
        <div className="flex items-center gap-4 mb-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg border-2 border-white ring-1 ring-[var(--border)] ${room.type === 'study' ? 'bg-indigo-500' : room.type === 'club' ? 'bg-emerald-500' : 'bg-orange-400'
                }`}>
                <Hash size={24} />
            </div>
            <div className="flex-grow min-w-0">
                <h4 className="text-lg font-bold group-hover:text-[var(--accent-1)] transition-colors truncate">{room.name}</h4>
                <div className="flex items-center gap-2 text-[var(--muted)] text-[10px] font-black uppercase tracking-widest mt-0.5">
                    {room.type === 'study' ? <BookOpen size={10} /> : <Users size={10} />}
                    <span>{room.type} Room</span>
                </div>
            </div>
        </div>

        <p className="text-[var(--muted)] text-sm mb-6 flex-grow line-clamp-2 leading-relaxed">
            {room.description || "A community space to collaborate, share resources, and learn together."}
        </p>

        <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center -space-x-2">
                {[...Array(Math.min(3, room.members?.length || 0))].map((_, i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-[var(--border)] border-2 border-white flex items-center justify-center text-[8px] font-bold text-[var(--muted-2)]">
                        U
                    </div>
                ))}
                {room.members?.length > 3 && (
                    <div className="text-[8px] font-bold text-[var(--muted-2)] ml-3">+{room.members.length - 3} members</div>
                )}
                {(!room.members || room.members.length === 0) && <div className="text-[10px] text-[var(--muted-2)] font-bold italic">New room</div>}
            </div>
            <Link to={`/room/${room._id}`} className="btn primary px-4 py-1.5 text-xs shadow-none">Enter</Link>
        </div>
    </div>
);

const BookOpen = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
);

const CommunityPage = () => {
    const [rooms, setRooms] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const res = await api.get('/rooms');
            setRooms(res.data);
        } catch (err) {
            console.error('Error fetching rooms:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredRooms = rooms.filter(room => {
        const matchesSearch = room.name.toLowerCase().includes(search.toLowerCase()) ||
            room.description.toLowerCase().includes(search.toLowerCase());
        const matchesTab = activeTab === 'all' || room.type === activeTab;
        return matchesSearch && matchesTab;
    });

    return (
        <div className="container py-12 animate-in-up">
            <section className="grid lg:grid-cols-[1fr,420px] gap-10 items-center mb-12">
                <div className="glass-card">
                    <div className="kicker">Nexus Community</div>
                    <h1 className="mb-6">Study groups, casual chats & society hub</h1>
                    <p className="lead mb-8">
                        Create or join moderated rooms, share resources, and build micro-communities across campus. Real-time collaboration made simple.
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-2)]" size={18} />
                            <input
                                type="text"
                                placeholder="Find a society or study group..."
                                className="search-input pl-10 h-12 rounded-xl"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button className="btn primary h-12 px-6">
                            <Plus size={20} />
                            <span>Create Room</span>
                        </button>
                    </div>
                </div>

                <aside>
                    <div className="glass-card p-6 h-full flex flex-col">
                        <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-[var(--accent-2)]">
                            <Shield size={18} />
                            Community Safety
                        </h4>
                        <div className="space-y-4">
                            <div className="flex gap-3 items-start">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                    <Globe size={16} />
                                </div>
                                <p className="text-[11px] leading-relaxed text-[var(--muted)]">
                                    All rooms are moderated by campus admins to ensure a healthy peer environment.
                                </p>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                                    <Lock size={16} />
                                </div>
                                <p className="text-[11px] leading-relaxed text-[var(--muted)]">
                                    Private rooms available for verified club members. Ask your society head for access.
                                </p>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-[var(--border)]">
                            <h5 className="text-xs font-black uppercase tracking-widest text-[var(--muted-2)] mb-4">Trending Now</h5>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between group cursor-pointer">
                                    <span className="text-sm font-bold group-hover:text-[var(--accent-1)] transition-colors">#DS-Study-Group</span>
                                    <span className="badge">Active</span>
                                </div>
                                <div className="flex items-center justify-between group cursor-pointer">
                                    <span className="text-sm font-bold group-hover:text-[var(--accent-1)] transition-colors">#Coding-Club</span>
                                    <span className="badge">30 Online</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </section>

            <section>
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                    <h2 className="text-2xl font-bold">Open Rooms</h2>
                    <div className="flex rounded-xl bg-[var(--glass)] border border-[var(--border)] p-1">
                        {['all', 'study', 'club', 'general'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[var(--card)] shadow-sm text-[var(--text)]' : 'text-[var(--muted-2)] hover:text-[var(--muted)]'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-64 rounded-2xl skeleton border border-[var(--border)]"></div>
                        ))}
                    </div>
                ) : filteredRooms.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 stagger-children">
                        {filteredRooms.map(room => (
                            <RoomCard key={room._id} room={room} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[var(--glass)] rounded-3xl border border-dashed border-[var(--border)]">
                        <MessageSquare size={48} className="mx-auto text-[var(--muted-2)] mb-4" />
                        <h3 className="text-xl font-bold mb-2">No rooms found</h3>
                        <p className="text-[var(--muted)]">Try a different search or explore another category.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default CommunityPage;

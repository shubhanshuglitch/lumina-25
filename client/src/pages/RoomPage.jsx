import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import {
    Send, ChevronLeft, Hash, Users,
    Clock, Shield, Info, MoreVertical,
    Smile, Paperclip, MessageSquare
} from 'lucide-react';

const RoomPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchRoom();

        // Initialize socket connection
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        newSocket.emit('join-room', id);

        newSocket.on('receive-message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchRoom = async () => {
        try {
            const res = await api.get(`/rooms/${id}`);
            setRoom(res.data.room);
            setMessages(res.data.messages);
        } catch (err) {
            console.error('Error fetching room:', err);
            navigate('/community');
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!input.trim() || !socket) return;

        const messageData = {
            roomId: id,
            senderId: user._id,
            content: input,
        };

        // Optimistic local update
        setMessages((prev) => [...prev, {
            content: input,
            sender: { _id: user._id, name: user.name, avatarInitials: user.avatarInitials },
            createdAt: new Date().toISOString(),
        }]);

        socket.emit('send-message', messageData);
        setInput('');
    };

    if (loading) return (
        <div className="container py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--accent-2)] border-t-transparent mx-auto mb-4" />
            <p className="text-[var(--muted)] font-bold">Connecting to community hub...</p>
        </div>
    );

    return (
        <div className="h-[calc(100vh-80px-64px)] overflow-hidden flex flex-col animate-in">
            {/* Room Header */}
            <div className="bg-[var(--panel-opaque)] border-b border-[var(--border)] px-6 py-4 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <Link to="/community" className="p-2 hover:bg-[var(--glass)] rounded-xl transition-colors">
                        <ChevronLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-lg">
                            <Hash size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black leading-tight">{room?.name}</h2>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--muted-2)]">
                                <Users size={10} />
                                <span>{room?.members?.length || 0} Members online</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="btn px-3 aspect-square" title="Room Info">
                        <Info size={18} />
                    </button>
                    <button className="btn px-3 aspect-square">
                        <MoreVertical size={18} />
                    </button>
                    <button className="btn primary hidden sm:flex text-xs px-4">Leave Room</button>
                </div>
            </div>

            <div className="flex-grow flex overflow-hidden">
                {/* Chat Area */}
                <div className="flex-grow flex flex-col bg-[var(--glass-2)]">
                    <div className="flex-grow overflow-y-auto p-6 space-y-6">
                        {messages.length > 0 ? messages.map((msg, i) => {
                            const isMe = msg.sender?._id === user._id;
                            return (
                                <div key={i} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-sm ${isMe ? 'bg-gradient-to-tr from-[var(--accent-1)] to-[var(--accent-3)]' : 'bg-gradient-to-tr from-[var(--accent-2)] to-indigo-500'
                                        }`}>
                                        {msg.sender?.avatarInitials || 'U'}
                                    </div>
                                    <div className={`max-w-[70%] ${isMe ? 'text-right' : ''}`}>
                                        <div className="flex items-center gap-2 mb-1 px-1">
                                            <span className="text-[10px] font-black uppercase text-[var(--muted-2)] tracking-widest">{msg.sender?.name}</span>
                                            <span className="text-[8px] text-[var(--muted-2)] opacity-60">{new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${isMe
                                                ? 'bg-[var(--accent-1)] text-white rounded-tr-none shadow-xl'
                                                : 'bg-[var(--card)] text-[var(--text)] rounded-tl-none border border-[var(--border)] shadow-sm'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-40">
                                <MessageSquare size={64} className="mb-4 text-[var(--muted-2)]" />
                                <p className="font-bold text-[var(--muted-2)]">No messages yet. Be the first to say hi!</p>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-[var(--panel-opaque)] border-t border-[var(--border)] backdrop-blur-sm">
                        <form onSubmit={handleSendMessage} className="relative">
                            <input
                                type="text"
                                placeholder={`Message # ${room?.name}...`}
                                className="search-input py-4 pl-12 pr-28 rounded-2xl h-auto"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button type="button" className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-2)] hover:text-[var(--text)]">
                                <Paperclip size={20} />
                            </button>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <button type="button" className="p-2 text-[var(--muted-2)] hover:text-[var(--text)]">
                                    <Smile size={20} />
                                </button>
                                <button type="submit" className="p-3 bg-[var(--accent-2)] text-white rounded-xl shadow-lg hover:shadow-emerald-100 transition-all hover:-translate-y-0.5">
                                    <Send size={20} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-80 border-l border-[var(--border)] bg-[var(--panel-opaque)] hidden xl:flex flex-col p-6 overflow-y-auto">
                    <div className="mb-8">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-2)] mb-4 flex items-center gap-2">
                            <Shield size={12} /> Moderators
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-orange-100 text-[var(--accent-1)] flex items-center justify-center text-[10px] font-black border border-orange-200">SA</div>
                                <span className="text-sm font-bold text-[var(--text)]">System Admin</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-2)] mb-4 flex items-center gap-2">
                            <Users size={12} /> Online — {room?.members?.length || 1}
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-sm font-medium text-[var(--text)]">{user.name} (You)</span>
                            </div>
                            {room?.members?.filter(m => m._id !== user._id).map(m => (
                                <div key={m._id} className="flex items-center gap-2 opacity-80">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-sm font-medium text-[var(--text)]">{m.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto p-4 rounded-xl bg-[var(--glass)] border border-[var(--border)]">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-2)] mb-2 flex items-center gap-1">
                            <Info size={10} /> Room Purpose
                        </h5>
                        <p className="text-[10px] text-[var(--muted-2)] leading-relaxed italic">
                            {room?.description || "Collaborative space for students to share ideas and resources."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomPage;

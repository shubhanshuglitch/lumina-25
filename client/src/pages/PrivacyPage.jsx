import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Shield, Lock, Eye } from 'lucide-react';

const PrivacyPage = () => {
    return (
        <div className="container py-20 animate-in-up max-w-3xl">
            <Link to="/" className="inline-flex items-center gap-2 text-[var(--muted-2)] font-bold mb-8 hover:text-[var(--text)] transition-colors no-underline uppercase tracking-widest text-[10px]">
                <ChevronLeft size={16} /> Back to Home
            </Link>
            <div className="glass-card p-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <Shield size={28} />
                    </div>
                    <h1 className="text-3xl font-black">Privacy Policy</h1>
                </div>
                <div className="prose prose-stone max-w-none space-y-6 text-[var(--muted)]">
                    <p>Last Updated: {new Date().toLocaleDateString()}</p>
                    <p>At Nexus, we take your privacy seriously. This policy outlines how we handle your data.</p>

                    <h3 className="text-xl font-bold text-[var(--text)]">1. Data We Collect</h3>
                    <p>We collect information you provide directly, such as your name, email address, and academic details when you register.</p>

                    <h3 className="text-xl font-bold text-[var(--text)]">2. How We Use Data</h3>
                    <p>Your data is used to provide mentorship connections, manage your calendar events, and improve the AI summarization features.</p>

                    <h3 className="text-xl font-bold text-[var(--text)]">3. Security</h3>
                    <p>We use industry-standard encryption to protect your account and personal information. Your passwords are hashed and never stored in plain text.</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;

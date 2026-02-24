import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, FileText, Scale, CheckCircle } from 'lucide-react';

const TermsPage = () => {
    return (
        <div className="container py-20 animate-in-up max-w-3xl">
            <Link to="/" className="inline-flex items-center gap-2 text-[var(--muted-2)] font-bold mb-8 hover:text-[var(--text)] transition-colors no-underline uppercase tracking-widest text-[10px]">
                <ChevronLeft size={16} /> Back to Home
            </Link>
            <div className="glass-card p-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <Scale size={28} />
                    </div>
                    <h1 className="text-3xl font-black">Terms of Service</h1>
                </div>
                <div className="prose prose-stone max-w-none space-y-6 text-[var(--muted)]">
                    <p>Last Updated: {new Date().toLocaleDateString()}</p>
                    <p>By using Nexus, you agree to the following terms.</p>

                    <h3 className="text-xl font-bold text-[var(--text)]">1. Acceptable Use</h3>
                    <p>Nexus is designed for academic collaboration. Users must respect copyright when uploading notes and maintain professionalism in community rooms.</p>

                    <h3 className="text-xl font-bold text-[var(--text)]">2. Mentorship</h3>
                    <p>Mentors are peer students or faculty. Nexus is not responsible for the accuracy of advice provided during 1:1 sessions.</p>

                    <h3 className="text-xl font-bold text-[var(--text)]">3. Intellectual Property</h3>
                    <p>You retain ownership of the content you upload, but grant Nexus a license to host and display it within the platform.</p>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '../api';
import {
    Calendar as CalendarIcon, Plus, X,
    MapPin, Clock, AlignLeft, Send, CheckCircle
} from 'lucide-react';

const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', description: '', color: '#c46b4e' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await api.get('/calendar');
            setEvents(res.data.map(e => ({
                id: e._id,
                title: e.title,
                start: e.start,
                end: e.end,
                description: e.description,
                backgroundColor: e.color || '#c46b4e',
                borderColor: 'transparent'
            })));
        } catch (err) {
            console.error('Error fetching calendar:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDateSelect = (selectInfo) => {
        setNewEvent({
            ...newEvent,
            start: selectInfo.startStr + 'T09:00',
            end: selectInfo.startStr + 'T10:00'
        });
        setIsModalOpen(true);
    };

    const handleEventClick = async (clickInfo) => {
        if (window.confirm(`Delete event '${clickInfo.event.title}'?`)) {
            try {
                await api.delete(`/calendar/${clickInfo.event.id}`);
                clickInfo.event.remove();
            } catch (err) {
                alert('Failed to delete event');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/calendar', newEvent);
            setIsModalOpen(false);
            setNewEvent({ title: '', start: '', end: '', description: '', color: '#c46b4e' });
            fetchEvents();
        } catch (err) {
            alert('Failed to save event');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container py-12 animate-in-up">
            <section className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                <div className="glass-card flex-grow w-full md:w-auto">
                    <div className="kicker">Schedule & Plans</div>
                    <h1 className="mb-2">Your Personal Academic Calendar</h1>
                    <p className="text-[var(--muted)] text-sm">Keep track of your classes, mentorship sessions, and personal study goals.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn primary h-auto py-5 px-10 rounded-2xl flex-col items-center gap-1 shadow-2xl"
                >
                    <Plus size={24} />
                    <span className="font-black tracking-widest uppercase text-[10px]">Add Event</span>
                </button>
            </section>

            <div className="glass-card p-4 md:p-8">
                {loading ? (
                    <div className="h-[600px] flex items-center justify-center italic text-[var(--muted)]">Initializing calendar...</div>
                ) : (
                    <div className="nexus-calendar">
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            selectable={true}
                            selectMirror={true}
                            dayMaxEvents={true}
                            events={events}
                            select={handleDateSelect}
                            eventClick={handleEventClick}
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,dayGridWeek'
                            }}
                            height="auto"
                        />
                    </div>
                )}
            </div>

            {/* Styling specific to FullCalendar to match Nexus theme */}
            <style>{`
        .fc { --fc-border-color: var(--border); --fc-button-bg-color: var(--accent-1); --fc-button-border-color: transparent; --fc-button-hover-bg-color: var(--accent-3); --fc-today-bg-color: var(--glass); --fc-page-bg-color: transparent; --fc-neutral-bg-color: var(--glass-2); }
        .fc .fc-toolbar-title { font-family: var(--font-serif); font-weight: 800; font-size: 1.5rem; color: var(--text); }
        .fc .fc-col-header-cell-cushion { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted-2); padding: 12px 0; text-decoration: none; }
        .fc .fc-daygrid-day-number { font-size: 0.85rem; font-weight: 700; color: var(--muted); padding: 8px; text-decoration: none; }
        .fc-event { border-radius: 6px; padding: 2px 4px; font-weight: 800; font-size: 0.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); cursor: pointer; border: none !important; }
        .fc-event-title { padding-left: 2px; }
        .fc .fc-button-primary:disabled { background-color: var(--muted-2); }
        .fc .fc-daygrid-day { background: transparent; }
        .fc th, .fc td { border-color: var(--border) !important; }
        .fc .fc-scrollgrid { border-color: var(--border) !important; }
        .fc .fc-button { transition: all 200ms ease; }
      `}</style>

            {/* Add Event Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="glass-card w-full max-w-md p-8 relative shadow-2xl animate-scale-in">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-[var(--muted)] hover:text-[var(--text)]"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <CalendarIcon className="text-[var(--accent-1)]" /> Add Event
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-[var(--muted-2)] mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Study DS with Mike"
                                    className="search-input"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-[var(--muted-2)] mb-2">Start</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        className="search-input text-xs"
                                        value={newEvent.start}
                                        onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-[var(--muted-2)] mb-2">End</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        className="search-input text-xs"
                                        value={newEvent.end}
                                        onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-[var(--muted-2)] mb-2">Color</label>
                                <div className="flex gap-2">
                                    {['#c46b4e', '#2f7a6b', '#d8a23f', '#7e9a56', '#6366f1'].map(c => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setNewEvent({ ...newEvent, color: c })}
                                            className={`w-8 h-8 rounded-full border-2 transition-transform ${newEvent.color === c ? 'scale-125 border-white shadow-lg' : 'border-transparent opacity-60'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-[var(--muted-2)] mb-2">Details</label>
                                <textarea
                                    rows="3"
                                    className="search-input resize-none"
                                    placeholder="Notes for yourself..."
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn primary w-full py-3 h-auto justify-center gap-2"
                                >
                                    {isSubmitting ? 'Saving...' : (
                                        <>
                                            <CheckCircle size={20} />
                                            <span className="font-black tracking-widest uppercase text-sm">Save Event</span>
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

export default CalendarPage;

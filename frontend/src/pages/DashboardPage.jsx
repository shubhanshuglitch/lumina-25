import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Component Imports
import UploadResourceForm from '../components/UploadResourceForm';
import ResourceSummary from '../components/ResourceSummary';

// Setup for react-big-calendar (must be outside the component)
const locales = { 'en-US': require('date-fns/locale/en-US') };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function DashboardPage() {
  // --- STATE ---
  const [announcements, setAnnouncements] = useState([]);
  const [resources, setResources] = useState([]);
  const [events, setEvents] = useState([]);
  const [summaryCache, setSummaryCache] = useState({}); // Stores summaries by announcement ID
  const [loadingSummary, setLoadingSummary] = useState(null); // Tracks which summary is loading

  const { currentUser, appUser } = useAuth(); // Get both user objects

  // --- DATA FETCHING ---
  const fetchData = async () => {
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken();
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Fetch all data in parallel
        const [annRes, resRes, evtRes] = await Promise.all([
          axios.get('http://localhost:5001/api/announcements', config),
          axios.get('http://localhost:5001/api/resources', config),
          axios.get('http://localhost:5001/api/events', config),
        ]);
        
        setAnnouncements(annRes.data);
        setResources(resRes.data);
        
        // Format events for react-big-calendar
        const formattedEvents = evtRes.data.map(event => ({
          ...event,
          title: event.title,
          start: new Date(event.startTime), // Convert string to Date
          end: new Date(event.endTime),   // Convert string to Date
        }));
        setEvents(formattedEvents);

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  // --- HANDLERS ---
  const handleSummarize = async (announcement) => {
    if (summaryCache[announcement._id]) return; // Already have summary

    setLoadingSummary(announcement._id); // Set loading for this specific button
    try {
      const token = await currentUser.getIdToken();
      const res = await axios.post(
        'http://localhost:5001/api/utils/summarize-text',
        { text: announcement.content }, // Send the announcement text
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Add the new summary to our cache
      setSummaryCache(prev => ({
        ...prev,
        [announcement._id]: res.data.summary,
      }));

    } catch (error) {
      console.error('Failed to summarize text:', error);
      setSummaryCache(prev => ({
        ...prev,
        [announcement._id]: 'Error generating summary.', // Show error
      }));
    } finally {
      setLoadingSummary(null); // Stop loading
    }
  };

  // --- PERMISSIONS ---
  const canUpload = appUser?.role === 'faculty' || appUser?.role === 'senior';

  // --- RENDER ---
  return (
    <div className="dashboard-container">
      <h1>Welcome, {appUser?.name || currentUser?.email}</h1>
      
      {/* Conditionally render upload form based on role */}
      {canUpload && (
        <div className="admin-section">
          <h2>Admin Controls</h2>
          <UploadResourceForm onUploadSuccess={fetchData} /> {/* Pass fetchData to refresh list on upload */}
        </div>
      )}

      <hr />

      <div className="dashboard-main">
        <div className="column announcements">
          <h2>Announcements</h2>
          {announcements.map(a => (
            <div key={a._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <h3>{a.title}</h3>
              <p>{a.content}</p>
              <small>By {a.author?.name || 'Admin'} on {new Date(a.createdAt).toLocaleDateString()}</small>
              
              {/* --- SUMMARY BUTTON LOGIC --- */}
              {summaryCache[a._id] ? (
                // If we have a summary, show it
                <p style={{ fontStyle: 'italic', background: '#f9f9f9', padding: '5px', marginTop: '5px' }}>
                  <strong>Summary:</strong> {summaryCache[a._id]}
                </p>
              ) : (
                // If no summary, show button (only if content is long)
                a.content.length > 200 && ( // Only show for announcements > 200 chars
                  <button 
                    onClick={() => handleSummarize(a)} 
                    disabled={loadingSummary === a._id}
                    style={{ marginTop: '5px' }}
                  >
                    {loadingSummary === a._id ? 'Summarizing...' : 'Summarize'}
                  </button>
                )
              )}
              {/* --------------------------- */}
            </div>
          ))}
        </div>

        <div className="column resources">
          <h2>Resources & Notes</h2>
          {resources.map(r => (
            <div key={r._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <h3>{r.title} ({r.type})</h3>
              <p>Uploaded by: {r.uploader?.name}</p>
              <a href={r.fileUrl} target="_blank" rel="noopener noreferrer">
                Download
              </a>
              {/* --- RESOURCE SUMMARY COMPONENT --- */}
              <ResourceSummary resource={r} />
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-calendar">
        <h2>Event Calendar</h2>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </div>
    </div>
  );
}
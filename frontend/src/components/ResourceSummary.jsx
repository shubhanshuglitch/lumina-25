import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ResourceSummary({ resource }) {
  const [summaryData, setSummaryData] = useState(resource.summary ? {
    summary: resource.summary,
    keyPoints: resource.keyPoints,
    quiz: resource.quiz,
  } : null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  const generateSummary = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    setError('');

    try {
      const token = await currentUser.getIdToken();
      const res = await axios.post(
        `http://localhost:5001/api/resources/${resource._id}/summarize`,
        {}, // Empty body
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSummaryData(res.data);
    } catch (err) {
      console.error('Summary generation failed:', err);
      setError('Failed to generate summary. The file might not be a PDF.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="resource-summary-section" style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
      {summaryData ? (
        <div className="summary-content">
          <h4>Summary</h4>
          <p>{summaryData.summary}</p>
          <h4>Key Points</h4>
          <ul>
            {summaryData.keyPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
          <h4>Quiz</h4>
          {summaryData.quiz.map((q, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <strong>{index + 1}. {q.question}</strong>
              <ul>
                {q.options.map((opt, i) => (
                  <li key={i}>{opt} {opt === q.answer ? '(Correct)' : ''}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <button onClick={generateSummary} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate AI Summary'}
        </button>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
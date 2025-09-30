import React, { useState, useEffect } from 'react';

const Stopwatch = ({ customerId, onTimeEntryCreated, onTimeEntryUpdated }) => {
  const [timeEntries, setTimeEntries] = useState([]);
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    fetchTimeEntries();
  }, [customerId]);

  const fetchTimeEntries = async () => {
    try {
      const response = await fetch(`/api/customers/${customerId}/time-entries`);
      const data = await response.json();
      setTimeEntries(data);
    } catch (error) {
      console.error('Error fetching time entries:', error);
    }
  };

  const handleStartTimer = async () => {
    if (!newDescription.trim()) {
      alert('Bitte geben Sie eine Beschreibung ein.');
      return;
    }

    try {
      const response = await fetch(`/api/customers/${customerId}/time-entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: newDescription })
      });

      if (response.ok) {
        setNewDescription('');
        fetchTimeEntries();
        onTimeEntryCreated();
      } else {
        alert('Fehler beim Starten des Timers');
      }
    } catch (error) {
      console.error('Error starting timer:', error);
      alert('Fehler beim Starten des Timers');
    }
  };

  const handlePauseTimer = async (entryId) => {
    try {
      const response = await fetch(`/api/time-entries/${entryId}/pause`, {
        method: 'PUT'
      });

      if (response.ok) {
        fetchTimeEntries();
        onTimeEntryUpdated();
      } else {
        alert('Fehler beim Pausieren des Timers');
      }
    } catch (error) {
      console.error('Error pausing timer:', error);
      alert('Fehler beim Pausieren des Timers');
    }
  };

  const handleResumeTimer = async (entryId) => {
    try {
      const response = await fetch(`/api/time-entries/${entryId}/resume`, {
        method: 'PUT'
      });

      if (response.ok) {
        fetchTimeEntries();
        onTimeEntryUpdated();
      } else {
        alert('Fehler beim Fortsetzen des Timers');
      }
    } catch (error) {
      console.error('Error resuming timer:', error);
      alert('Fehler beim Fortsetzen des Timers');
    }
  };

  const handleFinishTimer = async (entryId) => {
    try {
      const response = await fetch(`/api/time-entries/${entryId}/finish`, {
        method: 'PUT'
      });

      if (response.ok) {
        fetchTimeEntries();
        onTimeEntryUpdated();
      } else {
        alert('Fehler beim Beenden des Timers');
      }
    } catch (error) {
      console.error('Error finishing timer:', error);
      alert('Fehler beim Beenden des Timers');
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentDuration = (entry) => {
    if (!entry.is_running) {
      return entry.duration_seconds;
    }
    
    const startTime = new Date(entry.start_time);
    const now = new Date();
    const elapsed = Math.floor((now - startTime) / 1000);
    return entry.duration_seconds + elapsed;
  };

  return (
    <div>
      <div className="form-group">
        <label htmlFor="description">Neue Zeitbuchung</label>
        <input
          type="text"
          id="description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Beschreibung der Tätigkeit..."
        />
        <button 
          className="btn btn-success" 
          onClick={handleStartTimer}
          style={{ marginTop: '10px' }}
        >
          Timer starten
        </button>
      </div>

      <div>
        <h4>Aktive Zeitbuchungen</h4>
        {timeEntries.filter(entry => entry.is_running).map(entry => (
          <div key={entry.id} className="stopwatch running">
            <h5>{entry.description}</h5>
            <div className="stopwatch-time">
              {formatTime(getCurrentDuration(entry))}
            </div>
            <div className="stopwatch-controls">
              <button 
                className="btn btn-warning"
                onClick={() => handlePauseTimer(entry.id)}
              >
                Pausieren
              </button>
              <button 
                className="btn btn-success"
                onClick={() => handleFinishTimer(entry.id)}
              >
                Beenden
              </button>
            </div>
          </div>
        ))}

        <h4>Pausierte Zeitbuchungen</h4>
        {timeEntries.filter(entry => !entry.is_running && !entry.end_time).map(entry => (
          <div key={entry.id} className="stopwatch">
            <h5>{entry.description}</h5>
            <div className="stopwatch-time">
              {formatTime(entry.duration_seconds)}
            </div>
            <div className="stopwatch-controls">
              <button 
                className="btn btn-success"
                onClick={() => handleResumeTimer(entry.id)}
              >
                Fortsetzen
              </button>
              <button 
                className="btn"
                onClick={() => handleFinishTimer(entry.id)}
              >
                Beenden
              </button>
            </div>
          </div>
        ))}

        <h4>Abgeschlossene Zeitbuchungen</h4>
        {timeEntries.filter(entry => entry.end_time).map(entry => (
          <div key={entry.id} className="time-entry">
            <h5>{entry.description}</h5>
            <p><strong>Dauer:</strong> {formatTime(entry.duration_seconds)}</p>
            <p><strong>Start:</strong> {new Date(entry.start_time).toLocaleString('de-DE')}</p>
            <p><strong>Ende:</strong> {new Date(entry.end_time).toLocaleString('de-DE')}</p>
          </div>
        ))}

        {timeEntries.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
            Noch keine Zeitbuchungen vorhanden.
          </p>
        )}
      </div>
    </div>
  );
};

export default Stopwatch;

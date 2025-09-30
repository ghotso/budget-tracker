import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import StartStopwatchModal from './StartStopwatchModal';

const Dashboard = ({ customers, onCustomerSelect }) => {
  const navigate = useNavigate();
  const [runningStopwatches, setRunningStopwatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showStartModal, setShowStartModal] = useState(false);

  // Update current time every second for real-time display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchRunningStopwatches = useCallback(async () => {
    try {
      const response = await fetch('/api/running-stopwatches');
      const data = await response.json();
      setRunningStopwatches(data);
    } catch (error) {
      console.error('Error fetching running stopwatches:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRunningStopwatches();
    // Refresh every 30 seconds
    const interval = setInterval(fetchRunningStopwatches, 30000);
    return () => clearInterval(interval);
  }, [fetchRunningStopwatches]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentDuration = (entry) => {
    if (!entry.is_running) {
      // For paused entries, return the stored duration
      return entry.duration_seconds;
    }
    
    // For running entries, calculate real-time duration
    const startTime = new Date(entry.start_time);
    const elapsed = Math.floor((currentTime - startTime) / 1000);
    return entry.duration_seconds + elapsed;
  };

  const handlePauseStopwatch = async (entryId) => {
    try {
      const response = await fetch(`/api/time-entries/${entryId}/pause`, {
        method: 'PUT'
      });

      if (response.ok) {
        fetchRunningStopwatches();
      } else {
        alert('Fehler beim Pausieren des Timers');
      }
    } catch (error) {
      console.error('Error pausing timer:', error);
      alert('Fehler beim Pausieren des Timers');
    }
  };

  const handleResumeStopwatch = async (entryId) => {
    try {
      const response = await fetch(`/api/time-entries/${entryId}/resume`, {
        method: 'PUT'
      });

      if (response.ok) {
        fetchRunningStopwatches();
      } else {
        alert('Fehler beim Fortsetzen des Timers');
      }
    } catch (error) {
      console.error('Error resuming timer:', error);
      alert('Fehler beim Fortsetzen des Timers');
    }
  };

  const handleFinishStopwatch = async (entryId) => {
    try {
      const response = await fetch(`/api/time-entries/${entryId}/finish`, {
        method: 'PUT'
      });

      if (response.ok) {
        fetchRunningStopwatches();
      } else {
        alert('Fehler beim Beenden des Timers');
      }
    } catch (error) {
      console.error('Error finishing timer:', error);
      alert('Fehler beim Beenden des Timers');
    }
  };

  const handleEditDescription = async (entryId, newDescription) => {
    try {
      const response = await fetch(`/api/time-entries/${entryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: newDescription })
      });

      if (response.ok) {
        fetchRunningStopwatches();
      } else {
        alert('Fehler beim Aktualisieren der Beschreibung');
      }
    } catch (error) {
      console.error('Error updating description:', error);
      alert('Fehler beim Aktualisieren der Beschreibung');
    }
  };

  const handleStartStopwatch = async (data) => {
    try {
      const response = await fetch(`/api/customers/${data.customer_id}/time-entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: data.description })
      });

      if (response.ok) {
        setShowStartModal(false);
        fetchRunningStopwatches();
      } else {
        alert('Fehler beim Starten des Stopwatches');
      }
    } catch (error) {
      console.error('Error starting stopwatch:', error);
      alert('Fehler beim Starten des Stopwatches');
    }
  };

  const handleDeleteStopwatch = async (entryId, description) => {
    if (window.confirm(`Möchten Sie den Zeiteintrag "${description}" wirklich löschen?`)) {
      try {
        const response = await fetch(`/api/time-entries/${entryId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchRunningStopwatches();
        } else {
          alert('Fehler beim Löschen des Zeiteintrags');
        }
      } catch (error) {
        console.error('Error deleting time entry:', error);
        alert('Fehler beim Löschen des Zeiteintrags');
      }
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p style={{ textAlign: 'center' }}>Lade Dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Aktive und pausierte Stopwatches</h2>
          <button 
            className="btn btn-success"
            onClick={() => setShowStartModal(true)}
          >
            Neue Stopwatch starten
          </button>
        </div>
        {runningStopwatches.length > 0 ? (
          <div className="grid">
            {runningStopwatches.map(entry => (
              <div key={entry.id} className={`stopwatch ${entry.is_running ? 'running' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontSize: '24px' }}>
                    {entry.is_running ? '▶️' : '⏸️'}
                  </div>
                  <h4>{entry.customer_name}</h4>
                </div>
                <EditableDescription
                  description={entry.description}
                  onSave={(newDesc) => handleEditDescription(entry.id, newDesc)}
                />
                <div className="stopwatch-time">
                  {formatTime(getCurrentDuration(entry))}
                </div>
                <div className="stopwatch-controls">
                  {entry.is_running ? (
                    <>
                      <button 
                        className="btn btn-warning"
                        onClick={() => handlePauseStopwatch(entry.id)}
                      >
                        Pausieren
                      </button>
                      <button 
                        className="btn btn-success"
                        onClick={() => handleFinishStopwatch(entry.id)}
                      >
                        Beenden
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className="btn btn-success"
                        onClick={() => handleResumeStopwatch(entry.id)}
                      >
                        Fortsetzen
                      </button>
                      <button 
                        className="btn"
                        onClick={() => handleFinishStopwatch(entry.id)}
                      >
                        Beenden
                      </button>
                    </>
                  )}
                  <button 
                    className="btn"
                    onClick={() => navigate(`/customers/${entry.customer_id}`)}
                  >
                    Zu Kunde
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDeleteStopwatch(entry.id, entry.description)}
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                  >
                    Löschen
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#666' }}>
            Keine aktiven oder pausierten Stopwatches.
          </p>
        )}
      </div>

      <StartStopwatchModal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        onStart={handleStartStopwatch}
        customers={customers}
      />
    </div>
  );
};

const EditableDescription = ({ description, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(description);

  // Update editValue when description prop changes
  useEffect(() => {
    setEditValue(description);
  }, [description]);

  const handleSave = () => {
    if (editValue.trim() !== description) {
      onSave(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(description);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div style={{ margin: '10px 0' }}>
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          style={{ width: '100%', padding: '5px', marginBottom: '5px' }}
          autoFocus
        />
        <div style={{ display: 'flex', gap: '5px' }}>
          <button className="btn btn-success" onClick={handleSave} style={{ padding: '5px 10px', fontSize: '12px' }}>
            Speichern
          </button>
          <button className="btn" onClick={handleCancel} style={{ padding: '5px 10px', fontSize: '12px' }}>
            Abbrechen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ margin: '10px 0' }}>
      <p style={{ margin: '0', cursor: 'pointer' }} onClick={() => setIsEditing(true)}>
        {description} <small style={{ color: '#666' }}>(klicken zum Bearbeiten)</small>
      </p>
    </div>
  );
};

export default Dashboard;

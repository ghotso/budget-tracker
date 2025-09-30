import React, { useState, useEffect, useCallback } from 'react';
import TimeEntryModal from './TimeEntryModal';
import ManualTimeEntryModal from './ManualTimeEntryModal';

const Stopwatch = ({ customerId, onTimeEntryCreated, onTimeEntryUpdated }) => {
  const [timeEntries, setTimeEntries] = useState([]);
  const [newDescription, setNewDescription] = useState('');
  const [showManualModal, setShowManualModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second for real-time display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchTimeEntries = useCallback(async () => {
    try {
      const response = await fetch(`/api/customers/${customerId}/time-entries`);
      const data = await response.json();
      setTimeEntries(data);
    } catch (error) {
      console.error('Error fetching time entries:', error);
    }
  }, [customerId]);

  useEffect(() => {
    fetchTimeEntries();
  }, [fetchTimeEntries]);

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


  const handleManualTimeEntry = async (data) => {
    try {
      const response = await fetch(`/api/customers/${customerId}/manual-time-entry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setShowManualModal(false);
        fetchTimeEntries();
        onTimeEntryCreated();
      } else {
        alert('Fehler beim Speichern des manuellen Zeiteintrags');
      }
    } catch (error) {
      console.error('Error saving manual time entry:', error);
      alert('Fehler beim Speichern des manuellen Zeiteintrags');
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
        fetchTimeEntries();
        onTimeEntryUpdated();
      } else {
        alert('Fehler beim Aktualisieren der Beschreibung');
      }
    } catch (error) {
      console.error('Error updating description:', error);
      alert('Fehler beim Aktualisieren der Beschreibung');
    }
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setShowEditModal(true);
  };

  const handleSaveEntry = async (updatedData) => {
    try {
      const response = await fetch(`/api/time-entries/${editingEntry.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        fetchTimeEntries();
        onTimeEntryUpdated();
        setShowEditModal(false);
        setEditingEntry(null);
      } else {
        alert('Fehler beim Aktualisieren des Zeiteintrags');
      }
    } catch (error) {
      console.error('Error updating time entry:', error);
      alert('Fehler beim Aktualisieren des Zeiteintrags');
    }
  };

  const handleDeleteEntry = async (entryId, description) => {
    if (window.confirm(`Möchten Sie den Zeiteintrag "${description}" wirklich löschen?`)) {
      try {
        const response = await fetch(`/api/time-entries/${entryId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchTimeEntries();
          onTimeEntryUpdated();
        } else {
          alert('Fehler beim Löschen des Zeiteintrags');
        }
      } catch (error) {
        console.error('Error deleting time entry:', error);
        alert('Fehler beim Löschen des Zeiteintrags');
      }
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
    const elapsed = Math.floor((currentTime - startTime) / 1000);
    return entry.duration_seconds + elapsed;
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          className="btn btn-success" 
          onClick={() => setShowManualModal(true)}
        >
          Manueller Zeiteintrag
        </button>
      </div>

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

      <ManualTimeEntryModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        onSave={handleManualTimeEntry}
      />

      <div>
        <h4>Aktive Zeitbuchungen</h4>
        {timeEntries.filter(entry => entry.is_running).map(entry => (
          <div key={entry.id} className="stopwatch running">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '20px' }}>▶️</div>
              <EditableDescription
                description={entry.description}
                onSave={(newDesc) => handleEditDescription(entry.id, newDesc)}
              />
            </div>
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
              <button 
                className="btn btn-danger"
                onClick={() => handleDeleteEntry(entry.id, entry.description)}
                style={{ padding: '5px 10px', fontSize: '12px' }}
              >
                Löschen
              </button>
            </div>
          </div>
        ))}

        <h4>Pausierte Zeitbuchungen</h4>
        {timeEntries.filter(entry => !entry.is_running && !entry.end_time).map(entry => (
          <div key={entry.id} className="stopwatch">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '20px' }}>⏸️</div>
              <EditableDescription
                description={entry.description}
                onSave={(newDesc) => handleEditDescription(entry.id, newDesc)}
              />
            </div>
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
              <button 
                className="btn btn-danger"
                onClick={() => handleDeleteEntry(entry.id, entry.description)}
                style={{ padding: '5px 10px', fontSize: '12px' }}
              >
                Löschen
              </button>
            </div>
          </div>
        ))}

        <h4>Abgeschlossene Zeitbuchungen</h4>
        {timeEntries.filter(entry => entry.end_time).map(entry => (
          <div key={entry.id} className="time-entry">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '20px' }}>✅</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <h5>{entry.description}</h5>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button 
                    className="btn btn-warning"
                    onClick={() => handleEditEntry(entry)}
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                  >
                    Bearbeiten
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDeleteEntry(entry.id, entry.description)}
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                  >
                    Löschen
                  </button>
                </div>
              </div>
            </div>
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

      <TimeEntryModal
        entry={editingEntry}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingEntry(null);
        }}
        onSave={handleSaveEntry}
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
      <h5 style={{ margin: '0', cursor: 'pointer' }} onClick={() => setIsEditing(true)}>
        {description} <small style={{ color: '#666' }}>(klicken zum Bearbeiten)</small>
      </h5>
    </div>
  );
};

export default Stopwatch;

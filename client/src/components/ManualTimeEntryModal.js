import React, { useState } from 'react';

const ManualTimeEntryModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    description: '',
    start_time: '',
    end_time: '',
    duration_hours: 0,
    duration_minutes: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      alert('Bitte geben Sie eine Beschreibung ein.');
      return;
    }

    const durationSeconds = (parseInt(formData.duration_hours) * 3600) + 
                           (parseInt(formData.duration_minutes) * 60);

    if (durationSeconds <= 0) {
      alert('Bitte geben Sie eine gültige Dauer ein.');
      return;
    }

    // Convert datetime-local to ISO string
    const startTime = formData.start_time ? new Date(formData.start_time).toISOString() : new Date().toISOString();
    const endTime = formData.end_time ? new Date(formData.end_time).toISOString() : new Date().toISOString();

    onSave({
      description: formData.description,
      start_time: startTime,
      end_time: endTime,
      duration_seconds: durationSeconds
    });

    // Reset form
    setFormData({
      description: '',
      start_time: '',
      end_time: '',
      duration_hours: 0,
      duration_minutes: 0
    });
  };

  const handleClose = () => {
    setFormData({
      description: '',
      start_time: '',
      end_time: '',
      duration_hours: 0,
      duration_minutes: 0
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Manueller Zeiteintrag</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="description">Beschreibung</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Beschreibung der Tätigkeit..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration_hours">Dauer (Stunden)</label>
            <input
              type="number"
              id="duration_hours"
              name="duration_hours"
              value={formData.duration_hours}
              onChange={handleChange}
              min="0"
              max="24"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration_minutes">Dauer (Minuten)</label>
            <input
              type="number"
              id="duration_minutes"
              name="duration_minutes"
              value={formData.duration_minutes}
              onChange={handleChange}
              min="0"
              max="59"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="start_time">Startzeit (optional)</label>
            <input
              type="datetime-local"
              id="start_time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="end_time">Endzeit (optional)</label>
            <input
              type="datetime-local"
              id="end_time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn" onClick={handleClose}>
              Abbrechen
            </button>
            <button type="submit" className="btn btn-success">
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualTimeEntryModal;

import React, { useState } from 'react';

const StartStopwatchModal = ({ isOpen, onClose, onStart, customers }) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    description: ''
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
    
    if (!formData.customer_id) {
      alert('Bitte wählen Sie einen Kunden aus.');
      return;
    }

    if (!formData.description.trim()) {
      alert('Bitte geben Sie eine Beschreibung ein.');
      return;
    }

    onStart(formData);
    
    // Reset form
    setFormData({
      customer_id: '',
      description: ''
    });
  };

  const handleClose = () => {
    setFormData({
      customer_id: '',
      description: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Neuen Stopwatch starten</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="customer_id">Kunde</label>
            <select
              id="customer_id"
              name="customer_id"
              value={formData.customer_id}
              onChange={handleChange}
              required
            >
              <option value="">Kunde auswählen...</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.hourly_rate} €/h)
                </option>
              ))}
            </select>
          </div>

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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn" onClick={handleClose}>
              Abbrechen
            </button>
            <button type="submit" className="btn btn-success">
              Stopwatch starten
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StartStopwatchModal;

import React, { useState, useEffect } from 'react';

const CustomerForm = ({ customer, onCustomerCreated, onCustomerUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    hourly_rate: 0
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        hourly_rate: customer.hourly_rate || 0
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hourly_rate' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Bitte geben Sie einen Kundennamen ein.');
      return;
    }

    try {
      const url = customer ? `/api/customers/${customer.id}` : '/api/customers';
      const method = customer ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        
        if (customer) {
          onCustomerUpdated(data);
        } else {
          onCustomerCreated(data);
        }
      } else {
        alert('Fehler beim Speichern des Kunden');
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Fehler beim Speichern des Kunden');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{customer ? 'Kunde bearbeiten' : 'Neuer Kunde'}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">E-Mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Telefon</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="hourly_rate">Stundensatz (€)</label>
            <input
              type="number"
              id="hourly_rate"
              name="hourly_rate"
              value={formData.hourly_rate}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn" onClick={onCancel}>
              Abbrechen
            </button>
            <button type="submit" className="btn btn-success">
              {customer ? 'Aktualisieren' : 'Erstellen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;

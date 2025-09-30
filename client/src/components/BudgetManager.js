import React, { useState, useEffect, useCallback } from 'react';

const BudgetManager = ({ customerId, onBudgetChangeCreated }) => {
  const [budgetChanges, setBudgetChanges] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: 0,
    comment: '',
    change_type: 'increase'
  });

  const fetchBudgetChanges = useCallback(async () => {
    try {
      const response = await fetch(`/api/customers/${customerId}/budget-changes`);
      const data = await response.json();
      setBudgetChanges(data);
    } catch (error) {
      console.error('Error fetching budget changes:', error);
    }
  }, [customerId]);

  useEffect(() => {
    fetchBudgetChanges();
  }, [fetchBudgetChanges]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.amount <= 0) {
      alert('Bitte geben Sie einen Betrag größer als 0 ein.');
      return;
    }

    try {
      const response = await fetch(`/api/customers/${customerId}/budget-changes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({ amount: 0, comment: '', change_type: 'increase' });
        setShowForm(false);
        fetchBudgetChanges(); // Reload budget changes
        onBudgetChangeCreated();
      } else {
        alert('Fehler beim Speichern der Budgetänderung');
      }
    } catch (error) {
      console.error('Error saving budget change:', error);
      alert('Fehler beim Speichern der Budgetänderung');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button 
          className="btn btn-success"
          onClick={() => setShowForm(true)}
        >
          Budget ändern
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h4>Budget ändern</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="change_type">Art der Änderung</label>
              <select
                id="change_type"
                name="change_type"
                value={formData.change_type}
                onChange={handleChange}
              >
                <option value="increase">Budget erhöhen</option>
                <option value="decrease">Budget verringern</option>
                <option value="initial">Initiales Budget</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="amount">Betrag (€)</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="comment">Kommentar</label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows="3"
                placeholder="Optional: Kommentar zur Budgetänderung..."
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-success">
                Speichern
              </button>
              <button 
                type="button" 
                className="btn" 
                onClick={() => setShowForm(false)}
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h4>Budget-Historie</h4>
        {budgetChanges.map(change => (
          <div key={change.id} className={`budget-change ${change.change_type}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>
                  {change.change_type === 'increase' && '+'}
                  {change.change_type === 'decrease' && '-'}
                  {change.change_type === 'initial' && 'Initial: '}
                  {change.amount.toFixed(2)} €
                </strong>
                {change.comment && <p style={{ margin: '5px 0' }}>{change.comment}</p>}
              </div>
              <small style={{ color: '#666' }}>
                {new Date(change.created_at).toLocaleString('de-DE')}
              </small>
            </div>
          </div>
        ))}

        {budgetChanges.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
            Noch keine Budgetänderungen vorhanden.
          </p>
        )}
      </div>
    </div>
  );
};

export default BudgetManager;

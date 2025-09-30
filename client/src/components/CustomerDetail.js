import React, { useState, useEffect } from 'react';
import Stopwatch from './Stopwatch';
import BudgetManager from './BudgetManager';
import CustomerOverview from './CustomerOverview';

const CustomerDetail = ({ customer, onBack, onCustomerUpdated, onCustomerDeleted }) => {
  const [overview, setOverview] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [budgetChanges, setBudgetChanges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, [customer.id]);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/customers/${customer.id}/overview`);
      const data = await response.json();
      setOverview(data);
      setTimeEntries(data.timeEntries);
      setBudgetChanges(data.budgetChanges);
    } catch (error) {
      console.error('Error fetching overview:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeEntryCreated = () => {
    fetchOverview();
  };

  const handleTimeEntryUpdated = () => {
    fetchOverview();
  };

  const handleBudgetChangeCreated = () => {
    fetchOverview();
  };

  const handleDeleteCustomer = async () => {
    if (window.confirm(`Möchten Sie den Kunden "${customer.name}" wirklich löschen?`)) {
      try {
        const response = await fetch(`/api/customers/${customer.id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          onCustomerDeleted(customer.id);
        } else {
          alert('Fehler beim Löschen des Kunden');
        }
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Fehler beim Löschen des Kunden');
      }
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p style={{ textAlign: 'center' }}>Lade Kundendetails...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>{customer.name}</h2>
            {customer.email && <p><strong>E-Mail:</strong> {customer.email}</p>}
            {customer.phone && <p><strong>Telefon:</strong> {customer.phone}</p>}
            <p><strong>Stundensatz:</strong> {customer.hourly_rate} €/h</p>
          </div>
          <div>
            <button className="btn" onClick={onBack}>
              Zurück zur Liste
            </button>
            <button className="btn btn-danger" onClick={handleDeleteCustomer}>
              Kunde löschen
            </button>
          </div>
        </div>
      </div>

      {overview && (
        <CustomerOverview overview={overview} />
      )}

      <div className="grid">
        <div className="card">
          <h3>Stopwatches</h3>
          <Stopwatch
            customerId={customer.id}
            onTimeEntryCreated={handleTimeEntryCreated}
            onTimeEntryUpdated={handleTimeEntryUpdated}
          />
        </div>

        <div className="card">
          <h3>Budget verwalten</h3>
          <BudgetManager
            customerId={customer.id}
            onBudgetChangeCreated={handleBudgetChangeCreated}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;

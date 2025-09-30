import React from 'react';

const CustomerList = ({ customers, onCustomerSelect, onEditCustomer, onDeleteCustomer }) => {
  const handleDelete = async (customerId, customerName) => {
    if (window.confirm(`Möchten Sie den Kunden "${customerName}" wirklich löschen?`)) {
      try {
        const response = await fetch(`/api/customers/${customerId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          onDeleteCustomer(customerId);
        } else {
          alert('Fehler beim Löschen des Kunden');
        }
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Fehler beim Löschen des Kunden');
      }
    }
  };

  return (
    <div className="grid">
      {customers.map(customer => (
        <div key={customer.id} className="card">
          <h3>{customer.name}</h3>
          {customer.email && <p><strong>E-Mail:</strong> {customer.email}</p>}
          {customer.phone && <p><strong>Telefon:</strong> {customer.phone}</p>}
          <p><strong>Stundensatz:</strong> {customer.hourly_rate} €/h</p>
          
          <div style={{ marginTop: '15px' }}>
            <button 
              className="btn"
              onClick={() => onCustomerSelect(customer)}
            >
              Details anzeigen
            </button>
            <button 
              className="btn btn-warning"
              onClick={() => onEditCustomer(customer)}
            >
              Bearbeiten
            </button>
            <button 
              className="btn btn-danger"
              onClick={() => handleDelete(customer.id, customer.name)}
            >
              Löschen
            </button>
          </div>
        </div>
      ))}
      
      {customers.length === 0 && (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#666' }}>
            Noch keine Kunden vorhanden. Erstellen Sie den ersten Kunden!
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerList;

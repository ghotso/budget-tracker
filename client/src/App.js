import React, { useState, useEffect } from 'react';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import CustomerDetail from './components/CustomerDetail';

function App() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleCustomerCreated = (customer) => {
    setCustomers([...customers, customer]);
    setShowCustomerForm(false);
  };

  const handleCustomerUpdated = (updatedCustomer) => {
    setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    setEditingCustomer(null);
    setShowCustomerForm(false);
  };

  const handleCustomerDeleted = (customerId) => {
    setCustomers(customers.filter(c => c.id !== customerId));
    if (selectedCustomer && selectedCustomer.id === customerId) {
      setSelectedCustomer(null);
    }
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowCustomerForm(true);
  };

  const handleBackToList = () => {
    setSelectedCustomer(null);
  };

  return (
    <div className="App">
      <div className="header">
        <div className="container">
          <h1>Budget Tracker</h1>
        </div>
      </div>

      <div className="container">
        {selectedCustomer ? (
          <CustomerDetail
            customer={selectedCustomer}
            onBack={handleBackToList}
            onCustomerUpdated={handleCustomerUpdated}
            onCustomerDeleted={handleCustomerDeleted}
          />
        ) : (
          <>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Kunden</h2>
                <button 
                  className="btn btn-success"
                  onClick={() => setShowCustomerForm(true)}
                >
                  Neuer Kunde
                </button>
              </div>
            </div>

            <CustomerList
              customers={customers}
              onCustomerSelect={handleCustomerSelect}
              onEditCustomer={handleEditCustomer}
              onDeleteCustomer={handleCustomerDeleted}
            />
          </>
        )}

        {showCustomerForm && (
          <CustomerForm
            customer={editingCustomer}
            onCustomerCreated={handleCustomerCreated}
            onCustomerUpdated={handleCustomerUpdated}
            onCancel={() => {
              setShowCustomerForm(false);
              setEditingCustomer(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;

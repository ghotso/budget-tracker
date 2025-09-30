import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import CustomerForm from './components/CustomerForm';
import CustomerDetail from './components/CustomerDetail';
import CustomersPage from './components/CustomersPage';
import DashboardPage from './components/DashboardPage';

function AppContent() {
  const { isDarkMode, toggleTheme } = useTheme();
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

  return (
    <Router>
      <div className="App">
        <div className="header">
          <div className="container">
            <h1>Budget Tracker</h1>
            <nav style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link 
                to="/"
                className="btn"
              >
                Dashboard
              </Link>
              <Link 
                to="/customers"
                className="btn"
              >
                Kunden
              </Link>
              <button 
                className="btn"
                onClick={toggleTheme}
                style={{ marginLeft: 'auto' }}
                title={isDarkMode ? 'Zu hellem Modus wechseln' : 'Zu dunklem Modus wechseln'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </nav>
          </div>
        </div>

        <div className="container">
          <Routes>
            <Route 
              path="/" 
              element={
                <DashboardPage 
                  customers={customers}
                  onCustomerSelect={handleCustomerSelect}
                />
              } 
            />
            <Route 
              path="/customers" 
              element={
                <CustomersPage
                  customers={customers}
                  onCustomerSelect={handleCustomerSelect}
                  onEditCustomer={handleEditCustomer}
                  onDeleteCustomer={handleCustomerDeleted}
                  onShowCustomerForm={() => setShowCustomerForm(true)}
                />
              } 
            />
            <Route 
              path="/customers/:id" 
              element={
                <CustomerDetail
                  onCustomerUpdated={handleCustomerUpdated}
                  onCustomerDeleted={handleCustomerDeleted}
                />
              } 
            />
          </Routes>

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
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

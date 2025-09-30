import React from 'react';
import Dashboard from './Dashboard';

const DashboardPage = ({ customers, onCustomerSelect }) => {
  return (
    <Dashboard 
      customers={customers}
      onCustomerSelect={onCustomerSelect}
    />
  );
};

export default DashboardPage;

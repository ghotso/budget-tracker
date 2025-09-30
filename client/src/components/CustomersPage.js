import React from 'react';
import CustomerList from './CustomerList';

const CustomersPage = ({ customers, onCustomerSelect, onEditCustomer, onDeleteCustomer, onShowCustomerForm }) => {
  return (
    <>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Kunden</h2>
          <button 
            className="btn btn-success"
            onClick={onShowCustomerForm}
          >
            Neuer Kunde
          </button>
        </div>
      </div>

      <CustomerList
        customers={customers}
        onCustomerSelect={onCustomerSelect}
        onEditCustomer={onEditCustomer}
        onDeleteCustomer={onDeleteCustomer}
      />
    </>
  );
};

export default CustomersPage;

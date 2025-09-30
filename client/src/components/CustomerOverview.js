import React from 'react';

const CustomerOverview = ({ overview }) => {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getTotalHours = () => {
    return overview.timeEntries.reduce((total, entry) => total + entry.duration_seconds, 0) / 3600;
  };

  const getRemainingHours = () => {
    if (overview.customer.hourly_rate <= 0) return 0;
    return overview.remainingBudget / overview.customer.hourly_rate;
  };

  return (
    <div className="budget-overview">
      <h3>Budget-Übersicht für {overview.customer.name}</h3>
      
      <div className="budget-stats">
        <div className="budget-stat">
          <h3>{formatCurrency(overview.totalBudget)}</h3>
          <p>Gesamtbudget</p>
        </div>
        
        <div className="budget-stat">
          <h3>{formatCurrency(overview.totalTimeCosts)}</h3>
          <p>Zeitkosten</p>
        </div>
        
        <div className="budget-stat">
          <h3>{formatTime(overview.timeEntries.reduce((total, entry) => total + entry.duration_seconds, 0))}</h3>
          <p>Gesamtzeit</p>
        </div>
        
        <div className="budget-stat">
          <h3 style={{ color: overview.remainingBudget >= 0 ? '#27ae60' : '#e74c3c' }}>
            {formatCurrency(overview.remainingBudget)}
          </h3>
          <p>Verbleibendes Budget</p>
        </div>
        
        <div className="budget-stat">
          <h3 style={{ color: getRemainingHours() >= 0 ? '#27ae60' : '#e74c3c' }}>
            {getRemainingHours().toFixed(1)}h
          </h3>
          <p>Verbleibende Stunden</p>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <p><strong>Stundensatz:</strong> {formatCurrency(overview.customer.hourly_rate)}/h</p>
        <p><strong>Gebuchte Stunden:</strong> {getTotalHours().toFixed(2)}h</p>
        <p><strong>Verbleibende Stunden:</strong> {getRemainingHours().toFixed(1)}h</p>
        <p><strong>Durchschnittliche Kosten pro Stunde:</strong> {formatCurrency(overview.totalTimeCosts / Math.max(getTotalHours(), 1))}</p>
      </div>
    </div>
  );
};

export default CustomerOverview;

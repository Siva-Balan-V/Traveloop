import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { tripService } from '../services/api';

const BudgetPage = () => {
  const { id } = useParams();
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripService.getBudget(id).then(setBudget).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page"><p>Loading...</p></div>;
  if (!budget) return <div className="page"><p>No budget data.</p></div>;

  const { summary, breakdown, currency } = budget;

  return (
    <div className="page">
      <h1>Budget Breakdown</h1>
      <div className="budget-summary">
        <div className="budget-card"><span>Accommodation</span><strong>{currency} {summary.accommodation.toFixed(2)}</strong></div>
        <div className="budget-card"><span>Transportation</span><strong>{currency} {summary.transportation.toFixed(2)}</strong></div>
        <div className="budget-card"><span>Activities</span><strong>{currency} {summary.activities.toFixed(2)}</strong></div>
        <div className="budget-card total"><span>Total</span><strong>{currency} {summary.total.toFixed(2)}</strong></div>
        <div className="budget-card"><span>Per Day</span><strong>{currency} {summary.average_per_day.toFixed(2)}</strong></div>
      </div>
      <h2>By Stop</h2>
      <table className="budget-table">
        <thead><tr><th>City</th><th>Dates</th><th>Accommodation</th><th>Transport</th><th>Activities</th><th>Total</th></tr></thead>
        <tbody>
          {breakdown.map(stop => (
            <tr key={stop.stop_id}>
              <td>{stop.city_name}</td>
              <td>{new Date(stop.arrival_date).toLocaleDateString()} – {new Date(stop.departure_date).toLocaleDateString()}</td>
              <td>{currency} {parseFloat(stop.accommodation_cost).toFixed(2)}</td>
              <td>{currency} {parseFloat(stop.transportation_cost).toFixed(2)}</td>
              <td>{currency} {parseFloat(stop.activities_cost).toFixed(2)}</td>
              <td><strong>{currency} {parseFloat(stop.total_cost).toFixed(2)}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BudgetPage;

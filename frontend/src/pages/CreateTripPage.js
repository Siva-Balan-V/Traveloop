import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripService } from '../services/api';

const CreateTripPage = () => {
  const [form, setForm] = useState({ trip_name: '', description: '', start_date: '', end_date: '', currency: 'USD' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const trip = await tripService.createTrip(form);
      navigate(`/trips/${trip.trip_id}`);
    } catch (err) {
      setError(err.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page-narrow">
      <h1>Create New Trip</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label>Trip Name</label>
          <input value={form.trip_name} onChange={e => setForm({...form, trip_name: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Start Date</label>
            <input type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input type="date" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} required />
          </div>
        </div>
        <div className="form-group">
          <label>Currency</label>
          <select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})}>
            {['USD','EUR','GBP','JPY','AUD','CAD','CHF','CNY','INR','MXN'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Creating...' : 'Create Trip'}
        </button>
      </form>
    </div>
  );
};

export default CreateTripPage;

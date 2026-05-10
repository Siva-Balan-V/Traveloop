import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { tripService } from '../services/api';

const TABS = ['All', 'Ongoing', 'Upcoming', 'Completed'];

const getStatus = (trip) => {
  const now = new Date();
  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);
  if (now >= start && now <= end) return 'Ongoing';
  if (now < start) return 'Upcoming';
  return 'Completed';
};

const statusColors = { Ongoing: '#10b981', Upcoming: '#667eea', Completed: '#6b7280' };

const TripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    tripService.getTrips().then(data => setTrips(data?.trips || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (!window.confirm('Delete this trip?')) return;
    await tripService.deleteTrip(id);
    setTrips(trips.filter(t => t.trip_id !== id));
  };

  const filtered = trips.filter(t => {
    const matchTab = tab === 'All' || getStatus(t) === tab;
    const matchSearch = t.trip_name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const counts = { All: trips.length, Ongoing: 0, Upcoming: 0, Completed: 0 };
  trips.forEach(t => counts[getStatus(t)]++);

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Trips</h1>
        <Link to="/trips/new" className="btn btn-primary">+ New Trip</Link>
      </div>

      <div className="trips-toolbar">
        <input className="search-input" placeholder="🔍  Search trips..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="tabs">
        {TABS.map(t => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t} <span className="tab-count">{counts[t]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-screen" style={{minHeight:200}}><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✈️</div>
          <h3>{search ? 'No trips match your search' : `No ${tab.toLowerCase()} trips`}</h3>
          {tab === 'All' && !search && <Link to="/trips/new" className="btn btn-primary">Create Trip</Link>}
        </div>
      ) : (
        <div className="trips-grid">
          {filtered.map(trip => {
            const status = getStatus(trip);
            return (
              <div key={trip.trip_id} className="trip-card">
                <Link to={`/trips/${trip.trip_id}`} style={{textDecoration:'none',color:'inherit'}}>
                  <div className="trip-card-header">
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                      <h3>{trip.trip_name}</h3>
                      <span className="trip-status-badge" style={{background: statusColors[status]}}>{status}</span>
                    </div>
                    <p className="trip-dates">
                      {new Date(trip.start_date).toLocaleDateString('en-US', {month:'short',day:'numeric'})} –{' '}
                      {new Date(trip.end_date).toLocaleDateString('en-US', {month:'short',day:'numeric',year:'numeric'})}
                    </p>
                  </div>
                  <div className="trip-card-body">
                    <div className="trip-card-meta">
                      <div className="trip-meta-item">📍 <strong>{trip.stop_count || 0}</strong> stops</div>
                      <div className="trip-meta-item">🎯 <strong>{trip.activity_count || 0}</strong> activities</div>
                      <div className="trip-meta-item">💰 <strong>{trip.currency} {parseFloat(trip.total_budget || 0).toFixed(0)}</strong></div>
                    </div>
                  </div>
                </Link>
                <div className="card-actions">
                  <Link to={`/trips/${trip.trip_id}/itinerary`} className="btn btn-sm btn-outline">🗺 Itinerary</Link>
                  <Link to={`/trips/${trip.trip_id}/budget`} className="btn btn-sm btn-ghost">💰 Budget</Link>
                  <Link to={`/trips/${trip.trip_id}/notes`} className="btn btn-sm btn-ghost">📝 Notes</Link>
                  <button onClick={e => handleDelete(e, trip.trip_id)} className="btn btn-sm btn-danger" style={{marginLeft:'auto'}}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TripsPage;

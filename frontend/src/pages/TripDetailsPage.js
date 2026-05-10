import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { tripService } from '../services/api';

const TripDetailsPage = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    tripService.getTripById(id).then(setTrip).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, [id]);

  const handleShare = async () => {
    const result = await tripService.generateShareLink(id);
    alert(`Share link: ${result.share_url}`);
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (error) return <div className="page"><div className="alert alert-error">{error}</div></div>;

  const days = Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000*60*60*24)) + 1;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>{trip.trip_name}</h1>
          {trip.description && <p className="text-muted">{trip.description}</p>}
        </div>
        <div className="btn-group">
          <button onClick={handleShare} className="btn btn-outline btn-sm">🔗 Share</button>
          <Link to={`/trips/${id}/itinerary`} className="btn btn-primary">🗺 Itinerary</Link>
        </div>
      </div>

      <div className="trip-info">
        <div className="trip-info-grid">
          <div className="trip-info-item">
            <label>Start Date</label>
            <span>{new Date(trip.start_date).toLocaleDateString('en-US', {weekday:'short',month:'long',day:'numeric',year:'numeric'})}</span>
          </div>
          <div className="trip-info-item">
            <label>End Date</label>
            <span>{new Date(trip.end_date).toLocaleDateString('en-US', {weekday:'short',month:'long',day:'numeric',year:'numeric'})}</span>
          </div>
          <div className="trip-info-item">
            <label>Duration</label>
            <span>{days} day{days !== 1 ? 's' : ''}</span>
          </div>
          <div className="trip-info-item">
            <label>Total Budget</label>
            <span>{trip.currency} {parseFloat(trip.total_budget).toFixed(2)}</span>
          </div>
          <div className="trip-info-item">
            <label>Stops</label>
            <span>{trip.stop_count}</span>
          </div>
          <div className="trip-info-item">
            <label>Visibility</label>
            <span>{trip.is_public ? <span className="badge badge-success">Public</span> : <span className="badge badge-primary">Private</span>}</span>
          </div>
        </div>
      </div>

      <div className="trips-grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))'}}>
        {[
          {to:`/trips/${id}/itinerary`, icon:'🗺️', label:'Itinerary', desc:'Manage stops & activities'},
          {to:`/trips/${id}/budget`, icon:'💰', label:'Budget', desc:'Track your spending'},
          {to:`/trips/${id}/notes`, icon:'📝', label:'Notes', desc:'Journal & reminders'},
          {to:`/trips/${id}/packing`, icon:'🎒', label:'Packing List', desc:'Never forget anything'},
        ].map(item => (
          <Link key={item.to} to={item.to} className="trip-card" style={{textDecoration:'none'}}>
            <div className="trip-card-header" style={{padding:'20px'}}>
              <div style={{fontSize:'2rem',marginBottom:8}}>{item.icon}</div>
              <h3 style={{color:'#fff',marginBottom:4}}>{item.label}</h3>
              <p className="trip-dates">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TripDetailsPage;

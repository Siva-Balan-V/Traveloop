import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tripService } from '../services/api';

const SharedTripPage = () => {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    tripService.getSharedTrip(token).then(setTrip).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="page"><p>Loading...</p></div>;
  if (error) return <div className="page"><div className="alert alert-error">Trip not found or no longer shared.</div><Link to="/">Go Home</Link></div>;

  return (
    <div className="page">
      <div className="shared-header">
        <span className="nav-brand">✈ Traveloop</span>
        <Link to="/register" className="btn btn-primary">Plan Your Own Trip</Link>
      </div>
      <h1>{trip.trip_name}</h1>
      <p>Shared by {trip.creator_name}</p>
      <p>{new Date(trip.start_date).toLocaleDateString()} – {new Date(trip.end_date).toLocaleDateString()}</p>
      {trip.description && <p>{trip.description}</p>}
    </div>
  );
};

export default SharedTripPage;

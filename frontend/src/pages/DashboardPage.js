import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { tripService } from '../services/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, ongoing: 0, budget: 0, destinations: 0 });

  useEffect(() => {
    tripService.getTrips(1, 10).then(data => {
      const tripList = data?.trips || [];
      setTrips(tripList);
      
      const now = new Date();
      const upcoming = tripList.filter(t => new Date(t.start_date) > now).length;
      const ongoing = tripList.filter(t => new Date(t.start_date) <= now && new Date(t.end_date) >= now).length;
      const totalBudget = tripList.reduce((s, t) => s + parseFloat(t.total_budget || 0), 0);
      const destinations = tripList.reduce((s, t) => s + parseInt(t.stop_count || 0), 0);
      
      setStats({ total: tripList.length, upcoming, ongoing, budget: totalBudget, destinations });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">{getGreeting()}, {user?.first_name}! 👋</h1>
          <p className="dashboard-subtitle">Ready to plan your next adventure?</p>
        </div>
        <Link to="/trips/new" className="btn btn-primary btn-lg">
          <span>➕</span> Create New Trip
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">🗺️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Trips</div>
          </div>
        </div>
        <div className="stat-card stat-card-success">
          <div className="stat-icon">✈️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.upcoming}</div>
            <div className="stat-label">Upcoming</div>
          </div>
        </div>
        <div className="stat-card stat-card-warning">
          <div className="stat-icon">🌍</div>
          <div className="stat-content">
            <div className="stat-value">{stats.ongoing}</div>
            <div className="stat-label">Ongoing</div>
          </div>
        </div>
        <div className="stat-card stat-card-info">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">₹{stats.budget.toFixed(0)}</div>
            <div className="stat-label">Total Budget</div>
          </div>
        </div>
        <div className="stat-card stat-card-purple">
          <div className="stat-icon">📍</div>
          <div className="stat-content">
            <div className="stat-value">{stats.destinations}</div>
            <div className="stat-label">Destinations</div>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recent Trips</h2>
          <Link to="/trips" className="btn btn-ghost btn-sm">View all →</Link>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner" />
            <p>Loading your trips...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-icon">🌍</div>
            <h3>No trips yet</h3>
            <p>Start planning your first adventure!</p>
            <Link to="/trips/new" className="btn btn-primary">Create Your First Trip</Link>
          </div>
        ) : (
          <div className="trips-grid">
            {trips.slice(0, 6).map(trip => {
              const isUpcoming = new Date(trip.start_date) > new Date();
              const isOngoing = new Date(trip.start_date) <= new Date() && new Date(trip.end_date) >= new Date();
              
              return (
                <Link to={`/trips/${trip.trip_id}`} key={trip.trip_id} className="trip-card-modern">
                  <div className="trip-card-badge">
                    {isOngoing ? <span className="badge-ongoing">⚡ Ongoing</span> : 
                     isUpcoming ? <span className="badge-upcoming">📅 Upcoming</span> : 
                     <span className="badge-completed">✔️ Completed</span>}
                  </div>
                  <div className="trip-card-content">
                    <h3>{trip.trip_name}</h3>
                    <p className="trip-dates">
                      {new Date(trip.start_date).toLocaleDateString('en-IN', {day:'numeric',month:'short'})} - 
                      {new Date(trip.end_date).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}
                    </p>
                    <div className="trip-meta">
                      <span>📍 {trip.stop_count || 0} stops</span>
                      <span>💵 {trip.currency} {parseFloat(trip.total_budget || 0).toFixed(0)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="dashboard-quick-actions">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link to="/search" className="action-card">
            <div className="action-icon">🔍</div>
            <h3>Explore Destinations</h3>
            <p>Discover amazing places</p>
          </Link>
          <Link to="/trips" className="action-card">
            <div className="action-icon">📄</div>
            <h3>My Trips</h3>
            <p>View all your trips</p>
          </Link>
          <Link to="/profile" className="action-card">
            <div className="action-icon">👤</div>
            <h3>Profile</h3>
            <p>Manage your account</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

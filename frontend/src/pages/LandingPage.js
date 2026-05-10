import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cityService } from '../services/api';

const POPULAR_CITIES = [
  { name: 'Paris', country: 'France', emoji: '🗼', desc: 'City of Light' },
  { name: 'Tokyo', country: 'Japan', emoji: '⛩️', desc: 'Land of the Rising Sun' },
  { name: 'New York', country: 'USA', emoji: '🗽', desc: 'The Big Apple' },
  { name: 'Bali', country: 'Indonesia', emoji: '🌴', desc: 'Island of the Gods' },
  { name: 'Rome', country: 'Italy', emoji: '🏛️', desc: 'Eternal City' },
];

const LandingPage = () => {
  const [search, setSearch] = useState('');
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cityService.searchCities('').then(data => setCities(data?.slice(0, 5) || [])).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/register`);
  };

  return (
    <div className="landing">
      <nav className="landing-nav">
        <span className="nav-brand">✈ Traveloop</span>
        <div>
          <Link to="/login" className="btn btn-outline">Login</Link>
          <Link to="/register" className="btn btn-primary">Get Started Free</Link>
        </div>
      </nav>

      <div className="hero">
        <h1>Plan Your Perfect<br />Journey</h1>
        <p>Create personalized multi-city itineraries, track budgets, and share your travel adventures with the world.</p>
        <form onSubmit={handleSearch} className="hero-search">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Where do you want to go?" />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
        <div className="hero-features">
          {[['🗺️','Multi-city Itineraries'],['💰','Budget Tracking'],['🎒','Packing Lists'],['🔗','Share Trips']].map(([icon, label]) => (
            <div key={label} className="hero-feature">
              <div className="hero-feature-icon">{icon}</div>
              <p>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="landing-section">
        <h2>Top Regional Selections</h2>
        <div className="landing-cities">
          {(cities.length > 0 ? cities.map(c => ({ name: c.city_name, country: c.country_name, emoji: '🌍', desc: c.description || 'Explore this destination' })) : POPULAR_CITIES).map(city => (
            <Link to="/register" key={city.name} className="landing-city-card">
              <div className="city-card-emoji">{city.emoji}</div>
              <div className="city-card-info">
                <h3>{city.name}</h3>
                <p>{city.country}</p>
                <small>{city.desc}</small>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="landing-section landing-cta">
        <h2>Start Planning Today</h2>
        <p>Join thousands of travelers who plan smarter with Traveloop</p>
        <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
      </div>
    </div>
  );
};

export default LandingPage;

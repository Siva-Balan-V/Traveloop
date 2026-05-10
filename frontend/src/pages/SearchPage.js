import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cityService, activityService } from '../services/api';

const SearchPage = () => {
  const [mode, setMode] = useState('cities');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 0 || query === '') doSearch();
    }, 300);
    return () => clearTimeout(timer);
  }, [query, mode]);

  const doSearch = async () => {
    setLoading(true);
    try {
      if (mode === 'cities') {
        const data = await cityService.searchCities(query);
        setResults(data || []);
      } else {
        const data = await activityService.searchActivities(null, null, query);
        setResults(data || []);
      }
    } catch (e) { setResults([]); }
    finally { setLoading(false); }
  };

  const sorted = [...results].sort((a, b) => {
    if (sortBy === 'name') return (a.city_name || a.activity_name || '').localeCompare(b.city_name || b.activity_name || '');
    return (b.popularity_score || 0) - (a.popularity_score || 0);
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Explore Destinations</h1>
      </div>

      <div className="search-toolbar">
        <div className="search-mode-tabs">
          <button className={`tab ${mode === 'cities' ? 'active' : ''}`} onClick={() => { setMode('cities'); setResults([]); }}>🏙️ Cities</button>
          <button className={`tab ${mode === 'activities' ? 'active' : ''}`} onClick={() => { setMode('activities'); setResults([]); }}>🎯 Activities</button>
        </div>
        <input className="search-input" placeholder={`Search ${mode}...`} value={query} onChange={e => setQuery(e.target.value)} autoFocus />
        <div className="toolbar-right">
          <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="popularity">Sort: Popular</option>
            <option value="name">Sort: A-Z</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-screen" style={{minHeight:200}}><div className="spinner" /></div>
      ) : sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No results found</h3>
          <p>Try a different search term</p>
        </div>
      ) : mode === 'cities' ? (
        <div className="search-results-grid">
          {sorted.map(city => (
            <div key={city.city_id} className="search-result-card">
              <div className="result-card-header">
                <h3>🏙️ {city.city_name}</h3>
                <span className="badge badge-primary">{city.country_name}</span>
              </div>
              {city.description && <p className="result-desc">{city.description}</p>}
              <div className="result-meta">
                {city.cost_index && <span>💰 Cost index: {city.cost_index}</span>}
                <span>⭐ {city.popularity_score || 0} visits</span>
              </div>
              <Link to="/trips/new" className="btn btn-sm btn-primary" style={{marginTop:12}}>Plan a Trip Here</Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="search-results-list">
          {sorted.map(activity => (
            <div key={activity.activity_id} className="search-result-row">
              <div className="result-row-info">
                <h3>{activity.activity_name}</h3>
                <div className="result-row-meta">
                  {activity.city_name && <span>📍 {activity.city_name}</span>}
                  {activity.category_name && <span className="badge badge-primary">{activity.category_name}</span>}
                  {activity.average_cost && <span>💰 ${activity.average_cost}</span>}
                  {activity.average_duration && <span>⏱ {activity.average_duration} min</span>}
                  {activity.rating && <span>⭐ {activity.rating}</span>}
                </div>
                {activity.description && <p className="result-desc">{activity.description}</p>}
              </div>
              <Link to="/trips/new" className="btn btn-sm btn-outline">Add to Trip</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;

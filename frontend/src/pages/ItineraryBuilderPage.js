import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { stopService, cityService } from '../services/api';

const ItineraryBuilderPage = () => {
  const { id } = useParams();
  const [stops, setStops] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({ city_id: '', arrival_date: '', departure_date: '', accommodation_name: '', accommodation_cost: '', transportation_cost: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    stopService.getStops(id).then(setStops).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const searchCities = async (q) => {
    setCitySearch(q);
    if (q.length > 1) {
      const results = await cityService.searchCities(q);
      setCities(results || []);
    }
  };

  const handleAddStop = async (e) => {
    e.preventDefault();
    const stop = await stopService.createStop(id, form);
    setStops([...stops, stop]);
    setShowForm(false);
    setForm({ city_id: '', arrival_date: '', departure_date: '', accommodation_name: '', accommodation_cost: '', transportation_cost: '' });
  };

  const handleDeleteStop = async (stopId) => {
    await stopService.deleteStop(stopId);
    setStops(stops.filter(s => s.stop_id !== stopId));
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Itinerary Builder</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Add Stop</button>
      </div>
      {showForm && (
        <form onSubmit={handleAddStop} className="form-card">
          <div className="form-group">
            <label>Search City</label>
            <input value={citySearch} onChange={e => searchCities(e.target.value)} placeholder="Type city name..." />
            {cities.length > 0 && (
              <ul className="dropdown">
                {cities.map(c => (
                  <li key={c.city_id} onClick={() => { setForm({...form, city_id: c.city_id}); setCitySearch(`${c.city_name}, ${c.country_name}`); setCities([]); }}>
                    {c.city_name}, {c.country_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Arrival</label>
              <input type="date" value={form.arrival_date} onChange={e => setForm({...form, arrival_date: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Departure</label>
              <input type="date" value={form.departure_date} onChange={e => setForm({...form, departure_date: e.target.value})} required />
            </div>
          </div>
          <div className="form-group">
            <label>Accommodation</label>
            <input value={form.accommodation_name} onChange={e => setForm({...form, accommodation_name: e.target.value})} placeholder="Hotel name" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Accommodation Cost</label>
              <input type="number" value={form.accommodation_cost} onChange={e => setForm({...form, accommodation_cost: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Transport Cost</label>
              <input type="number" value={form.transportation_cost} onChange={e => setForm({...form, transportation_cost: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Add Stop</button>
        </form>
      )}
      {loading ? <p>Loading...</p> : stops.length === 0 ? (
        <div className="empty-state"><p>No stops yet. Add your first destination!</p></div>
      ) : (
        <div className="stops-list">
          {stops.map((stop, i) => (
            <div key={stop.stop_id} className="stop-card">
              <div className="stop-number">{i + 1}</div>
              <div className="stop-info">
                <h3>{stop.city_name}, {stop.country_name}</h3>
                <p>{new Date(stop.arrival_date).toLocaleDateString()} – {new Date(stop.departure_date).toLocaleDateString()}</p>
                {stop.accommodation_name && <p>🏨 {stop.accommodation_name}</p>}
              </div>
              <button onClick={() => handleDeleteStop(stop.stop_id)} className="btn btn-sm btn-danger">Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItineraryBuilderPage;

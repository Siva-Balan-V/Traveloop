import React, { useEffect, useState } from 'react';
import { userService } from '../services/api';

const SettingsPage = () => {
  const [form, setForm] = useState({ default_currency: 'USD', theme: 'light', email_notifications: true, trip_reminders: true });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    userService.getProfile().then(data => {
      setForm({
        default_currency: data.default_currency || 'USD',
        theme: data.theme || 'light',
        email_notifications: data.email_notifications ?? true,
        trip_reminders: data.trip_reminders ?? true,
      });
    }).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await userService.updateSettings(form);
    setSuccess('Settings saved!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="page page-narrow">
      <h1>Settings</h1>
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label>Default Currency</label>
          <select value={form.default_currency} onChange={e => setForm({...form, default_currency: e.target.value})}>
            {['USD','EUR','GBP','JPY','AUD','CAD','CHF','CNY','INR','MXN'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Theme</label>
          <select value={form.theme} onChange={e => setForm({...form, theme: e.target.value})}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div className="form-group checkbox-group">
          <label><input type="checkbox" checked={form.email_notifications} onChange={e => setForm({...form, email_notifications: e.target.checked})} /> Email Notifications</label>
        </div>
        <div className="form-group checkbox-group">
          <label><input type="checkbox" checked={form.trip_reminders} onChange={e => setForm({...form, trip_reminders: e.target.checked})} /> Trip Reminders</label>
        </div>
        <button type="submit" className="btn btn-primary">Save Settings</button>
      </form>
    </div>
  );
};

export default SettingsPage;

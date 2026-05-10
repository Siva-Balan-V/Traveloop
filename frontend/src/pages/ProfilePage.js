import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/api';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ first_name: '', last_name: '', language_preference: 'en' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    userService.getProfile().then(data => {
      setForm({ first_name: data.first_name || '', last_name: data.last_name || '', language_preference: data.language_preference || 'en' });
    }).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const updated = await userService.updateProfile(form);
      updateUser(updated);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page-narrow">
      <h1>Profile</h1>
      <p className="text-muted">{user?.email}</p>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} required />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  );
};

export default ProfilePage;

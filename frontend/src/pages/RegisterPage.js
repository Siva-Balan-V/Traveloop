import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const [form, setForm] = useState({ email: '', password: '', first_name: '', last_name: '', phone: '', city: '', country: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">✈️</div>
        <h2>Create your account</h2>
        <p className="auth-subtitle">Start planning your dream trips today</p>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input placeholder="John" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input placeholder="Doe" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} required />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Min 8 chars, uppercase, number & symbol" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input placeholder="+1 234 567 8900" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div className="form-group">
              <label>City</label>
              <input placeholder="Your city" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label>Country</label>
            <input placeholder="Your country" value={form.country} onChange={e => setForm({...form, country: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary btn-block" style={{marginTop: 8}} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <div className="auth-divider">or</div>
        <p className="auth-links">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;

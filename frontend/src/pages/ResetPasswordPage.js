import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.resetPassword(searchParams.get('token'), password);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>New Password</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            <small>Min 8 chars with uppercase, lowercase, number & special character</small>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
        </form>
        <p className="auth-links"><Link to="/login">Back to login</Link></p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

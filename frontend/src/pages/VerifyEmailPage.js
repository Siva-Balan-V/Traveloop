import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authService } from '../services/api';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { setStatus('error'); return; }
    authService.verifyEmail(token).then(() => setStatus('success')).catch(() => setStatus('error'));
  }, [searchParams]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        {status === 'verifying' && <p>Verifying your email...</p>}
        {status === 'success' && (<><h2>Email Verified!</h2><p>Your email has been verified. <Link to="/login">Login now</Link></p></>)}
        {status === 'error' && (<><h2>Verification Failed</h2><p>Invalid or expired token. <Link to="/login">Go to login</Link></p></>)}
      </div>
    </div>
  );
};

export default VerifyEmailPage;

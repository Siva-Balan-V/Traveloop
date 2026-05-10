import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="auth-page">
    <div className="auth-card" style={{textAlign:'center'}}>
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  </div>
);

export default NotFoundPage;

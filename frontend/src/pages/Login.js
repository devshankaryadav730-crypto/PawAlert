import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'authority' ? '/authority' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '0 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🐾</div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 600, color: '#0D1F2D' }}>Welcome back</h1>
          <p style={{ color: '#6B8899', marginTop: 6 }}>Sign in to your PawAlert account</p>
        </div>
        <div className="card">
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handle} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handle} required />
            </div>
            {error && <div className="form-error" style={{ fontSize: 13 }}>⚠️ {error}</div>}
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>
        </div>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6B8899' }}>
          Don't have an account? <Link to="/register" style={{ color: '#00B894', fontWeight: 600 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', city: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 460, padding: '0 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🐾</div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 600, color: '#0D1F2D' }}>Create account</h1>
          <p style={{ color: '#6B8899', marginTop: 6 }}>Join PawAlert and help protect street animals</p>
        </div>
        <div className="card">
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" name="name" placeholder="Arjun Sharma" value={form.name} onChange={handle} required />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-input" name="city" placeholder="Gurugram" value={form.city} onChange={handle} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handle} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone (optional)</label>
              <input className="form-input" name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={handle} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handle} required minLength={6} />
            </div>
            {error && <div className="form-error">⚠️ {error}</div>}
            <button className="btn btn-primary" type="submit" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>
        </div>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6B8899' }}>
          Already have an account? <Link to="/login" style={{ color: '#00B894', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/config';
import { useAuth } from '../context/AuthContext';

const TYPE_LABELS  = { dead: '💀 Dead', injured: '🤕 Injured', aggressive: '⚠️ Aggressive', abandoned: '😔 Abandoned' };
const STATUS_ICONS = { pending: '🕐', assigned: '👤', in_progress: '🚗', resolved: '✅' };

export default function Dashboard() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/api/complaints/mine')
      .then(r => setComplaints(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="page-title">My Reports</h1>
            <p className="page-subtitle">Welcome back, {user?.name} — here are all your complaints</p>
          </div>
          <Link to="/report" className="btn btn-primary">+ New Report</Link>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : complaints.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 64 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🐾</div>
            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 22, color: '#0D1F2D', marginBottom: 8 }}>No reports yet</h3>
            <p style={{ color: '#6B8899', marginBottom: 24 }}>When you report an animal, it will appear here.</p>
            <Link to="/report" className="btn btn-primary">Report an Animal →</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {complaints.map(c => (
              <div key={c._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                {c.photo && (
                  <img src={c.photo} alt="" style={{ width: 72, height: 72, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 16, color: '#0D1F2D' }}>{c.complaintId}</span>
                    <span className={`badge badge-${c.status}`}>{STATUS_ICONS[c.status]} {c.status.replace('_', ' ')}</span>
                  </div>
                  <div style={{ fontSize: 14, color: '#6B8899' }}>
                    {TYPE_LABELS[c.type]} · {c.city || 'Location not set'} · {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                  {c.description && <div style={{ fontSize: 13, color: '#8BAAB8', marginTop: 4 }}>{c.description.slice(0, 80)}{c.description.length > 80 ? '…' : ''}</div>}
                </div>
                <Link to={`/track?id=${c.complaintId}`} className="btn btn-outline btn-sm" style={{ flexShrink: 0 }}>
                  Track →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

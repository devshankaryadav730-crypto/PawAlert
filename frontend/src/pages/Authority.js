import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/config';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const STATUS_OPTS  = ['pending','assigned','in_progress','resolved'];
const STATUS_NEXT  = { pending: 'assigned', assigned: 'in_progress', in_progress: 'resolved' };
const STATUS_ICONS = { pending: '🕐', assigned: '👤', in_progress: '🚗', resolved: '✅' };
const STATUS_BTN   = { pending: 'Assign', assigned: 'Mark In Progress', in_progress: 'Mark Resolved' };
const TYPE_LABELS  = { dead: '💀 Dead', injured: '🤕 Injured', aggressive: '⚠️ Aggressive', abandoned: '😔 Abandoned' };

export default function Authority() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [stats,      setStats]      = useState({});
  const [filter,     setFilter]     = useState('all');
  const [loading,    setLoading]    = useState(true);
  const [selected,   setSelected]   = useState(null);
  const [notes,      setNotes]      = useState('');
  const [updating,   setUpdating]   = useState(false);
  const [toast,      setToast]      = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'authority') { navigate('/dashboard'); return; }
    loadAll();
  }, [user]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [cRes, sRes] = await Promise.all([
        api.get('/api/authority/complaints'),
        api.get('/api/authority/stats'),
      ]);
      setComplaints(cRes.data);
      setStats(sRes.data);
    } catch { setToast({ msg: 'Failed to load data', type: 'error' }); }
    finally { setLoading(false); }
  };

  const filtered = filter === 'all' ? complaints : complaints.filter(c => c.status === filter);

  const updateStatus = async (c) => {
    const next = STATUS_NEXT[c.status];
    if (!next) return;
    setUpdating(true);
    try {
      const { data } = await api.patch(`/api/authority/complaints/${c._id}/status`, { status: next, notes });
      setComplaints(prev => prev.map(x => x._id === data._id ? data : x));
      setStats(prev => ({ ...prev, [c.status]: prev[c.status] - 1, [next]: (prev[next] || 0) + 1 }));
      setSelected(null); setNotes('');
      setToast({ msg: `Complaint updated to ${next.replace('_', ' ')}`, type: 'success' });
    } catch { setToast({ msg: 'Update failed', type: 'error' }); }
    finally { setUpdating(false); }
  };

  return (
    <div className="page">
      <div className="container">
        {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

        <div style={{ marginBottom: 28 }}>
          <h1 className="page-title">Authority Dashboard</h1>
          <p className="page-subtitle">Manage all incoming animal complaints</p>
        </div>

        {/* Stats */}
        <div className="stats-row">
          {[
            { label: 'Total',       num: stats.total       || 0, color: '#0D1F2D' },
            { label: 'Pending',     num: stats.pending     || 0, color: '#E65100' },
            { label: 'In Progress', num: stats.in_progress || 0, color: '#6A1B9A' },
            { label: 'Resolved',    num: stats.resolved    || 0, color: '#2E7D32' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-num" style={{ color: s.color }}>{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {['all', ...STATUS_OPTS].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}>
              {s === 'all' ? 'All' : STATUS_ICONS[s] + ' ' + s.replace('_', ' ')}
            </button>
          ))}
          <button className="btn btn-sm btn-outline" style={{ marginLeft: 'auto' }} onClick={loadAll}>↻ Refresh</button>
        </div>

        {loading ? <div className="spinner" /> : (
          <div style={{ display: 'grid', gap: 14 }}>
            {filtered.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: 40, color: '#6B8899' }}>No complaints found.</div>
            )}
            {filtered.map(c => (
              <div key={c._id} className="card" style={{ borderLeft: `4px solid ${c.status === 'resolved' ? '#00B894' : c.status === 'in_progress' ? '#9C27B0' : c.status === 'assigned' ? '#1565C0' : '#E65100'}` }}>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  {c.photo && <img src={c.photo} alt="" style={{ width: 72, height: 72, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />}
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
                      <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, color: '#0D1F2D' }}>{c.complaintId}</span>
                      <span className={`badge badge-${c.status}`}>{STATUS_ICONS[c.status]} {c.status.replace('_',' ')}</span>
                      <span style={{ fontSize: 12, background: '#F0F4F6', padding: '2px 10px', borderRadius: 999, color: '#6B8899', fontWeight: 600 }}>{c.source === 'whatsapp' ? '💬 WhatsApp' : '🌐 Web'}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1A2E3B', marginBottom: 4 }}>{TYPE_LABELS[c.type]}</div>
                    <div style={{ fontSize: 13, color: '#6B8899' }}>
                      📍 {c.location?.address || `${c.location?.lat?.toFixed(4)}, ${c.location?.lng?.toFixed(4)}`} {c.city && `· ${c.city}`}
                    </div>
                    {c.description && <div style={{ fontSize: 13, color: '#8BAAB8', marginTop: 4 }}>{c.description}</div>}
                    {c.reporter && <div style={{ fontSize: 13, color: '#6B8899', marginTop: 4 }}>👤 {c.reporter.name} · {c.reporter.phone || c.reporter.email}</div>}
                    {c.reporterPhone && <div style={{ fontSize: 13, color: '#6B8899', marginTop: 4 }}>📱 {c.reporterPhone}</div>}
                    <div style={{ fontSize: 12, color: '#aab8c0', marginTop: 4 }}>{new Date(c.createdAt).toLocaleString('en-IN')}</div>
                  </div>

                  {/* Actions */}
                  {c.status !== 'resolved' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                      <button className="btn btn-primary btn-sm"
                        onClick={() => { setSelected(c); setNotes(c.notes || ''); }}>
                        {STATUS_BTN[c.status]} →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Update modal */}
        {selected && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,31,45,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
            <div className="card" style={{ width: '100%', maxWidth: 440, padding: 32 }}>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 600, color: '#0D1F2D', marginBottom: 8 }}>
                Update {selected.complaintId}
              </h3>
              <p style={{ color: '#6B8899', fontSize: 14, marginBottom: 20 }}>
                Change status from <strong>{selected.status.replace('_', ' ')}</strong> → <strong>{STATUS_NEXT[selected.status]?.replace('_', ' ')}</strong>
              </p>
              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label">Notes for reporter (optional)</label>
                <textarea className="form-input" rows={3} placeholder="e.g. Team dispatched, will arrive in 30 min" value={notes} onChange={e => setNotes(e.target.value)} style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setSelected(null)}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} disabled={updating} onClick={() => updateStatus(selected)}>
                  {updating ? 'Updating…' : `Confirm →`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

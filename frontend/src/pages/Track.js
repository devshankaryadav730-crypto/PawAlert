import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const STATUS_STEPS = ['pending', 'assigned', 'in_progress', 'resolved'];
const STATUS_LABELS = { pending: 'Pending', assigned: 'Assigned', in_progress: 'In Progress', resolved: 'Resolved' };
const STATUS_ICONS  = { pending: '🕐', assigned: '👤', in_progress: '🚗', resolved: '✅' };
const STATUS_DESC   = {
  pending:     'Your complaint has been received. Awaiting assignment.',
  assigned:    'A field officer has been assigned to your complaint.',
  in_progress: 'The team is on the way to the location.',
  resolved:    'This complaint has been resolved. Thank you for reporting!',
};
const TYPE_LABELS = { dead: '💀 Dead Animal', injured: '🤕 Injured Animal', aggressive: '⚠️ Aggressive Animal', abandoned: '😔 Abandoned Animal' };

export default function Track() {
  const [params] = useSearchParams();
  const [id,         setId]         = useState(params.get('id') || '');
  const [complaint,  setComplaint]  = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  const search = async (e) => {
    e?.preventDefault();
    if (!id.trim()) return;
    setLoading(true); setError(''); setComplaint(null);
    try {
      const { data } = await axios.get(`/api/complaints/track/${id.trim().toUpperCase()}`);
      setComplaint(data);
    } catch {
      setError('Complaint not found. Please check your ID.');
    } finally { setLoading(false); }
  };

  useEffect(() => { if (params.get('id')) search(); }, []);

  const currentStep = STATUS_STEPS.indexOf(complaint?.status || 'pending');

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 600 }}>
        <div className="page-header">
          <h1 className="page-title">Track Complaint</h1>
          <p className="page-subtitle">Enter your complaint ID to see the latest status</p>
        </div>

        {/* Search box */}
        <div className="card" style={{ marginBottom: 28 }}>
          <form onSubmit={search} style={{ display: 'flex', gap: 12 }}>
            <input className="form-input" style={{ flex: 1 }}
              placeholder="e.g. PA-3F9A2C"
              value={id}
              onChange={e => setId(e.target.value.toUpperCase())}
            />
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? '…' : 'Track →'}
            </button>
          </form>
        </div>

        {error && (
          <div style={{ background: '#FEE', border: '1px solid #F99', borderRadius: 12, padding: 16, color: '#C00', fontSize: 14, marginBottom: 20 }}>
            ⚠️ {error}
          </div>
        )}

        {complaint && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Header card */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#6B8899', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Complaint ID</div>
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 600, color: '#0D1F2D' }}>{complaint.complaintId}</div>
                </div>
                <span className={`badge badge-${complaint.status}`} style={{ fontSize: 13 }}>
                  {STATUS_ICONS[complaint.status]} {STATUS_LABELS[complaint.status]}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16, marginTop: 20, paddingTop: 20, borderTop: '1px solid #DCE9E4' }}>
                <div>
                  <div style={{ fontSize: 12, color: '#6B8899', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</div>
                  <div style={{ fontWeight: 600, marginTop: 4 }}>{TYPE_LABELS[complaint.type]}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#6B8899', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Source</div>
                  <div style={{ fontWeight: 600, marginTop: 4 }}>{complaint.source === 'whatsapp' ? '💬 WhatsApp' : '🌐 Website'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#6B8899', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reported</div>
                  <div style={{ fontWeight: 600, marginTop: 4 }}>{new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
                {complaint.city && (
                  <div>
                    <div style={{ fontSize: 12, color: '#6B8899', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>City</div>
                    <div style={{ fontWeight: 600, marginTop: 4 }}>{complaint.city}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Progress timeline */}
            <div className="card">
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 24, color: '#0D1F2D' }}>Status Timeline</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {STATUS_STEPS.map((s, i) => {
                  const done    = i <= currentStep;
                  const current = i === currentStep;
                  return (
                    <div key={s} style={{ display: 'flex', gap: 16, position: 'relative' }}>
                      {/* Line */}
                      {i < STATUS_STEPS.length - 1 && (
                        <div style={{ position: 'absolute', left: 17, top: 36, width: 2, height: 'calc(100% - 8px)', background: done && i < currentStep ? '#00B894' : '#DCE9E4', transition: 'background 0.3s' }} />
                      )}
                      {/* Dot */}
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: done ? '#00B894' : '#F0F4F6', border: `2px solid ${done ? '#00B894' : '#DCE9E4'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, zIndex: 1, transition: 'all 0.3s' }}>
                        {done ? (current ? STATUS_ICONS[s] : '✓') : STATUS_ICONS[s]}
                      </div>
                      {/* Content */}
                      <div style={{ paddingBottom: i < STATUS_STEPS.length - 1 ? 24 : 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: done ? '#0D1F2D' : '#6B8899' }}>{STATUS_LABELS[s]}</div>
                        {current && <div style={{ fontSize: 13, color: '#6B8899', marginTop: 2 }}>{STATUS_DESC[s]}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Photo if exists */}
            {complaint.photo && (
              <div className="card">
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: '#0D1F2D' }}>Submitted Photo</h3>
                <img src={complaint.photo} alt="complaint" style={{ width: '100%', borderRadius: 12, maxHeight: 280, objectFit: 'cover' }} />
              </div>
            )}

            {/* Notes from authority */}
            {complaint.notes && (
              <div className="card" style={{ background: '#E8FBF5', border: '1px solid #00B894' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#00B894', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Authority Notes</div>
                <p style={{ fontSize: 14, color: '#0D1F2D' }}>{complaint.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

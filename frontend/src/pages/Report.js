import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const TYPES = [
  { value: 'dead',       emoji: '💀', label: 'Dead Animal',       sub: 'Animal found deceased on road' },
  { value: 'injured',    emoji: '🤕', label: 'Injured Animal',    sub: 'Animal needs medical help' },
  { value: 'aggressive', emoji: '⚠️', label: 'Aggressive Animal', sub: 'Animal posing danger' },
  { value: 'abandoned',  emoji: '😔', label: 'Abandoned Animal',  sub: 'Animal left without care' },
];

export default function Report() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step,        setStep]        = useState(1); // 1=type, 2=location, 3=details, 4=done
  const [type,        setType]        = useState('');
  const [coords,      setCoords]      = useState(null);
  const [address,     setAddress]     = useState('');
  const [gpsLoading,  setGpsLoading]  = useState(false);
  const [description, setDescription] = useState('');
  const [photo,       setPhoto]       = useState(null);
  const [photoPreview,setPhotoPreview]= useState('');
  const [city,        setCity]        = useState(user?.city || '');
  const [submitting,  setSubmitting]  = useState(false);
  const [result,      setResult]      = useState(null);
  const [toast,       setToast]       = useState(null);

  const getGPS = () => {
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setAddress(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
        setGpsLoading(false);
      },
      () => { setToast({ msg: 'GPS failed. Please enter location manually.', type: 'error' }); setGpsLoading(false); }
    );
  };

  useEffect(() => { if (step === 2) getGPS(); }, [step]);

  const handlePhoto = e => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const submit = async () => {
    if (!user) { navigate('/login'); return; }
    if (!coords) { setToast({ msg: 'Location is required', type: 'error' }); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('type', type);
      fd.append('description', description);
      fd.append('lat', coords.lat);
      fd.append('lng', coords.lng);
      fd.append('address', address);
      fd.append('city', city);
      if (photo) fd.append('photo', photo);
      const { data } = await axios.post('/api/complaints', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(data);
      setStep(4);
    } catch (err) {
      setToast({ msg: err.response?.data?.message || 'Submission failed', type: 'error' });
    } finally { setSubmitting(false); }
  };

  const progress = (step / 4) * 100;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 600 }}>
        {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

        {step < 4 && (
          <>
            <div className="page-header">
              <h1 className="page-title">Report an Animal</h1>
              <p className="page-subtitle">Step {step} of 3 — {['', 'Choose type', 'Confirm location', 'Add details'][step]}</p>
            </div>
            {/* Progress bar */}
            <div style={{ height: 4, background: '#DCE9E4', borderRadius: 999, marginBottom: 32, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: '#00B894', borderRadius: 999, transition: 'width 0.4s ease' }} />
            </div>
          </>
        )}

        {/* STEP 1 — Type */}
        {step === 1 && (
          <div className="card">
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#0D1F2D' }}>What did you see?</h2>
            <div className="type-grid">
              {TYPES.map(t => (
                <div key={t.value} className={`type-card ${type === t.value ? 'selected' : ''}`}
                  onClick={() => setType(t.value)}>
                  <span className="type-emoji">{t.emoji}</span>
                  <div>
                    <div className="type-label">{t.label}</div>
                    <div className="type-sub">{t.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 24 }}
              disabled={!type} onClick={() => setStep(2)}>
              Continue →
            </button>
          </div>
        )}

        {/* STEP 2 — Location */}
        {step === 2 && (
          <div className="card">
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#0D1F2D' }}>Confirm Location</h2>
            <p style={{ color: '#6B8899', fontSize: 14, marginBottom: 20 }}>We've tried to auto-detect your location. You can adjust it below.</p>

            {gpsLoading ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#6B8899' }}>
                <div className="spinner" style={{ margin: '0 auto 12px' }} />
                Detecting your location…
              </div>
            ) : coords ? (
              <div style={{ background: '#E8FBF5', border: '1.5px solid #00B894', borderRadius: 12, padding: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 24 }}>📍</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#0D1F2D' }}>Location detected</div>
                  <div style={{ fontSize: 13, color: '#6B8899' }}>Lat: {coords.lat.toFixed(5)}, Lng: {coords.lng.toFixed(5)}</div>
                </div>
              </div>
            ) : (
              <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }} onClick={getGPS}>
                📍 Try GPS Again
              </button>
            )}

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Address / Landmark (optional)</label>
              <input className="form-input" placeholder="e.g. Near Cyber Hub, DLF Phase 2" value={address} onChange={e => setAddress(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label">City</label>
              <input className="form-input" placeholder="Gurugram" value={city} onChange={e => setCity(e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-outline" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center' }}>← Back</button>
              <button className="btn btn-primary" onClick={() => setStep(3)} disabled={!coords} style={{ flex: 2, justifyContent: 'center' }}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 3 — Details + Photo */}
        {step === 3 && (
          <div className="card">
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#0D1F2D' }}>Add Details</h2>

            {/* Photo upload */}
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">Photo (optional but recommended)</label>
              <label style={{ display: 'block', cursor: 'pointer' }}>
                {photoPreview ? (
                  <div style={{ position: 'relative' }}>
                    <img src={photoPreview} alt="preview" style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 12, border: '2px solid #00B894' }} />
                    <div style={{ position: 'absolute', top: 8, right: 8, background: '#00B894', color: 'white', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>Change</div>
                  </div>
                ) : (
                  <div style={{ border: '2px dashed #DCE9E4', borderRadius: 12, padding: '32px 16px', textAlign: 'center', color: '#6B8899', transition: 'all 0.2s' }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Click to upload a photo</div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>JPG, PNG up to 10MB</div>
                  </div>
                )}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
              </label>
            </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label">Description (optional)</label>
              <textarea className="form-input" rows={3} placeholder="Any additional details that might help authorities..." value={description} onChange={e => setDescription(e.target.value)} style={{ resize: 'vertical' }} />
            </div>

            {/* Summary */}
            <div style={{ background: '#F7FCFA', border: '1px solid #DCE9E4', borderRadius: 12, padding: 16, marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#6B8899', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Summary</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: '#6B8899' }}>Type</span>
                  <span style={{ fontWeight: 600 }}>{TYPES.find(t => t.value === type)?.emoji} {TYPES.find(t => t.value === type)?.label}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: '#6B8899' }}>Location</span>
                  <span style={{ fontWeight: 600 }}>{city || 'Not specified'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: '#6B8899' }}>Photo</span>
                  <span style={{ fontWeight: 600 }}>{photo ? '✅ Attached' : 'None'}</span>
                </div>
              </div>
            </div>

            {!user && (
              <div style={{ background: '#FFF3E0', border: '1px solid #FFB74D', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#E65100' }}>
                ⚠️ You need to <a href="/login" style={{ color: '#E65100', fontWeight: 700 }}>login</a> to submit a complaint.
              </div>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-outline" onClick={() => setStep(2)} style={{ flex: 1, justifyContent: 'center' }}>← Back</button>
              <button className="btn btn-primary" onClick={submit} disabled={submitting || !user} style={{ flex: 2, justifyContent: 'center' }}>
                {submitting ? 'Submitting…' : '🐾 Submit Report'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — Success */}
        {step === 4 && result && (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 600, color: '#0D1F2D', marginBottom: 8 }}>Complaint Registered!</h2>
            <p style={{ color: '#6B8899', marginBottom: 28 }}>Authorities have been notified. Track updates with your complaint ID.</p>

            <div style={{ background: '#E8FBF5', border: '2px solid #00B894', borderRadius: 16, padding: '20px 32px', display: 'inline-block', marginBottom: 32 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#00B894', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Your Complaint ID</div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 36, fontWeight: 600, color: '#0D1F2D', letterSpacing: '0.04em' }}>{result.complaintId}</div>
            </div>

            <p style={{ fontSize: 13, color: '#6B8899', marginBottom: 28 }}>Save this ID to track your complaint status anytime.</p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => navigate(`/track?id=${result.complaintId}`)}>Track This Complaint →</button>
              <button className="btn btn-outline" onClick={() => { setStep(1); setType(''); setCoords(null); setPhoto(null); setPhotoPreview(''); setDescription(''); setResult(null); }}>Report Another</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

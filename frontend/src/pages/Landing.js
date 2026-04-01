import React from 'react';
import { Link } from 'react-router-dom';

const steps = [
  { icon: '📋', title: 'Choose Type', desc: 'Select from dead, injured, aggressive, or abandoned animal.' },
  { icon: '📍', title: 'Pin Location', desc: 'GPS auto-detects your location — no typing needed.' },
  { icon: '📸', title: 'Add Photo', desc: 'Optional photo helps authorities respond faster.' },
  { icon: '✅', title: 'Track It', desc: 'Get a complaint ID and follow up until resolved.' },
];

const stats = [
  { num: '62M+', label: 'Stray dogs in India' },
  { num: '2 Days', label: 'Avg. response time without PawAlert' },
  { num: '60 sec', label: 'Time to file a complaint' },
  { num: '0', label: 'Dedicated apps before this' },
];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0D1F2D 0%, #1E3A4A 100%)', color: 'white', padding: '96px 24px 80px' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,184,148,0.15)', border: '1px solid rgba(0,184,148,0.3)', borderRadius: 999, padding: '6px 16px', fontSize: 13, color: '#00B894', marginBottom: 28, fontWeight: 600 }}>
            🐾 India's first stray animal reporting platform
          </div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(38px, 6vw, 68px)', fontWeight: 600, lineHeight: 1.1, maxWidth: 760, marginBottom: 20 }}>
            See a stray in need?<br />
            <span style={{ color: '#00B894' }}>Report it in 60 seconds.</span>
          </h1>
          <p style={{ fontSize: 17, color: '#8BAAB8', maxWidth: 520, marginBottom: 40, lineHeight: 1.7 }}>
            PawAlert connects citizens directly to municipal authorities and NGOs. One tap, real location, real action.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/report" className="btn btn-primary btn-lg">Report an Animal →</Link>
            <Link to="/track"  className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>Track a Complaint</Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: '#00B894', padding: '28px 24px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 24, textAlign: 'center' }}>
            {stats.map(s => (
              <div key={s.num}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: 30, fontWeight: 600, color: 'white' }}>{s.num}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 36, fontWeight: 600, color: '#0D1F2D' }}>How it works</h2>
            <p style={{ color: '#6B8899', marginTop: 8, fontSize: 16 }}>Four simple steps. No confusion. No helpline maze.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {steps.map((s, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: 32 }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{s.icon}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', background: '#E8FBF5', color: '#00B894', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>{i + 1}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0D1F2D', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#6B8899', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section style={{ background: '#E8FBF5', padding: '64px 24px' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#00B894', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Also on WhatsApp</div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 30, fontWeight: 600, color: '#0D1F2D', marginBottom: 14, lineHeight: 1.3 }}>No app needed.<br />Just message us.</h2>
            <p style={{ color: '#6B8899', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
              Send a WhatsApp message to our number. Our bot walks you through everything — complaint type, location sharing, photo — in under 2 minutes.
            </p>
            <a href="https://wa.me/your_number" target="_blank" rel="noreferrer"
               className="btn btn-dark btn-lg" style={{ background: '#25D366' }}>
              💬 Chat on WhatsApp
            </a>
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div className="card" style={{ background: '#0D1F2D', color: 'white', fontFamily: 'monospace', fontSize: 13, lineHeight: 2 }}>
              <div style={{ color: '#25D366' }}>🤖 PawAlert Bot</div>
              <div style={{ marginTop: 8, color: '#8BAAB8' }}>Welcome! What would you like to report?</div>
              <div style={{ color: '#8BAAB8' }}>1️⃣ Dead animal on road</div>
              <div style={{ color: '#8BAAB8' }}>2️⃣ Injured animal</div>
              <div style={{ color: '#8BAAB8' }}>3️⃣ Aggressive animal</div>
              <div style={{ color: '#8BAAB8' }}>4️⃣ Abandoned animal</div>
              <div style={{ marginTop: 8, color: '#00B894' }}>👤 You: 1</div>
              <div style={{ color: '#8BAAB8', marginTop: 4 }}>Got it — Dead animal 📍 Please share your live location...</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0D1F2D', color: '#8BAAB8', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 20, color: 'white', marginBottom: 8 }}>🐾 PawAlert</div>
        <div style={{ fontSize: 13 }}>Made with care — Venture Ideation Project · B.Tech CSE</div>
      </footer>
    </div>
  );
}

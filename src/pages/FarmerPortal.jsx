import { useState, useRef } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopNav from '../components/layout/TopNav';
import { HealthGauge } from '../components/charts/HealthGauge';
import { farmers } from '../data/mockData';
import { CheckCircle, Camera, Upload, MapPin, X, AlertCircle } from 'lucide-react';

const myFarmer = farmers[0]; // Rajan Patil as the logged-in farmer

const HISTORY = [
  { date: 'Aug 10, 2026', score: 82, status: 'approved', crop: 'Cotton' },
  { date: 'Mar 15, 2026', score: 74, status: 'approved', crop: 'Wheat' },
  { date: 'Nov 02, 2025', score: 61, status: 'approved', crop: 'Cotton' },
];

function scoreColor(s) {
  return s >= 75 ? 'var(--primary)' : s >= 50 ? 'var(--accent)' : 'var(--danger)';
}

// Simulate GPS coordinates for uploaded photos
function fakeGPS() {
  const lat = (18.5 + Math.random() * 0.05).toFixed(5);
  const lng = (73.8 + Math.random() * 0.05).toFixed(5);
  return `${lat}°N, ${lng}°E`;
}

export default function FarmerPortal() {
  const [tab, setTab] = useState('overview');
  const [photos, setPhotos] = useState([]);
  const [cropType, setCropType] = useState('Cotton');
  const [plotSize, setPlotSize] = useState(myFarmer.plotSize || '');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  function handleFiles(files) {
    const allowed = Math.min(files.length, 3 - photos.length);
    const newPhotos = Array.from(files).slice(0, allowed).map(f => ({
      file: f,
      preview: URL.createObjectURL(f),
      gps: fakeGPS(),
      id: Math.random().toString(36).slice(2),
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
  }

  function removePhoto(id) {
    setPhotos(prev => prev.filter(p => p.id !== id));
  }

  function handleSubmit() {
    if (photos.length < 2) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setPhotos([]);
    setNotes('');
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopNav title="Farmer Portal" subtitle={`Welcome back, ${myFarmer.name}`} />
        <div className="page-body">

          {/* Tabs */}
          <div className="farmer-tab-bar">
            {[
              { key: 'overview', label: '📊 Overview' },
              { key: 'score', label: '🌿 My Score' },
              { key: 'history', label: '📋 History' },
              { key: 'submit', label: '📸 Upload Photos' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                id={`tab-${t.key}`}
                style={{
                  padding: '10px 16px', fontSize: '0.875rem', fontWeight: 600,
                  border: 'none', background: 'none', cursor: 'pointer',
                  color: tab === t.key ? 'var(--primary)' : 'var(--text-muted)',
                  borderBottom: tab === t.key ? '2px solid var(--primary)' : '2px solid transparent',
                  transition: 'all var(--transition)', fontFamily: 'inherit',
                  marginBottom: -1, whiteSpace: 'nowrap',
                }}
              >{t.label}</button>
            ))}
          </div>

          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div className="animate-slide-up">
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap' }}>
                <div className="topnav-avatar" style={{ width: 64, height: 64, fontSize: '1.4rem', flexShrink: 0 }}>
                  {myFarmer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem', color: 'var(--text-primary)' }}>{myFarmer.name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 4 }}>📍 {myFarmer.village} · 🆔 {myFarmer.aadhaar}</div>
                  <div style={{ marginTop: 8 }}>
                    <span className="badge badge-success"><CheckCircle size={12} /> Verified Farmer</span>
                  </div>
                </div>
              </div>

              <div className="farmer-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
                {[
                  { icon: '🌱', label: 'Current Crop', value: myFarmer.cropType },
                  { icon: '📐', label: 'Plot Size', value: `${myFarmer.plotSize} acre` },
                  { icon: '📍', label: 'Location', value: myFarmer.village.split(',')[0] },
                ].map(s => (
                  <div key={s.label} className="card" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px' }}>
                    <div style={{ fontSize: 24 }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="two-col">
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 20px', gap: 8 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Current Health Score</div>
                  <HealthGauge score={myFarmer.healthScore} size={170} />
                  <div style={{ marginTop: 8, fontSize: '0.82rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    Based on Aug 10 verification · Agent: {myFarmer.agentName}
                  </div>
                </div>
                <div className="card">
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 14 }}>Verification Summary</div>
                  {[
                    { label: 'Photos Submitted', value: `${myFarmer.photos.length} photos`, ok: true },
                    { label: 'GPS Verification', value: 'All matched', ok: true },
                    { label: 'AI Crop Score', value: `${myFarmer.healthScore}/100`, ok: true },
                    { label: 'Peer Vouches', value: `${myFarmer.vouches.length} farmers`, ok: myFarmer.vouches.length > 0 },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{r.label}</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: r.ok ? 'var(--primary)' : 'var(--danger)' }}>{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SCORE TAB */}
          {tab === 'score' && (
            <div className="animate-slide-up">
              <div className="section-card mb-20">
                <div className="section-card-header">
                  <div className="section-card-title">🌿 Crop Health Score Breakdown</div>
                  <span className="badge badge-success">Aug 10, 2026</span>
                </div>
                <div className="section-card-body">
                  <div className="score-breakdown-grid" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 32, alignItems: 'center' }}>
                    <HealthGauge score={myFarmer.healthScore} size={170} />
                    <div className="breakdown-bar-wrap">
                      {Object.entries(myFarmer.scoreBreakdown).map(([k, v]) => (
                        <div key={k} className="breakdown-row">
                          <div className="breakdown-label-row">
                            <span className="breakdown-label">{k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
                            <span className="breakdown-value">{v}/100</span>
                          </div>
                          <div className="breakdown-track">
                            <div className="breakdown-fill" style={{ width: `${v}%`, background: scoreColor(v) }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HISTORY TAB */}
          {tab === 'history' && (
            <div className="animate-slide-up">
              <div className="section-card">
                <div className="section-card-header">
                  <div className="section-card-title">📋 Verification History</div>
                </div>
                <div className="table-wrap" style={{ borderRadius: 0, border: 'none' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Crop</th>
                        <th>Health Score</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {HISTORY.map((h, i) => (
                        <tr key={i} id={`history-row-${i}`}>
                          <td style={{ color: 'var(--text-secondary)' }}>{h.date}</td>
                          <td><span className="badge badge-info">🌱 {h.crop}</span></td>
                          <td>
                            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: scoreColor(h.score), fontSize: '1rem' }}>{h.score}</span>
                          </td>
                          <td><span className="badge badge-success"><CheckCircle size={11} /> {h.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PHOTO UPLOAD TAB */}
          {tab === 'submit' && (
            <div className="animate-slide-up">

              {/* Success toast */}
              {submitted && (
                <div style={{ marginBottom: 20, padding: '14px 18px', background: 'var(--primary-dim)', border: '1px solid rgba(200,230,58,0.3)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle size={18} color="var(--primary)" />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>Verification submitted!</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>AI crop analysis is in progress. Results typically ready in 2–5 minutes.</div>
                  </div>
                </div>
              )}

              <div className="section-card">
                <div className="section-card-header">
                  <div className="section-card-title"><Camera size={16} /> Upload Geo-Tagged Crop Photos</div>
                </div>
                <div className="section-card-body">

                  {/* Info banner */}
                  <div style={{ marginBottom: 24, padding: '12px 16px', background: 'var(--info-dim)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--info)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>Upload <strong>2–3 photos</strong> of your crop from different angles. GPS coordinates are automatically extracted from each photo for verification.</span>
                  </div>

                  {/* Drop zone */}
                  {photos.length < 3 && (
                    <div
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: `2px dashed ${dragOver ? 'var(--primary)' : 'var(--border)'}`,
                        borderRadius: 16, padding: '36px 20px', textAlign: 'center',
                        cursor: 'pointer', transition: 'all 0.2s',
                        background: dragOver ? 'var(--primary-dim)' : 'var(--bg-base)',
                        marginBottom: 20,
                      }}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={e => handleFiles(e.target.files)}
                      />
                      <div style={{ fontSize: 36, marginBottom: 10 }}>📷</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                        {dragOver ? 'Drop photos here' : 'Tap to select photos'}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {photos.length}/3 uploaded · Supports JPG, PNG, HEIC
                      </div>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ marginTop: 16, borderRadius: 'var(--radius-full)', pointerEvents: 'none' }}>
                        <Upload size={14} /> Browse Photos
                      </button>
                    </div>
                  )}

                  {/* Photo previews */}
                  {photos.length > 0 && (
                    <div className="photo-upload-grid" style={{ marginBottom: 24 }}>
                      {photos.map((p, i) => (
                        <div key={p.id} style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
                          <img src={p.preview} alt={`crop-${i}`} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
                          {/* GPS badge */}
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '6px 8px', background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <MapPin size={10} color="var(--primary)" />
                              <span style={{ fontSize: '0.62rem', color: 'var(--primary)', fontWeight: 600 }}>✓ GPS</span>
                              <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.55)', marginLeft: 2 }}>{p.gps}</span>
                            </div>
                          </div>
                          {/* Remove btn */}
                          <button
                            onClick={() => removePhoto(p.id)}
                            style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.65)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                            <X size={12} />
                          </button>
                          {/* Photo number */}
                          <div style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(200,230,58,0.9)', borderRadius: 6, padding: '2px 7px', fontSize: '0.65rem', fontWeight: 700, color: '#080D08' }}>Photo {i + 1}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Crop details */}
                  <div className="farmer-form-grid" style={{ marginBottom: 20 }}>
                    <div className="form-group">
                      <label className="form-label">Crop Type</label>
                      <select className="form-input form-select" id="crop-type-select" value={cropType} onChange={e => setCropType(e.target.value)}>
                        {['Cotton', 'Wheat', 'Soybean', 'Rice', 'Maize', 'Groundnut'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Plot Size (acres)</label>
                      <input className="form-input" type="number" step="0.1" id="plot-size" value={plotSize} onChange={e => setPlotSize(e.target.value)} />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1/-1' }}>
                      <label className="form-label">Notes (optional)</label>
                      <textarea className="form-input" rows={3} id="visit-notes" placeholder="Any details about current crop condition, irrigation, pest issues…" value={notes} onChange={e => setNotes(e.target.value)} />
                    </div>
                  </div>

                  {/* Validation hint */}
                  {photos.length < 2 && (
                    <div style={{ marginBottom: 16, fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <AlertCircle size={13} /> At least 2 photos required to submit
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    {photos.length > 0 && (
                      <button className="btn btn-outline btn-sm" onClick={() => setPhotos([])} style={{ borderRadius: 'var(--radius-full)' }}>
                        Clear All
                      </button>
                    )}
                    <button
                      className="btn btn-primary"
                      id="submit-photos-btn"
                      disabled={photos.length < 2}
                      onClick={handleSubmit}
                      style={{ borderRadius: 'var(--radius-full)', opacity: photos.length < 2 ? 0.5 : 1, cursor: photos.length < 2 ? 'not-allowed' : 'pointer' }}>
                      <Camera size={15} /> Submit Verification ({photos.length}/3 photos)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopNav from '../components/layout/TopNav';
import { farmers } from '../data/mockData';
import { Camera, MapPin, Upload, CheckCircle, AlertTriangle, Wifi, WifiOff, Zap, X, RefreshCw, FileText, Users } from 'lucide-react';

const CROPS = ['Cotton', 'Wheat', 'Soybean', 'Rice', 'Maize', 'Groundnut', 'Sugarcane', 'Tomato'];

const PHOTO_SLOTS = [
  'North Corner', 'Plot Centre', 'South Boundary', 'Leaf Sample', 'Overall Stand'
];

function GPSIndicator({ status }) {
  return (
    <div className={`gps-indicator ${status === 'locked' ? 'gps-locked' : 'gps-acquiring'}`}>
      <div className={`gps-dot${status !== 'locked' ? ' pulse' : ''}`} />
      {status === 'locked' ? 'GPS Locked' : 'Acquiring GPS…'}
    </div>
  );
}

function PhotoCaptureSlot({ index, label, photo, onUpload }) {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setChecking(true);
    setResult(null);
    setTimeout(() => {
      const match = Math.random() > 0.2;
      setResult({ match, lat: (20.7 + Math.random() * 0.01).toFixed(5), lng: (78.6 + Math.random() * 0.01).toFixed(5), ts: new Date().toLocaleTimeString() });
      setChecking(false);
      onUpload && onUpload({ label, match, file: file.name });
    }, 1800);
  };

  return (
    <div className="photo-slot" style={{
      flexDirection: 'column', gap: 6,
      border: result ? `2px solid ${result.match ? 'var(--primary)' : 'var(--danger)'}` : '2px dashed var(--border-light)',
      background: result ? (result.match ? 'var(--primary-dim)' : 'var(--danger-dim)') : 'var(--bg-elevated)',
      transition: 'all 0.3s',
    }}>
      <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} id={`photo-input-${index}`} />

      {checking ? (
        <>
          <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--border-light)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite' }} />
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Verifying GPS…</div>
        </>
      ) : result ? (
        <>
          <div style={{ fontSize: result.match ? 28 : 26 }}>{result.match ? '✅' : '⚠️'}</div>
          <div style={{ fontSize: '0.68rem', color: result.match ? 'var(--primary)' : 'var(--danger)', fontWeight: 700, textAlign: 'center' }}>
            {result.match ? 'GPS Match' : 'Mismatch'}
          </div>
          <div className="photo-slot-label">{label}</div>
        </>
      ) : (
        <>
          <label htmlFor={`photo-input-${index}`} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <Camera size={22} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center' }}>{label}</span>
          </label>
        </>
      )}

      {result && (
        <div style={{
          position: 'absolute', bottom: 4, left: 4, right: 4,
          background: 'rgba(0,0,0,0.7)', borderRadius: 4, fontSize: '0.6rem',
          color: '#ccc', padding: '2px 4px', textAlign: 'center',
        }}>
          {result.lat}, {result.lng}
        </div>
      )}
    </div>
  );
}

export default function AgentApp() {
  const [step, setStep] = useState(0); // 0: select farmer, 1: capture, 2: receipt, 3: vouch, 4: score
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [gpsStatus, setGpsStatus] = useState('acquiring');
  const [coords, setCoords] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [receiptScanned, setReceiptScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [vouched, setVouched] = useState([]);
  const [vouchSearch, setVouchSearch] = useState('');
  const [aiScore, setAiScore] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('Cotton');

  // Simulate GPS lock
  useEffect(() => {
    const t = setTimeout(() => {
      setGpsStatus('locked');
      setCoords({ lat: 20.7453, lng: 78.6022 });
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  const handlePhotoUpload = (data) => {
    setPhotos(prev => [...prev, data]);
  };

  const handleScanReceipt = () => {
    setScanning(true);
    setTimeout(() => { setScanning(false); setReceiptScanned(true); }, 2200);
  };

  const handleVouch = (farmer) => {
    if (!vouched.find(v => v.id === farmer.id)) setVouched(prev => [...prev, farmer]);
  };

  const handleCalculateScore = () => {
    setCalculating(true);
    setTimeout(() => {
      const base = 55 + Math.random() * 35;
      const bonus = (photos.filter(p => p.match).length * 3) + (receiptScanned ? 5 : 0) + (vouched.length * 4);
      setAiScore(Math.min(100, Math.round(base + bonus)));
      setCalculating(false);
      setStep(4);
    }, 2800);
  };

  const pending = farmers.filter(f => f.status === 'pending');
  const searchResults = farmers.filter(f =>
    f.name.toLowerCase().includes(vouchSearch.toLowerCase()) &&
    !vouched.find(v => v.id === f.id) &&
    f.id !== selectedFarmer?.id
  );

  const steps = ['Select', 'Capture', 'Receipt', 'Vouch', 'Score'];

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopNav
          title="Field Agent App"
          subtitle="Mobile verification & capture"
          actions={<GPSIndicator status={gpsStatus} />}
        />
        <div className="page-body" style={{ maxWidth: 720 }}>

          {/* Step indicator */}
          <div className="steps-wrap">
            {steps.map((s, i) => (
              <div key={s} className={`step-item${i === step ? ' active' : ''}${i < step ? ' done' : ''}`}>
                <div className="step-circle">
                  {i < step ? <CheckCircle size={14} /> : i + 1}
                </div>
                <div className="step-label">{s}</div>
              </div>
            ))}
          </div>

          {/* STEP 0: Select Farmer */}
          {step === 0 && (
            <div className="section-card animate-slide-up">
              <div className="section-card-header">
                <div className="section-card-title"><Users size={16} /> Select Farmer Assignment</div>
                <span className="badge badge-warning">{pending.length} pending</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {pending.map(f => (
                  <div
                    key={f.id}
                    onClick={() => { setSelectedFarmer(f); setStep(1); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
                      borderBottom: '1px solid var(--border)', cursor: 'pointer',
                      transition: 'background var(--transition)',
                    }}
                    id={`assign-${f.id}`}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div className="topnav-avatar" style={{ width: 44, height: 44, fontSize: '0.9rem', flexShrink: 0 }}>
                      {f.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{f.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        📍 {f.village} · 🌱 {f.cropType} · {f.plotSize} acre
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Loan Req.</div>
                      <div style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '0.95rem' }}>₹{f.loanAmount?.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: Capture Photos */}
          {step === 1 && selectedFarmer && (
            <div className="animate-slide-up">
              <div className="section-card mb-20">
                <div className="section-card-header">
                  <div className="section-card-title">📋 Assignment Details</div>
                  <button className="btn btn-outline btn-sm" onClick={() => setStep(0)} id="back-assign-btn"><X size={14} /> Change</button>
                </div>
                <div style={{ padding: '14px 20px', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  {[
                    { k: 'Farmer', v: selectedFarmer.name },
                    { k: 'Village', v: selectedFarmer.village },
                    { k: 'Crop', v: selectedFarmer.cropType },
                    { k: 'Plot Size', v: `${selectedFarmer.plotSize} acre` },
                    { k: 'GPS (Claimed)', v: `${selectedFarmer.lat}, ${selectedFarmer.lng}` },
                    { k: 'Your GPS', v: coords ? `${coords.lat}, ${coords.lng}` : '—' },
                  ].map(({ k, v }) => (
                    <div key={k}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginTop: 2 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section-card mb-20">
                <div className="section-card-header">
                  <div className="section-card-title"><Camera size={16} /> Geo-Tagged Photo Capture</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <GPSIndicator status={gpsStatus} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{photos.length}/5 captured</span>
                  </div>
                </div>
                <div className="section-card-body">
                  <div style={{ marginBottom: 14, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Take 3–5 photos from different angles. Each photo is automatically verified against the claimed GPS coordinates.
                  </div>
                  <div className="photo-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                    {PHOTO_SLOTS.map((label, i) => (
                      <PhotoCaptureSlot key={i} index={i} label={label} onUpload={handlePhotoUpload} />
                    ))}
                  </div>
                  <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    ℹ️ Green border = GPS coordinates match within ±0.01°. Yellow warning = potential location mismatch.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => setStep(0)} id="back-step-1">Back</button>
                <button
                  className="btn btn-primary"
                  onClick={() => setStep(2)}
                  disabled={photos.length < 1}
                  id="next-step-2"
                >
                  Next: Receipt OCR →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Receipt OCR */}
          {step === 2 && (
            <div className="animate-slide-up">
              <div className="section-card mb-20">
                <div className="section-card-header">
                  <div className="section-card-title"><FileText size={16} /> Input Receipt — OCR Scan</div>
                  {receiptScanned && <span className="badge badge-success"><CheckCircle size={12} /> Scanned</span>}
                </div>
                <div className="section-card-body">
                  <div style={{ marginBottom: 16, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Ask the farmer to show a recent seed or fertilizer purchase receipt. Upload a photo to extract details via OCR.
                  </div>

                  <div style={{
                    border: '2px dashed var(--border-light)', borderRadius: 'var(--radius-lg)',
                    padding: 32, textAlign: 'center', marginBottom: 16,
                    background: receiptScanned ? 'var(--primary-dim)' : 'var(--bg-elevated)',
                    transition: 'all 0.3s',
                  }}>
                    {receiptScanned ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 40 }}>✅</span>
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Receipt scanned successfully</span>
                      </div>
                    ) : scanning ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid var(--border-light)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite' }} />
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Running OCR analysis…</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                        <FileText size={36} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Upload receipt image</span>
                        <button className="btn btn-primary" onClick={handleScanReceipt} id="scan-receipt-btn">
                          <Upload size={15} /> Simulate OCR Scan
                        </button>
                      </div>
                    )}
                  </div>

                  {receiptScanned && selectedFarmer?.receipt && (
                    <div className="ocr-result">
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--primary)', marginBottom: 6 }}>📄 Extracted Receipt Data</div>
                      <div className="ocr-row"><span className="ocr-key">Vendor</span><span className="ocr-val">{selectedFarmer.receipt.vendor}</span></div>
                      <div className="ocr-row"><span className="ocr-key">Items</span><span className="ocr-val">{selectedFarmer.receipt.items}</span></div>
                      <div className="ocr-row"><span className="ocr-key">Amount</span><span className="ocr-val">{selectedFarmer.receipt.total}</span></div>
                      <div className="ocr-row"><span className="ocr-key">Date</span><span className="ocr-val">{selectedFarmer.receipt.date}</span></div>
                      <div className="ocr-row"><span className="ocr-key">OCR Confidence</span><span className="ocr-val" style={{ color: 'var(--primary)' }}>94.2%</span></div>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => setStep(1)} id="back-step-2">Back</button>
                <button className="btn btn-primary" onClick={() => setStep(3)} id="next-step-3">
                  Next: Peer Vouching →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Peer Vouching */}
          {step === 3 && (
            <div className="animate-slide-up">
              <div className="section-card mb-20">
                <div className="section-card-header">
                  <div className="section-card-title"><Users size={16} /> Peer Vouching</div>
                  <span className="badge badge-info">{vouched.length} vouch{vouched.length !== 1 ? 'es' : ''}</span>
                </div>
                <div className="section-card-body">
                  <div style={{ marginBottom: 14, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Search for verified neighboring farmers who can vouch for this plot's location and cultivation status.
                  </div>
                  <input
                    className="form-input mb-12"
                    placeholder="Search verified farmers by name…"
                    value={vouchSearch}
                    onChange={e => setVouchSearch(e.target.value)}
                    id="vouch-search-input"
                  />

                  {vouchSearch && (
                    <div style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {searchResults.slice(0, 4).map(f => (
                        <div key={f.id} style={{
                          display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                          background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border)',
                        }}>
                          <div className="vouch-avatar">{f.name[0]}</div>
                          <div style={{ flex: 1 }}>
                            <div className="vouch-name">{f.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{f.village} · 🌱 {f.cropType}</div>
                          </div>
                          <button className="btn btn-primary btn-sm" onClick={() => handleVouch(f)} id={`vouch-${f.id}`}>
                            + Vouch
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Vouched Farmers</div>
                    {vouched.length === 0 ? (
                      <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center' }}>
                        No vouches yet. Search and add verified farmers above.
                      </div>
                    ) : (
                      <div className="vouch-list">
                        {vouched.map(v => (
                          <div className="vouch-item" key={v.id}>
                            <div className="vouch-avatar">{v.name[0]}</div>
                            <div style={{ flex: 1 }}>
                              <div className="vouch-name">{v.name}</div>
                              <div className="vouch-status">✓ Verified farmer · {v.village}</div>
                            </div>
                            <button
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                              onClick={() => setVouched(prev => prev.filter(x => x.id !== v.id))}
                            >
                              <X size={15} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => setStep(2)} id="back-step-3">Back</button>
                <button className="btn btn-primary" onClick={handleCalculateScore} id="calculate-score-btn" disabled={calculating}>
                  {calculating ? (
                    <>
                      <div style={{ width: 15, height: 15, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.8s linear infinite' }} />
                      Running AI Analysis…
                    </>
                  ) : (
                    <><Zap size={15} /> Calculate Health Score</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Score Result */}
          {step === 4 && aiScore !== null && (
            <div className="animate-slide-up">
              <div className="section-card mb-20" style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', marginBottom: 16 }}>
                  AI Crop Health Score
                </div>
                <div style={{
                  fontSize: '6rem', fontFamily: 'var(--font-display)', fontWeight: 800, lineHeight: 1,
                  color: aiScore >= 75 ? 'var(--primary)' : aiScore >= 50 ? 'var(--accent)' : 'var(--danger)',
                  animation: 'countUp 0.6s cubic-bezier(0.4,0,0.2,1)',
                }}>
                  {aiScore}
                </div>
                <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginTop: 4 }}>/ 100</div>

                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
                  <span style={{
                    padding: '8px 24px', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '1rem',
                    background: aiScore >= 75 ? 'var(--primary-dim)' : aiScore >= 50 ? 'var(--accent-dim)' : 'var(--danger-dim)',
                    color: aiScore >= 75 ? 'var(--primary)' : aiScore >= 50 ? 'var(--accent)' : 'var(--danger)',
                  }}>
                    {aiScore >= 75 ? '🟢 Excellent — Recommended for Approval' : aiScore >= 50 ? '🟡 Moderate — Review Required' : '🔴 Poor — High Risk'}
                  </span>
                </div>

                <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
                  {[
                    { label: 'Photos', value: `${photos.length}/5` },
                    { label: 'GPS Matches', value: `${photos.filter(p => p.match).length}/${photos.length}` },
                    { label: 'Receipt', value: receiptScanned ? 'Verified' : 'Missing' },
                    { label: 'Peer Vouches', value: vouched.length },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{s.value}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 28, display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button className="btn btn-outline" onClick={() => { setStep(0); setPhotos([]); setReceiptScanned(false); setVouched([]); setAiScore(null); }} id="new-verification-btn">
                    <RefreshCw size={15} /> New Verification
                  </button>
                  <button className="btn btn-primary" id="submit-to-lender-btn">
                    <CheckCircle size={15} /> Submit to Lender
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

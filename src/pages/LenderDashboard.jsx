import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopNav from '../components/layout/TopNav';
import { HealthGauge, ScoreBar } from '../components/charts/HealthGauge';
import PlotMap from '../components/map/PlotMap';
import { farmers, dashboardStats } from '../data/mockData';
import {
  TrendingUp, Users, CheckCircle, XCircle, Clock, DollarSign,
  Eye, MapPin, X, FileText, ShieldCheck, MessageSquare
} from 'lucide-react';

const STATUS = {
  approved: { label: 'Approved', class: 'badge-success' },
  pending:  { label: 'Pending',  class: 'badge-warning' },
  rejected: { label: 'Rejected', class: 'badge-danger' },
};

function scoreClass(s) {
  if (s >= 75) return 'score-high';
  if (s >= 50) return 'score-mid';
  return 'score-low';
}

function FarmerModal({ farmer, onClose }) {
  if (!farmer) return null;
  const { scoreBreakdown: sb } = farmer;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              {farmer.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              {farmer.village} · 🌱 {farmer.cropType} · {farmer.plotSize} acre
            </div>
          </div>
          <button className="btn btn-outline btn-icon btn-sm" onClick={onClose} id="modal-close-btn">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* Score + Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 28, alignItems: 'start', marginBottom: 24 }}>
            <HealthGauge score={farmer.healthScore} size={150} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                Score Breakdown
              </div>
              <div className="breakdown-bar-wrap">
                <ScoreBar label="Leaf Health" value={sb.leafHealth} />
                <ScoreBar label="Weed Density" value={sb.weedDensity} />
                <ScoreBar label="Pest Presence" value={100 - sb.pestPresence} color={sb.pestPresence < 70 ? '#ef4444' : '#22c55e'} />
                <ScoreBar label="Soil Estimate" value={sb.soilEstimate} />
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* Photos */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={15} /> Geo-Tagged Photos ({farmer.photos.length})
            </div>
            <div className="photo-grid">
              {farmer.photos.map(p => (
                <div key={p.id} className="photo-slot photo-slot-filled">
                  <div style={{ fontSize: 28 }}>🌾</div>
                  <div className="photo-slot-label">{p.label}</div>
                  <div className="photo-slot-status">
                    {p.match
                      ? <span style={{ fontSize: 14 }}>✅</span>
                      : <span style={{ fontSize: 14 }}>⚠️</span>
                    }
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {farmer.photos.map(p => (
                <div key={p.id} style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                  📍 {p.lat.toFixed(4)}, {p.lng.toFixed(4)} · 📱 {p.device}
                </div>
              ))}
            </div>
          </div>

          <div className="divider" />

          {/* Receipt + Vouches */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={15} /> Input Receipt (OCR)
              </div>
              {farmer.receipt ? (
                <div className="ocr-result">
                  <div className="ocr-row"><span className="ocr-key">Vendor</span><span className="ocr-val">{farmer.receipt.vendor}</span></div>
                  <div className="ocr-row"><span className="ocr-key">Items</span><span className="ocr-val" style={{ fontSize: '0.78rem', textAlign: 'right' }}>{farmer.receipt.items}</span></div>
                  <div className="ocr-row"><span className="ocr-key">Total</span><span className="ocr-val">{farmer.receipt.total}</span></div>
                  <div className="ocr-row"><span className="ocr-key">Date</span><span className="ocr-val">{farmer.receipt.date}</span></div>
                </div>
              ) : (
                <div style={{ padding: '14px', background: 'var(--danger-dim)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: '0.82rem' }}>
                  ⚠️ No receipt submitted
                </div>
              )}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <MessageSquare size={15} /> Peer Vouches ({farmer.vouches.length})
              </div>
              <div className="vouch-list">
                {farmer.vouches.length === 0 && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                    No peer vouches submitted
                  </div>
                )}
                {farmer.vouches.map(v => (
                  <div className="vouch-item" key={v}>
                    <div className="vouch-avatar">{v[0]}</div>
                    <div>
                      <div className="vouch-name">{v}</div>
                      <div className="vouch-status">✓ Verified farmer</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ marginRight: 'auto', fontSize: '0.82rem', color: 'var(--text-secondary)', alignSelf: 'center' }}>
              Agent: {farmer.agentName} · Loan: ₹{farmer.loanAmount?.toLocaleString('en-IN')}
            </div>
            {farmer.status === 'pending' && (
              <>
                <button className="btn btn-danger btn-sm" id={`reject-btn-${farmer.id}`}>
                  <XCircle size={14} /> Reject
                </button>
                <button className="btn btn-primary btn-sm" id={`approve-btn-${farmer.id}`}>
                  <CheckCircle size={14} /> Approve Loan
                </button>
              </>
            )}
            {farmer.status === 'approved' && (
              <span className="badge badge-success" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                <CheckCircle size={13} /> Loan Approved
              </span>
            )}
            {farmer.status === 'rejected' && (
              <span className="badge badge-danger" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                <XCircle size={13} /> Application Rejected
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const STAT_CARDS = [
  { label: 'Total Applications', value: dashboardStats.totalApplications, icon: <Users size={20} />, color: '#3b82f6' },
  { label: 'Pending Review',     value: dashboardStats.pendingReview,     icon: <Clock size={20} />,  color: '#f59e0b' },
  { label: 'Approved Loans',     value: dashboardStats.approvedLoans,     icon: <CheckCircle size={20} />, color: '#22c55e' },
  { label: 'Avg Health Score',   value: dashboardStats.avgHealthScore,    icon: <TrendingUp size={20} />, color: '#a855f7' },
  { label: 'Total Disbursed',    value: dashboardStats.totalDisbursed,    icon: <DollarSign size={20} />, color: '#22c55e' },
  { label: 'Rejected',           value: dashboardStats.rejectedApplications, icon: <XCircle size={20} />, color: '#ef4444' },
];

export default function LenderDashboard() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = farmers.filter(f => {
    const matchStatus = filter === 'all' || f.status === filter;
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
                        f.village.toLowerCase().includes(search.toLowerCase()) ||
                        f.cropType.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopNav
          title="Lender Dashboard"
          subtitle="Credit verification & loan management"
          actions={
            <button className="btn btn-primary btn-sm" id="export-report-btn">
              <FileText size={15} /> Export Report
            </button>
          }
        />
        <div className="page-body">

          {/* STAT CARDS */}
          <div className="stat-grid">
            {STAT_CARDS.map(s => (
              <div
                key={s.label}
                className="stat-card"
                style={{ '--stat-accent': s.color, '--stat-accent-dim': `${s.color}18` }}
              >
                <div className="stat-icon-wrap">
                  {s.icon}
                </div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* MAP + TABLE */}
          <div className="two-col" style={{ gridTemplateColumns: '1.2fr 0.8fr' }}>
            <div>
              <div className="section-card">
                <div className="section-card-header">
                  <div className="section-card-title">
                    <MapPin size={16} /> Plot Map
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click a marker for details</div>
                </div>
                <div style={{ padding: 0 }}>
                  <PlotMap farmers={farmers} onSelect={setSelected} height={380} />
                </div>
              </div>

              {/* Map legend */}
              <div style={{ display: 'flex', gap: 16, marginTop: 8, paddingLeft: 4, flexWrap: 'wrap' }}>
                {[['#22c55e', 'Score ≥ 75 (Excellent)'], ['#f59e0b', 'Score 50–74 (Moderate)'], ['#ef4444', 'Score < 50 (Poor)']].map(([c, l]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                    {l}
                  </div>
                ))}
              </div>
            </div>

            {/* Pending sidebar */}
            <div className="section-card" style={{ overflow: 'hidden' }}>
              <div className="section-card-header">
                <div className="section-card-title">
                  <Clock size={16} /> Pending Review
                </div>
                <span className="badge badge-warning">{farmers.filter(f => f.status === 'pending').length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {farmers.filter(f => f.status === 'pending').map(f => (
                  <div
                    key={f.id}
                    onClick={() => setSelected(f)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                      borderBottom: '1px solid var(--border)', cursor: 'pointer',
                      transition: 'background var(--transition)',
                    }}
                    id={`pending-row-${f.id}`}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div className="topnav-avatar" style={{ width: 36, height: 36, flexShrink: 0, fontSize: '0.85rem' }}>
                      {f.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>🌱 {f.cropType} · {f.village.split(',')[0]}</div>
                    </div>
                    <div className={`score-chip ${scoreClass(f.healthScore)}`} style={{ fontSize: '0.8rem', padding: '2px 9px' }}>
                      {f.healthScore}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* APPLICATION TABLE */}
          <div className="section-card" style={{ marginTop: 20 }}>
            <div className="section-card-header">
              <div className="section-card-title">
                <Users size={16} /> All Applications
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  className="form-input"
                  placeholder="Search farmer, village, crop…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ width: 220, padding: '6px 12px', fontSize: '0.82rem' }}
                  id="farmer-search-input"
                />
                <select
                  className="form-input form-select"
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  style={{ width: 130, padding: '6px 36px 6px 12px', fontSize: '0.82rem' }}
                  id="status-filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div className="table-wrap" style={{ borderRadius: 0, border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Farmer</th>
                    <th>Location</th>
                    <th>Crop</th>
                    <th>Plot</th>
                    <th>Health Score</th>
                    <th>Loan Req.</th>
                    <th>Status</th>
                    <th>Agent</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(f => (
                    <tr key={f.id} onClick={() => setSelected(f)} id={`farmer-row-${f.id}`}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="topnav-avatar" style={{ width: 30, height: 30, fontSize: '0.72rem', flexShrink: 0 }}>
                            {f.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{f.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{f.id}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{f.village}</td>
                      <td><span className="badge badge-info">🌱 {f.cropType}</span></td>
                      <td style={{ color: 'var(--text-secondary)' }}>{f.plotSize} ac</td>
                      <td>
                        <span className={`score-chip ${scoreClass(f.healthScore)}`}>{f.healthScore}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>₹{f.loanAmount?.toLocaleString('en-IN')}</td>
                      <td>
                        <span className={`badge ${STATUS[f.status].class}`}>{STATUS[f.status].label}</span>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{f.agentName}</td>
                      <td onClick={e => e.stopPropagation()}>
                        <button className="btn btn-outline btn-sm" onClick={() => setSelected(f)} id={`view-btn-${f.id}`}>
                          <Eye size={13} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {selected && <FarmerModal farmer={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

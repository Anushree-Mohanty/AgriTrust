import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopNav from '../components/layout/TopNav';
import PlotMap from '../components/map/PlotMap';
import { farmers, agents, regionData } from '../data/mockData';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Users, ShieldCheck, MapPin, Activity, Settings, ToggleLeft, ToggleRight } from 'lucide-react';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState('overview');
  const [agentStatuses, setAgentStatuses] = useState(agents.map(() => true));

  const barData = {
    labels: regionData.labels,
    datasets: [
      {
        label: 'Applications',
        data: regionData.counts,
        backgroundColor: 'rgba(34,197,94,0.7)',
        borderRadius: 6,
      },
      {
        label: 'Avg Score',
        data: regionData.avgScores,
        backgroundColor: 'rgba(245,158,11,0.7)',
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: 'var(--text-secondary)', font: { size: 12 } } } },
    scales: {
      x: { ticks: { color: 'var(--text-muted)' }, grid: { color: 'rgba(255,255,255,0.04)' } },
      y: { ticks: { color: 'var(--text-muted)' }, grid: { color: 'rgba(255,255,255,0.04)' } },
    },
  };

  const sections = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'agents', label: '🕵️ Agents' },
    { key: 'map', label: '🗺️ Region Map' },
    { key: 'settings', label: '⚙️ Settings' },
  ];

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopNav title="Admin Panel" subtitle="Platform management & analytics" />
        <div className="page-body">

          {/* Section Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
            {sections.map(s => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                id={`admin-tab-${s.key}`}
                style={{
                  padding: '10px 18px', fontSize: '0.875rem', fontWeight: 600,
                  border: 'none', background: 'none', cursor: 'pointer',
                  color: activeSection === s.key ? 'var(--primary)' : 'var(--text-muted)',
                  borderBottom: activeSection === s.key ? '2px solid var(--primary)' : '2px solid transparent',
                  transition: 'all var(--transition)',
                  fontFamily: 'inherit', marginBottom: -1,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* OVERVIEW */}
          {activeSection === 'overview' && (
            <div className="animate-slide-up">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
                {[
                  { icon: '👨‍🌾', label: 'Total Farmers', value: '47', color: 'var(--primary)' },
                  { icon: '🕵️', label: 'Field Agents', value: '5', color: 'var(--info)' },
                  { icon: '🏦', label: 'Active Lenders', value: '3', color: 'var(--accent)' },
                  { icon: '📸', label: 'Photos Captured', value: '284', color: 'var(--primary)' },
                  { icon: '🧾', label: 'Receipts Scanned', value: '39', color: 'var(--accent)' },
                  { icon: '🤝', label: 'Peer Vouches', value: '61', color: 'var(--info)' },
                ].map(s => (
                  <div key={s.label} className="card card-hover" style={{ textAlign: 'center', padding: '20px 14px' }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="section-card">
                <div className="section-card-header">
                  <div className="section-card-title"><Activity size={16} /> Regional Analytics</div>
                </div>
                <div className="section-card-body">
                  <Bar data={barData} options={barOptions} height={90} />
                </div>
              </div>
            </div>
          )}

          {/* AGENTS */}
          {activeSection === 'agents' && (
            <div className="animate-slide-up">
              <div className="section-card">
                <div className="section-card-header">
                  <div className="section-card-title"><Users size={16} /> Field Agent Management</div>
                  <button className="btn btn-primary btn-sm" id="add-agent-btn">+ Add Agent</button>
                </div>
                <div className="table-wrap" style={{ borderRadius: 0, border: 'none' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Agent</th>
                        <th>Region</th>
                        <th>Verified</th>
                        <th>Pending</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agents.map((a, i) => (
                        <tr key={a.id} id={`agent-row-${a.id}`}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div className="topnav-avatar" style={{ width: 34, height: 34, fontSize: '0.78rem', flexShrink: 0 }}>
                                {a.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600 }}>{a.name}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{a.id}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{a.region}</td>
                          <td><span className="badge badge-success">✓ {a.verified}</span></td>
                          <td><span className="badge badge-warning">⏳ {a.pending}</span></td>
                          <td>
                            <span className={`badge ${agentStatuses[i] ? 'badge-success' : 'badge-muted'}`}>
                              {agentStatuses[i] ? '● Active' : '○ Inactive'}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => setAgentStatuses(prev => { const n=[...prev]; n[i]=!n[i]; return n; })}
                              id={`toggle-agent-${a.id}`}
                            >
                              {agentStatuses[i] ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                              {agentStatuses[i] ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MAP */}
          {activeSection === 'map' && (
            <div className="animate-slide-up">
              <div className="section-card">
                <div className="section-card-header">
                  <div className="section-card-title"><MapPin size={16} /> All Verified Plots</div>
                  <span className="badge badge-info">{farmers.length} plots</span>
                </div>
                <div style={{ padding: 0 }}>
                  <PlotMap farmers={farmers} height={520} />
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeSection === 'settings' && (
            <div className="animate-slide-up">
              <div className="section-card mb-20">
                <div className="section-card-header">
                  <div className="section-card-title"><Settings size={16} /> Model & Scoring Configuration</div>
                </div>
                <div className="section-card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {[
                      { label: 'Min Photos Required', id: 'min-photos', val: '3', type: 'number' },
                      { label: 'GPS Tolerance (degrees)', id: 'gps-tolerance', val: '0.01', type: 'number' },
                      { label: 'Min Health Score for Approval', id: 'min-score', val: '60', type: 'number' },
                      { label: 'Max Loan Per Score Point (₹)', id: 'max-loan', val: '250', type: 'number' },
                    ].map(f => (
                      <div className="form-group" key={f.id}>
                        <label className="form-label">{f.label}</label>
                        <input className="form-input" type={f.type} defaultValue={f.val} id={f.id} />
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 20 }}>
                    <div className="form-label" style={{ marginBottom: 10 }}>Score Component Weights</div>
                    {[
                      { label: 'Leaf Health', id: 'w-leaf', val: '30' },
                      { label: 'Weed Density', id: 'w-weed', val: '20' },
                      { label: 'Pest Presence', id: 'w-pest', val: '25' },
                      { label: 'Soil Estimate', id: 'w-soil', val: '15' },
                      { label: 'Peer Vouches', id: 'w-vouch', val: '10' },
                    ].map(w => (
                      <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
                        <span style={{ minWidth: 140, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{w.label}</span>
                        <input type="range" min={0} max={50} defaultValue={w.val} style={{ flex: 1, accentColor: 'var(--primary)' }} id={w.id} />
                        <span style={{ minWidth: 40, textAlign: 'right', fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>{w.val}%</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button className="btn btn-outline" id="reset-settings-btn">Reset Defaults</button>
                    <button className="btn btn-primary" id="save-settings-btn">Save Settings</button>
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

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Leaf, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const ROLES = [
  { key: 'farmer', icon: '👨‍🌾', label: 'Farmer', path: '/farmer' },
  { key: 'agent', icon: '🕵️', label: 'Field Agent', path: '/agent' },
  { key: 'lender', icon: '🏦', label: 'Lender', path: '/dashboard' },
  { key: 'admin', icon: '⚙️', label: 'Admin', path: '/admin' },
];

const DEMO_USERS = {
  farmer: { email: 'rajan@agritrust.in', password: 'farmer123' },
  agent:  { email: 'dinesh@agritrust.in', password: 'agent123' },
  lender: { email: 'officer@nabard.in', password: 'lender123' },
  admin:  { email: 'admin@agritrust.in', password: 'admin123' },
};

export default function Login() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [role, setRole] = useState('lender');
  const [email, setEmail] = useState(DEMO_USERS['lender'].email);
  const [password, setPassword] = useState(DEMO_USERS['lender'].password);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (r) => {
    setRole(r);
    setEmail(DEMO_USERS[r].email);
    setPassword(DEMO_USERS[r].password);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    const target = ROLES.find(r => r.key === role);
    setTimeout(() => {
      setLoading(false);
      navigate(target?.path || '/dashboard');
    }, 1200);
  };

  return (
    <div className="login-page">
      <div className="login-bg" />

      <button
        className="btn btn-outline btn-sm"
        onClick={() => navigate('/')}
        id="login-back-btn"
        style={{ position: 'fixed', top: 20, left: 24, zIndex: 10 }}
      >
        <ArrowLeft size={15} /> Home
      </button>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        id="login-theme-toggle"
        style={{ position: 'fixed', top: 20, right: 24, zIndex: 10 }}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="login-card">
        <div className="login-logo">
          <div className="sidebar-logo-icon">🌾</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--primary)', fontSize: '1rem' }}>AgriTrust</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ground-Truth Platform</div>
          </div>
        </div>

        <h1 className="login-title">Welcome back</h1>
        <p className="login-sub">Select your role and sign in to continue</p>

        <div className="role-selector" id="role-selector">
          {ROLES.map(r => (
            <button
              key={r.key}
              className={`role-btn${role === r.key ? ' selected' : ''}`}
              onClick={() => handleRoleSelect(r.key)}
              id={`role-btn-${r.key}`}
            >
              <span style={{ fontSize: 22 }}>{r.icon}</span>
              {r.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Email / Phone</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              id="login-email"
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                id="login-password"
                style={{ paddingRight: 42 }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                id="password-toggle"
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer',
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ padding: '10px 14px', background: 'var(--primary-dim)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--primary)', border: '1px solid rgba(34,197,94,0.2)' }}>
            🎓 Demo credentials pre-filled for <strong>{role}</strong> role
          </div>

          <button
            className="btn btn-primary w-full"
            type="submit"
            id="login-submit-btn"
            disabled={loading}
            style={{ padding: '12px', fontSize: '0.95rem', justifyContent: 'center', marginTop: 4 }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                Signing in…
              </span>
            ) : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

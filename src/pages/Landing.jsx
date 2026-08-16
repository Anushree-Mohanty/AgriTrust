// AgriTrust Landing Page — trimmed + mobile responsive
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, ArrowRight, Check, Menu, X } from 'lucide-react';

const features = [
  {
    icon: '📍',
    title: 'Geo-Fenced Capture',
    desc: 'GPS-tagged photos with EXIF metadata verification — every photo is tied to an exact coordinate, preventing spoofing.',
  },
  {
    icon: '🔬',
    title: 'AI Crop Analysis',
    desc: 'On-device vision scores leaf health, weed density, and pest presence to compute a ground-truth Crop Health Index.',
  },
];

const roles = [
  { icon: '👨‍🌾', name: 'Farmer', desc: 'Upload geo-tagged crop photos, track your Crop Health Score, and monitor verification status.', path: '/farmer', color: '#2D6A4F' },
  { icon: '🏦', name: 'Lender', desc: 'Review AI-scored reports and approve micro-loans with confidence.', path: '/dashboard', color: '#C9873A' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', fontFamily: 'var(--font-body)' }}>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 64,
        background: 'var(--nav-bg)', borderBottom: '1px solid var(--nav-border)',
        display: 'flex', alignItems: 'center', padding: '0 24px',
        zIndex: 100, backdropFilter: 'blur(16px)',
        transition: 'background var(--transition-slow)',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🌾</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem', letterSpacing: '-0.01em' }}>AgriTrust</span>
        </div>
        <div className="nav-links-desktop" style={{ alignItems: 'center', gap: 12 }}>
          <button onClick={toggleTheme} id="nav-theme-toggle" style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/login')} id="nav-signin-btn" style={{ borderRadius: 'var(--radius-full)', padding: '7px 18px', fontSize: '0.85rem' }}>Sign In</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/farmer')} id="nav-farmer-btn" style={{ borderRadius: 'var(--radius-full)', padding: '8px 20px' }}>Farmer Portal →</button>
        </div>
        <div className="nav-hamburger" style={{ alignItems: 'center', gap: 10 }}>
          <button onClick={toggleTheme} style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button onClick={() => setMenuOpen(o => !o)} id="hamburger-btn" style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div style={{ position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99, background: 'var(--nav-bg)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button className="btn btn-outline" onClick={() => { navigate('/login'); setMenuOpen(false); }} style={{ width: '100%', justifyContent: 'center', borderRadius: 'var(--radius-full)' }}>Sign In</button>
          <button className="btn btn-primary" onClick={() => { navigate('/farmer'); setMenuOpen(false); }} style={{ width: '100%', justifyContent: 'center', borderRadius: 'var(--radius-full)' }}>Farmer Portal →</button>
        </div>
      )}

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 64, overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/farm-hero.png)', backgroundSize: 'cover', backgroundPosition: 'center 40%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(4,10,4,0.93) 0%, rgba(10,22,10,0.80) 42%, rgba(6,14,6,0.42) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to top, var(--bg-base) 0%, transparent 100%)' }} />

        <div className="landing-hero-grid" style={{ maxWidth: 1200, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1, padding: '60px 48px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 'var(--radius-full)', background: 'rgba(200,230,58,0.12)', border: '1px solid rgba(200,230,58,0.25)', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, marginBottom: 28, backdropFilter: 'blur(8px)' }}>
              🏆 SIH 2026 Project
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 5vw, 4.4rem)', fontWeight: 900, lineHeight: 1.06, color: '#FFFFFF', marginBottom: 24, letterSpacing: '-0.03em' }}>
              Trust the Land.<br />
              <span style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #E8F87A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 0 28px rgba(200,230,58,0.35))' }}>Fund the Farmer.</span>
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.70)', lineHeight: 1.78, marginBottom: 40, maxWidth: 460 }}>
              AgriTrust gives micro-lenders ground-truth crop verification through smartphone-based AI and GPS-tagged photos — no satellite data required.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
              <button className="btn btn-primary" onClick={() => navigate('/farmer')} id="hero-farmer-btn" style={{ borderRadius: 'var(--radius-full)', padding: '13px 30px', fontSize: '0.95rem', gap: 10 }}>
                Farmer Portal <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate('/dashboard')} id="hero-lender-btn"
                style={{ borderRadius: 'var(--radius-full)', padding: '13px 30px', fontSize: '0.95rem', fontWeight: 600, color: 'rgba(255,255,255,0.88)', border: '1px solid rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.07)', cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.22s ease' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; }}>
                Lender Dashboard
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {['No satellite API costs — runs on smartphone photos', 'Anti-spoofing GPS verification built-in'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(200,230,58,0.15)', border: '1px solid rgba(200,230,58,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={11} color="var(--primary)" strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.62)' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="landing-hero-right" style={{ position: 'relative' }}>
            <div style={{ background: 'rgba(8,13,8,0.80)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', borderRadius: 28, padding: 36, position: 'relative', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(200,230,58,0.15)' }}>
              <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(200,230,58,0.14) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                  <div>
                    <div style={{ color: 'rgba(200,230,58,0.55)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Crop Health Score</div>
                    <div style={{ color: 'var(--primary)', fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 900, lineHeight: 1, marginTop: 4, textShadow: '0 0 40px rgba(200,230,58,0.55)' }}>82</div>
                  </div>
                  <div style={{ textAlign: 'right', paddingTop: 4 }}>
                    <span style={{ background: 'rgba(200,230,58,0.14)', color: 'var(--primary)', padding: '5px 14px', borderRadius: 99, fontSize: '0.78rem', fontWeight: 700, border: '1px solid rgba(200,230,58,0.25)' }}>Excellent</span>
                    <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.72rem', marginTop: 8 }}>Rajan Patil · Cotton</div>
                  </div>
                </div>
                {[{ label: 'Leaf Health', val: 85 }, { label: 'Pest Presence', val: 80 }, { label: 'Weed Density', val: 78 }, { label: 'Soil Estimate', val: 84 }].map(b => (
                  <div key={b.label} style={{ marginBottom: 13 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.42)' }}>{b.label}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.80)' }}>{b.val}</span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
                      <div style={{ width: `${b.val}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), #E8F87A)', borderRadius: 99, boxShadow: '0 0 10px rgba(200,230,58,0.45)' }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {[{ emoji: '📍', label: '3 GPS Verified' }, { emoji: '📷', label: 'Photos OK' }, { emoji: '🔬', label: 'AI Scored' }].map(c => (
                    <div key={c.label} style={{ background: 'rgba(200,230,58,0.06)', border: '1px solid rgba(200,230,58,0.12)', borderRadius: 12, padding: '10px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 18, marginBottom: 4 }}>{c.emoji}</div>
                      <div style={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.48)', fontWeight: 600 }}>{c.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ position: 'absolute', top: -18, right: -18, background: 'rgba(8,13,8,0.92)', border: '1px solid rgba(200,230,58,0.20)', borderRadius: 16, padding: '10px 16px', boxShadow: '0 16px 48px rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', gap: 8, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 0 4px rgba(200,230,58,0.20), 0 0 14px rgba(200,230,58,0.55)' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFFFFF' }}>GPS Locked</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="landing-section-pad" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', padding: '80px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--primary)', marginBottom: 12 }}>Ground-Level Intelligence</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 14 }}>Verification without satellites</h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>Everything runs on the farmer's existing smartphone. No special hardware. No API costs.</p>
          </div>
          <div className="landing-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {features.map(f => (
              <div key={f.title} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '32px 28px', transition: 'all var(--transition)', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--primary-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 20 }}>{f.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: 10 }}>{f.title}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section className="landing-section-pad" style={{ padding: '80px 48px', background: 'var(--bg-base)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--primary)', marginBottom: 12 }}>Access Portal</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Choose your role</h2>
          </div>
          <div className="landing-roles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {roles.map(r => (
              <div key={r.name} onClick={() => navigate(r.path)} id={`role-${r.name.toLowerCase()}-btn`}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 22, padding: '40px 28px', textAlign: 'center', cursor: 'pointer', transition: 'all var(--transition)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = r.color; e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ width: 72, height: 72, borderRadius: 20, background: `${r.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34 }}>{r.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)' }}>{r.name}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{r.desc}</div>
                <div style={{ marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', fontWeight: 700, color: r.color }}>Enter Portal <ArrowRight size={14} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta-pad" style={{ padding: '80px 48px', background: 'linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 60%, #132E20) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>SIH 2026 · Smart India Hackathon</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: '-0.02em' }}>Ground-truth verification for<br />India's smallholder farmers</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.75, marginBottom: 36 }}>Every rupee of micro-credit deserves a verified crop behind it.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn" onClick={() => navigate('/farmer')} id="cta-farmer-btn" style={{ background: '#fff', color: '#132E20', borderRadius: 'var(--radius-full)', padding: '13px 32px', fontSize: '0.95rem', fontWeight: 700, gap: 8, display: 'inline-flex', alignItems: 'center', cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}>Farmer Portal <ArrowRight size={16} /></button>
            <button className="btn" onClick={() => navigate('/login')} id="cta-login-btn" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-full)', padding: '13px 32px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Sign In</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', padding: '28px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>🌾</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>AgriTrust</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>· Ground-Truth Agricultural Verification</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>SIH 2026 · Built with ❤️ for Indian Farmers</div>
      </footer>
    </div>
  );
}

import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard, Users, MapPin, Camera, ClipboardList,
  Settings, LogOut, ShieldCheck, Sun, Moon, Leaf, UserCheck
} from 'lucide-react';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
      { to: '/dashboard/map', icon: <MapPin size={18} />, label: 'Plot Map' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/agent', icon: <Camera size={18} />, label: 'Field Agent', badge: '3' },
      { to: '/farmer', icon: <Users size={18} />, label: 'Farmer Portal' },
      { to: '/admin', icon: <ShieldCheck size={18} />, label: 'Admin Panel' },
    ],
  },
];

export default function Sidebar({ role }) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🌾</div>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-name">AgriTrust</span>
          <span className="sidebar-logo-sub">Ground-Truth Platform</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navGroups.map(group => (
          <div key={group.label}>
            <div className="sidebar-section-label">{group.label}</div>
            {group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
              >
                {item.icon}
                {item.label}
                {item.badge && <span className="sidebar-badge">{item.badge}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-item w-full" onClick={toggleTheme} style={{ marginBottom: 4 }}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button className="sidebar-item w-full" onClick={() => navigate('/')}>
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

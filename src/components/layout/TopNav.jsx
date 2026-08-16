import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Bell } from 'lucide-react';

export default function TopNav({ title, subtitle, actions }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="topnav">
      <div>
        <div className="topnav-title">{title}</div>
        {subtitle && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 1 }}>{subtitle}</div>}
      </div>
      <div className="topnav-right">
        {actions}
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme" id="theme-toggle-btn">
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button className="theme-toggle" title="Notifications" id="notifications-btn">
          <Bell size={17} />
        </button>
        <div className="topnav-avatar" title="Profile" id="profile-avatar">AV</div>
      </div>
    </header>
  );
}

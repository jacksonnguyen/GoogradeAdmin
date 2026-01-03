import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileEdit, Settings as SettingsIcon, Network, LogOut } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        VN<span className="sidebar__logo-highlight">Math</span>
      </div>

      <nav className="sidebar__nav">
        <NavLink to="/" className={({ isActive }) => clsx('sidebar__link', isActive && 'sidebar__link--active')}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/editor" className={({ isActive }) => clsx('sidebar__link', isActive && 'sidebar__link--active')}>
          <FileEdit size={20} />
          <span>Create Lesson</span>
        </NavLink>
        <NavLink to="/concepts" className={({ isActive }) => clsx('sidebar__link', isActive && 'sidebar__link--active')}>
          <Network size={20} />
          <span>Knowledge Graph</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => clsx('sidebar__link', isActive && 'sidebar__link--active')}>
          <SettingsIcon size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar__footer">
        <button className="sidebar__logout">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

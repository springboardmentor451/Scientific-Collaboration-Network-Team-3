import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useShell } from './ShellContext';

export default function Sidebar() {
  const { user, role, logout } = useAuth();
  const { navOpen, setNavOpen } = useShell();
  const navigate = useNavigate();

  const getNavItems = (currentRole) => {
    switch (currentRole) {
      case 'Institution Admin':
        return [
          { label: 'Overview', path: '/dashboard/institution', icon: 'dashboard' },
          { label: 'Researchers', path: '/researchers', icon: 'group' },
          { label: 'Publications', path: '/publications', icon: 'description' },
          { label: 'Collaborations', path: '/collaborations', icon: 'hub' },
          { label: 'Conferences', path: '/conferences', icon: 'event' },
          { label: 'Reports', path: '/reports', icon: 'assessment' },
        ];
      case 'Reviewer':
        return [
          { label: 'Overview', path: '/dashboard/reviewer', icon: 'dashboard' },
          { label: 'Publications', path: '/publications', icon: 'description' },
          { label: 'Conferences', path: '/conferences', icon: 'event' },
        ];
      case 'System Admin':
        return [
          { label: 'Overview', path: '/dashboard/admin', icon: 'dashboard' },
          { label: 'User Management', path: '/admin/users', icon: 'manage_accounts' },
          { label: 'Audit Log', path: '/admin/audit-log', icon: 'history' },
          { label: 'Reports', path: '/reports', icon: 'assessment' },
        ];
      case 'Researcher':
      default:
        return [
          { label: 'Overview', path: '/dashboard/researcher', icon: 'dashboard' },
          { label: 'Publications', path: '/publications', icon: 'description' },
          { label: 'Collaborations', path: '/collaborations', icon: 'hub' },
          { label: 'Conferences', path: '/conferences', icon: 'event' },
          { label: 'Citations', path: '/citations', icon: 'format_quote' },
          { label: 'Reports', path: '/reports', icon: 'assessment' },
        ];
    }
  };

  const navItems = getNavItems(role);
  const closeNav = () => setNavOpen(false);

  return (
    <>
      {navOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-inverse-surface/40 z-40 lg:hidden"
          aria-label="Close navigation"
          onClick={closeNav}
        />
      )}
      <aside
        className={`bg-surface-container-lowest border-r border-outline-variant flex flex-col py-6 w-64 fixed left-0 top-0 h-screen z-50 text-on-surface transition-transform duration-200 ${
          navOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="px-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
            <span className="font-black text-primary tracking-tight text-xl">SCNA</span>
          </div>
          <button type="button" className="lg:hidden p-1 text-on-surface-variant" onClick={closeNav} aria-label="Close navigation">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-white overflow-hidden flex items-center justify-center font-bold">
              {user?.avatar ? (
                <img className="w-full h-full object-cover" src={user.avatar} alt="" />
              ) : (
                (user?.name || 'U').charAt(0)
              )}
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-sm text-primary truncate">{user?.name || 'User'}</h2>
              <p className="text-xs text-on-surface-variant truncate">{user?.role || role || 'Researcher'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 flex flex-col overflow-y-auto gap-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeNav}
              className={({ isActive }) =>
                isActive
                  ? 'bg-primary text-white rounded-xl flex items-center gap-3 px-4 py-3'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary rounded-xl flex items-center gap-3 px-4 py-3'
              }
            >
              {({ isActive }) => (
                <>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                    {item.icon}
                  </span>
                  <span className="font-label-sm">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-2 mt-auto pt-4 border-t border-outline-variant flex flex-col gap-1">
          <a href="https://support.scna.org" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:bg-surface-container-high rounded-xl flex items-center gap-3 px-4 py-3">
            <span className="material-symbols-outlined">help</span>
            <span className="font-label-sm">Help Center</span>
          </a>
          <button
            type="button"
            onClick={() => {
              logout();
              closeNav();
              navigate('/login');
            }}
            className="w-full text-on-surface-variant hover:bg-surface-container-high rounded-xl flex items-center gap-3 px-4 py-3"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-sm">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

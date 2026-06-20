import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LogOut,
  LayoutDashboard,
  Map as MapIcon,
  Settings,
  Route,
  Shield,
  Navigation,
} from 'lucide-react';
import { logout } from '../../features/auth/authSlice';
import { clearDestinations } from '../../features/destination-management/destinationSlice';

const AppNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearDestinations());
    navigate('/');
  };

  const navItems = getNavItems(user?.role);

  return (
    <nav className="app-navbar">
      <div className="app-navbar-inner">
        <div className="app-navbar-left">
          <Link to={getHomePath(user?.role)} className="app-navbar-brand">
            TOUR.P
          </Link>
          <div className="app-navbar-links">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                active={isActive(location.pathname, item.to)}
              />
            ))}
          </div>
        </div>

        <div className="app-navbar-right">
          <div className="app-navbar-user">
            <p className="app-navbar-user-name">{user?.email?.split('@')[0]}</p>
            <p className="app-navbar-user-role">{user?.role}</p>
          </div>
          <div className="app-navbar-avatar">
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <button type="button" onClick={handleLogout} className="app-navbar-logout" aria-label="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

function getHomePath(role) {
  if (role === 'admin' || role === 'super_admin') return '/admin/dashboard';
  if (role === 'tour_guide') return '/guide/dashboard';
  return '/dashboard';
}

function getNavItems(role) {
  if (role === 'admin' || role === 'super_admin') {
    return [
      { to: '/admin/dashboard', label: 'Admin Panel', icon: <Shield size={18} /> },
      { to: '/destinations', label: 'Destinations', icon: <MapIcon size={18} /> },
      { to: '/profile', label: 'Profile', icon: <Settings size={18} /> },
    ];
  }

  if (role === 'tour_guide') {
    return [
      { to: '/guide/dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
      { to: '/destinations', label: 'Destinations', icon: <MapIcon size={18} /> },
      { to: '/profile', label: 'Profile', icon: <Settings size={18} /> },
    ];
  }

  return [
    { to: '/dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { to: '/destinations', label: 'Explore', icon: <MapIcon size={18} /> },
    { to: '/plan-tour', label: 'Plan Tour', icon: <Route size={18} /> },
    { to: '/profile', label: 'Profile', icon: <Settings size={18} /> },
  ];
}

function isActive(pathname, to) {
  if (to === '/dashboard' || to === '/admin/dashboard' || to === '/guide/dashboard') {
    return pathname === to;
  }
  return pathname === to || pathname.startsWith(`${to}/`);
}

const NavLink = ({ to, icon, label, active }) => (
  <Link to={to} className={`app-nav-link ${active ? 'active' : ''}`}>
    {icon}
    <span>{label}</span>
  </Link>
);

export default AppNavbar;

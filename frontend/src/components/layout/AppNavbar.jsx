import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LogOut,
  LayoutDashboard,
  Map as MapIcon,
  Settings,
  Route,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../features/auth/authSlice';
import { clearDestinations } from '../../features/destination-management/destinationSlice';
import tpLogo from '../../assets/tplogo.png';

const AppNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearDestinations());
    navigate('/');
  };

  const navItems = getNavItems(user?.role);

  return (
    <nav className="app-navbar">
      <div className="app-navbar-inner">
        {/* Left: Brand + Nav Links */}
        <div className="app-navbar-left">
          <Link to={getHomePath(user?.role)} className="app-navbar-brand">
            <img src={tpLogo} alt="Tour Planner" className="app-navbar-logo" />
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

        {/* Right: User + Logout */}
        <div className="app-navbar-right desktop-only">
          <div className="app-navbar-user">
            <p className="app-navbar-user-name">{user?.email?.split('@')[0]}</p>
            <p className="app-navbar-user-role">{user?.role?.replace('_', ' ')}</p>
          </div>

          <div className="app-navbar-avatar">
            {user?.email?.[0]?.toUpperCase()}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="app-navbar-logout"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="mobile-only-flex">
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="app-mobile-dropdown"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="app-mobile-dropdown-inner">
              <div className="mobile-user-info">
                <div className="app-navbar-avatar">
                  {user?.email?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="app-navbar-user-name">{user?.email?.split('@')[0]}</p>
                  <p className="app-navbar-user-role">{user?.role?.replace('_', ' ')}</p>
                </div>
              </div>
              
              <div className="mobile-nav-links">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    active={isActive(location.pathname, item.to)}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                ))}
              </div>
              
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="mobile-logout-btn"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
      { to: '/admin/dashboard', label: 'Admin Panel', icon: <Shield size={16} /> },
      { to: '/destinations', label: 'Destinations', icon: <MapIcon size={16} /> },
      { to: '/profile', label: 'Profile', icon: <Settings size={16} /> },
    ];
  }

  if (role === 'tour_guide') {
    return [
      { to: '/guide/dashboard', label: 'Home', icon: <LayoutDashboard size={16} /> },
      { to: '/destinations', label: 'Destinations', icon: <MapIcon size={16} /> },
      { to: '/profile', label: 'Profile', icon: <Settings size={16} /> },
    ];
  }

  return [
    { to: '/dashboard', label: 'Home', icon: <LayoutDashboard size={16} /> },
    { to: '/destinations', label: 'Explore', icon: <MapIcon size={16} /> },
    { to: '/plan-tour', label: 'Plan Tour', icon: <Route size={16} /> },
    { to: '/profile', label: 'Profile', icon: <Settings size={16} /> },
  ];
}

function isActive(pathname, to) {
  if (to === '/dashboard' || to === '/admin/dashboard' || to === '/guide/dashboard') {
    return pathname === to;
  }
  return pathname === to || pathname.startsWith(`${to}/`);
}

const NavLink = ({ to, icon, label, active, onClick }) => (
  <Link to={to} className={`app-nav-link ${active ? 'active' : ''}`} onClick={onClick}>
    {icon}
    <span>{label}</span>
  </Link>
);

export default AppNavbar;

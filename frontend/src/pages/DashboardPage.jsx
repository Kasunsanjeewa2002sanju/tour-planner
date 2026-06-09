import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import Button from '../components/common/Button';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, LayoutDashboard, Map as MapIcon, Settings } from 'lucide-react';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#1e293b', padding: '2rem 1.5rem', borderRight: '1px solid #334155' }}>
        <h2 style={{ color: '#6366f1', marginBottom: '3rem', fontSize: '1.5rem' }}>Tour Planner</h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <SidebarItem icon={<MapIcon size={20} />} label="Tours" />
          <SidebarItem icon={<User size={20} />} label="Profile" to="/profile" />
          <SidebarItem icon={<Settings size={20} />} label="Settings" />
        </nav>
        
        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <button 
            onClick={handleLogout}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              color: '#94a3b8', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              fontSize: '1rem',
              padding: '0.75rem'
            }}
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome, {user?.email}</h1>
            <p style={{ color: '#94a3b8' }}>Here's what's happening with your tours today.</p>
          </div>
          <Link to="/profile">
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#6366f1', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              {user?.email?.[0].toUpperCase()}
            </div>
          </Link>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <StatCard title="Active Tours" value="3" trend="+1" />
          <StatCard title="Completed" value="12" trend="+3" />
          <StatCard title="Upcoming" value="5" />
        </section>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, to }) => (
  <Link 
    to={to || '#'} 
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.75rem', 
      padding: '0.75rem 1rem', 
      borderRadius: '0.5rem',
      backgroundColor: active ? '#334155' : 'transparent',
      color: active ? '#f8fafc' : '#94a3b8',
      textDecoration: 'none',
      transition: 'all 0.2s'
    }}
  >
    {icon} <span>{label}</span>
  </Link>
);

const StatCard = ({ title, value, trend }) => (
  <div style={{ padding: '2rem', backgroundColor: '#1e293b', borderRadius: '1rem', border: '1px solid #334155' }}>
    <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{title}</p>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
      <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{value}</h2>
      {trend && <span style={{ color: '#22c55e', fontWeight: '600' }}>{trend}</span>}
    </div>
  </div>
);

export default DashboardPage;

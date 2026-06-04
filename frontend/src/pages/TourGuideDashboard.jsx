import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, LayoutDashboard, Calendar, Navigation, Star } from 'lucide-react';

const TourGuideDashboard = () => {
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
        <h2 style={{ color: '#6366f1', marginBottom: '3rem', fontSize: '1.5rem' }}>Guide Panel</h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active />
          <SidebarItem icon={<Calendar size={20} />} label="My Schedule" />
          <SidebarItem icon={<Navigation size={20} />} label="Active Tours" />
          <SidebarItem icon={<User size={20} />} label="Profile" to="/profile" />
        </nav>
        
        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <button onClick={handleLogout} style={logoutButtonStyle}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem' }}>
        <header style={headerStyle}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Guide Dashboard</h1>
            <p style={{ color: '#94a3b8' }}>Welcome back, {user?.email}. Ready for your next tour?</p>
          </div>
          <div style={profileBadgeStyle}>
            {user?.email?.[0].toUpperCase()}
          </div>
        </header>

        <section style={statsGridStyle}>
          <StatCard title="Upcoming Tours" value="2" icon={<Calendar color="#6366f1" />} />
          <StatCard title="Total Rating" value="4.9" trend="Excellent" icon={<Star color="#fbbf24" />} />
          <StatCard title="Hours Guided" value="128" icon={<Navigation color="#10b981" />} />
        </section>

        <div style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#1e293b', borderRadius: '1rem', border: '1px solid #334155' }}>
          <h3>Today's Schedule</h3>
          <p style={{ color: '#94a3b8', marginTop: '1rem' }}>No tours scheduled for today. Take some rest!</p>
        </div>
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

const StatCard = ({ title, value, trend, icon }) => (
  <div style={{ padding: '2rem', backgroundColor: '#1e293b', borderRadius: '1rem', border: '1px solid #334155' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
       <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>{title}</p>
       {icon}
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
      <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{value}</h2>
      {trend && <span style={{ color: '#22c55e', fontWeight: '600', fontSize: '0.875rem' }}>{trend}</span>}
    </div>
  </div>
);

const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' };
const profileBadgeStyle = { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' };
const statsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' };
const logoutButtonStyle = { display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: '0.75rem' };

export default TourGuideDashboard;

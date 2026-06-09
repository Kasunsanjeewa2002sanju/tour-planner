import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, LayoutDashboard, Calendar, Navigation, Star, MapIcon, ChevronRight, Bell, Search, Settings } from 'lucide-react';
import { clearDestinations } from '../features/destination-management/destinationSlice';

const TourGuideDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearDestinations());
    navigate('/');
  };

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc' }}>
      {/* High-End Modern Sidebar */}
      <aside style={{ 
        width: '280px', 
        backgroundColor: '#0f172a', 
        borderRight: '1px solid #1e293b', 
        display: 'flex', 
        flexDirection: 'column',
        padding: '2rem 1.5rem',
        position: 'fixed',
        height: '100vh',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3.5rem', padding: '0 0.5rem' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Navigation size={24} color="white" />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>GUIDE.PANEL</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <SidebarLink icon={<LayoutDashboard size={20} />} label="Overview" active />
          <SidebarLink icon={<MapIcon size={20} />} label="Destinations" to="/destinations" />
          <SidebarLink icon={<Calendar size={20} />} label="My Schedule" />
          <SidebarLink icon={<Star size={20} />} label="Reviews" />
          <SidebarLink icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid #1e293b', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#064e3b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#34d399' }}>
                {user?.email?.[0].toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.email?.split('@')[0]}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Expert Tour Guide</p>
            </div>
          </div>
          <button onClick={handleLogout} style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            padding: '0.75rem 1rem', 
            color: '#94a3b8', 
            background: 'rgba(239, 68, 68, 0.05)', 
            border: '1px solid rgba(239, 68, 68, 0.1)', 
            borderRadius: '0.75rem',
            cursor: 'pointer'
          }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main style={{ flex: 1, marginLeft: '280px', padding: '0 3rem 3rem 3rem' }}>
        {/* Top Header */}
        <header style={{ 
          height: '100px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid #1e293b',
          marginBottom: '3rem',
          position: 'sticky',
          top: 0,
          backgroundColor: 'rgba(2, 6, 23, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 40
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#0f172a', padding: '0.75rem 1.5rem', borderRadius: '1rem', border: '1px solid #1e293b', width: '400px' }}>
            <Search size={18} color="#64748b" />
            <input 
              type="text" 
              placeholder="Search appointments, routes..." 
              style={{ background: 'none', border: 'none', color: 'white', flex: 1, outline: 'none', fontSize: '0.9rem' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
             <button style={iconButtonStyle}><Bell size={20} /></button>
             <button style={iconButtonStyle}><Settings size={20} /></button>
          </div>
        </header>

        {/* Dashboard Content */}
        <section style={{ marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Guide Dashboard</h1>
          <p style={{ color: '#64748b', fontSize: '1.2rem' }}>Welcome back, {user?.email}. Your explorers are waiting.</p>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          <StatCard title="Upcoming Tours" value="02" icon={<Calendar color="#6366f1" />} />
          <StatCard title="Total Rating" value="4.9" trend="Excellent" icon={<Star color="#fbbf24" />} />
          <StatCard title="Hours Guided" value="128" icon={<Navigation color="#10b981" />} />
        </section>

        <div style={{ marginTop: '3rem', padding: '3rem', backgroundColor: '#0f172a', borderRadius: '2.5rem', border: '1px solid #1e293b' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Today's Schedule</h3>
          <div style={{ padding: '2rem', border: '1px dashed #1e293b', borderRadius: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontSize: '1.1rem', margin: 0 }}>No tours scheduled for today. Take some rest and prepare for the next adventure!</p>
          </div>
        </div>
      </main>
    </div>
  );
};

const SidebarLink = ({ icon, label, active, to }) => (
  <Link 
    to={to || '#'} 
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.85rem', 
      padding: '0.85rem 1rem', 
      borderRadius: '0.75rem',
      backgroundColor: active ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
      color: active ? '#34d399' : '#94a3b8',
      textDecoration: 'none',
      fontWeight: 600,
      fontSize: '0.9rem',
      transition: 'all 0.2s',
      border: active ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid transparent'
    }}
  >
    {icon} <span>{label}</span>
    {active && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
  </Link>
);

const StatCard = ({ title, value, trend, icon }) => (
  <div style={{ padding: '2rem', backgroundColor: '#0f172a', borderRadius: '2rem', border: '1px solid #1e293b' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
       <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0, fontWeight: 500 }}>{title}</p>
       <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '10px' }}>{icon}</div>
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
      <h2 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800 }}>{value}</h2>
      {trend && <span style={{ color: '#10b981', fontWeight: '700', fontSize: '0.85rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '2rem' }}>{trend}</span>}
    </div>
  </div>
);

const iconButtonStyle = { 
  width: '48px', 
  height: '48px', 
  borderRadius: '14px', 
  backgroundColor: '#0f172a', 
  border: '1px solid #1e293b', 
  color: '#64748b', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  cursor: 'pointer',
  transition: 'all 0.2s'
};

export default TourGuideDashboard;

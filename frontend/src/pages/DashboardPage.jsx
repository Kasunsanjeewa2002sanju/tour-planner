import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, LayoutDashboard, Map as MapIcon, Settings, ChevronRight, Heart } from 'lucide-react';
import { fetchDestinations, toggleBookmark, clearDestinations } from '../features/destination-management/destinationSlice';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items: destinations, loading } = useSelector((state) => state.destinations);

  useEffect(() => {
    dispatch(fetchDestinations());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearDestinations());
    navigate('/');
  };

  const handleBookmark = (id) => {
    dispatch(toggleBookmark(id));
  };

  const recentDestinations = destinations.slice(0, 10);

  return (
    <div className="dashboard-root" style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white' }}>
      {/* Modern Top Navbar */}
      <nav className="top-navbar" style={{ 
        height: '80px', 
        backgroundColor: 'rgba(30, 41, 59, 0.8)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #334155',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 4rem',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <h2 style={{ color: '#6366f1', margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>TOUR.P</h2>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <NavLink icon={<LayoutDashboard size={18} />} label="Overview" active />
            <NavLink icon={<MapIcon size={18} />} label="Explore" to="/destinations" />
            <NavLink icon={<User size={18} />} label="Saved" to="/destinations" />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>{user?.email?.split('@')[0]}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>{user?.role}</p>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {user?.email?.[0].toUpperCase()}
          </div>
          <button onClick={handleLogout} className="logout-icon-btn" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '4rem' }}>
        <header style={{ marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Welcome back, <span style={{ color: '#6366f1' }}>Adventurer</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Ready to discover your next favorite spot?</p>
        </header>

        {/* Stats Grid */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
          <StatCard title="Active Tours" value="03" trend="+12%" />
          <StatCard title="Saved Paradise" value={destinations.filter(d => d.isBookmarked).length} trend="New" />
          <StatCard title="Places Explored" value="24" />
        </section>

        {/* Recent Destinations Grid */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Recently Added Paradises</h2>
            <Link to="/destinations" style={{ color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, textDecoration: 'none' }}>
              View More <ChevronRight size={18} />
            </Link>
          </div>

          {loading ? (
             <div style={{ textAlign: 'center', padding: '5rem' }}>Loading masterpieces...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {recentDestinations.map(dest => (
                <CompactDestinationCard key={dest._id} destination={dest} onBookmark={handleBookmark} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const NavLink = ({ icon, label, active, to }) => (
  <Link 
    to={to || '#'} 
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.5rem', 
      color: active ? '#6366f1' : '#94a3b8', 
      textDecoration: 'none', 
      fontWeight: 600,
      fontSize: '0.95rem',
      transition: 'color 0.2s'
    }}
  >
    {icon} <span>{label}</span>
  </Link>
);

const CompactDestinationCard = ({ destination, onBookmark }) => (
  <div className="compact-card" style={{ 
    backgroundColor: '#1e293b', 
    borderRadius: '1.5rem', 
    overflow: 'hidden', 
    border: '1px solid #334155',
    transition: 'transform 0.3s ease'
  }}>
    <div style={{ height: '200px', position: 'relative' }}>
      <img 
        src={destination.images[0] ? (destination.images[0].startsWith('http') ? destination.images[0] : `http://localhost:5000${destination.images[0]}`) : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'} 
        alt={destination.name} 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <button 
        onClick={() => onBookmark(destination._id)}
        style={{ 
          position: 'absolute', 
          top: '1rem', 
          right: '1rem', 
          background: 'rgba(15, 23, 42, 0.5)', 
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        <Heart size={18} fill={destination.isBookmarked ? "#ef4444" : "none"} color={destination.isBookmarked ? "#ef4444" : "white"} />
      </button>
    </div>
    <div style={{ padding: '1.25rem' }}>
      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 600 }}>{destination.name}</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#6366f1', fontSize: '0.85rem', fontWeight: 500 }}>
        <MapIcon size={14} /> <span>{destination.location}</span>
      </div>
    </div>
  </div>
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

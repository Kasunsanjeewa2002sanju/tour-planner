import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Map as MapIcon, ChevronRight, TrendingUp, Compass, Star, Heart } from 'lucide-react';
import { fetchDestinations, toggleBookmark } from '../features/destination-management/destinationSlice';
import InsightStatCards from '../components/dashboard/InsightStatCards';
import { useShuffledList } from '../hooks/useShuffledList';
import { motion } from 'framer-motion';

const SHUFFLE_INTERVAL_MS = 60000;

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { items: destinations, loading } = useSelector((state) => state.destinations);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDestinations());
  }, [dispatch]);

  const shuffledDestinations = useShuffledList(destinations, SHUFFLE_INTERVAL_MS);
  const displayDestinations = useMemo(() => shuffledDestinations.slice(0, 10), [shuffledDestinations]);

  const handleBookmark = (id) => dispatch(toggleBookmark(id));
  const userName = user?.email?.split('@')[0] || 'Adventurer';

  return (
    <main className="dashboard-main">

      {/* ===== Header ===== */}
      <header className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 4px 14px rgba(255,107,53,0.3)',
          }}>
            <Compass size={26} color="white" />
          </div>
          <div>
            <h1>
              Welcome back, <span className="dashboard-highlight">{userName}</span> 👋
            </h1>
            <p>Ready to discover your next favorite spot?</p>
          </div>
        </div>
      </header>

      {/* ===== Weather + Fuel Stacked Cards ===== */}
      <section style={{ marginBottom: '3rem' }}>
        <InsightStatCards />
      </section>

      {/* ===== Destinations Section ===== */}
      <section>
        <div className="dashboard-section-header">
          <h2>
            <TrendingUp size={22} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--primary)' }} />
            Discover Paradises
          </h2>
          <Link to="/destinations" className="dashboard-view-more">
            View More <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="dashboard-loading">
            <div className="spinner" style={{ margin: '0 auto 1rem' }} />
            <p>Loading masterpieces...</p>
          </div>
        ) : (
          <div className="dashboard-destinations-grid">
            {displayDestinations.map((dest, i) => (
              <motion.div
                key={dest._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <CompactDestinationCard destination={dest} onBookmark={handleBookmark} />
              </motion.div>
            ))}
            {displayDestinations.length === 0 && (
              <div style={{
                gridColumn: '1/-1', textAlign: 'center', padding: '4rem 2rem',
                background: 'var(--bg-card)', borderRadius: '1.25rem',
                border: '1.5px dashed var(--border)', color: 'var(--text-muted)'
              }}>
                <MapIcon size={40} style={{ marginBottom: '1rem', opacity: 0.4 }} />
                <p>No destinations yet. Add some to explore!</p>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

const CompactDestinationCard = ({ destination, onBookmark }) => (
  <div className="compact-card compact-card-styled">
    <div className="compact-card-image-wrap">
      <img
        src={
          destination.images[0]
            ? destination.images[0].startsWith('http')
              ? destination.images[0]
              : `http://localhost:5000${destination.images[0]}`
            : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&q=80'
        }
        alt={destination.name}
      />
      <button
        type="button"
        className="compact-card-bookmark"
        onClick={() => onBookmark(destination._id)}
        aria-label={destination.isBookmarked ? 'Unsave' : 'Save'}
      >
        <Heart
          size={15}
          fill={destination.isBookmarked ? '#ef4444' : 'none'}
          color={destination.isBookmarked ? '#ef4444' : '#6b7280'}
        />
      </button>
    </div>
    <div className="compact-card-body">
      <h3>{destination.name}</h3>
      <div className="compact-card-location">
        <MapIcon size={13} />
        <span>{destination.location}</span>
      </div>
      <div style={{ display: 'flex', gap: '2px', marginTop: '0.5rem' }}>
        {[1,2,3,4,5].map(s => (
          <Star key={s} size={11} fill={s <= 4 ? '#FFC107' : 'none'} color="#FFC107" />
        ))}
      </div>
    </div>
  </div>
);

export default DashboardPage;

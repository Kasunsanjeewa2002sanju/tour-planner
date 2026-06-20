import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Map as MapIcon, ChevronRight, Heart } from 'lucide-react';
import { fetchDestinations, toggleBookmark } from '../features/destination-management/destinationSlice';
import InsightStatCards from '../components/dashboard/InsightStatCards';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { items: destinations, loading } = useSelector((state) => state.destinations);

  useEffect(() => {
    dispatch(fetchDestinations());
  }, [dispatch]);

  const handleBookmark = (id) => {
    dispatch(toggleBookmark(id));
  };

  const recentDestinations = destinations.slice(0, 10);
  const savedCount = destinations.filter((d) => d.isBookmarked).length;

  return (
    <main className="dashboard-main">
      <header className="dashboard-header">
        <h1>
          Welcome back, <span className="dashboard-highlight">Adventurer</span>
        </h1>
        <p>Ready to discover your next favorite spot?</p>
      </header>

      <section className="dashboard-stats-row">
        <InsightStatCards />
        <div className="dashboard-stat-saved">
          <p>Saved Paradise</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
            <h2>{savedCount}</h2>
            {savedCount > 0 && <span>New</span>}
          </div>
        </div>
      </section>

      <section>
        <div className="dashboard-section-header">
          <h2>Recently Added Paradises</h2>
          <Link to="/destinations" className="dashboard-view-more">
            View More <ChevronRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="dashboard-loading">Loading masterpieces...</div>
        ) : (
          <div className="dashboard-destinations-grid">
            {recentDestinations.map((dest) => (
              <CompactDestinationCard key={dest._id} destination={dest} onBookmark={handleBookmark} />
            ))}
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
        src={destination.images[0]
          ? (destination.images[0].startsWith('http')
            ? destination.images[0]
            : `http://localhost:5000${destination.images[0]}`)
          : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
        alt={destination.name}
      />
      <button type="button" className="compact-card-bookmark" onClick={() => onBookmark(destination._id)}>
        <Heart
          size={18}
          fill={destination.isBookmarked ? '#ef4444' : 'none'}
          color={destination.isBookmarked ? '#ef4444' : 'white'}
        />
      </button>
    </div>
    <div className="compact-card-body">
      <h3>{destination.name}</h3>
      <div className="compact-card-location">
        <MapIcon size={14} />
        <span>{destination.location}</span>
      </div>
    </div>
  </div>
);

export default DashboardPage;

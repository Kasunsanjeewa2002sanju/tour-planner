import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Settings, ShieldCheck, Calendar, DollarSign, Search, Star, ChevronRight, Menu, X } from 'lucide-react';
import tpLogo from '../assets/tplogo.png';

const CATEGORIES = ['Beach', 'Mountain', 'Waterfall', 'Iceberg', 'Forest', 'City'];

const FEATURED_PLACES = [
  {
    id: 1,
    name: 'Siasconset Beach',
    location: 'Island',
    country: 'USA',
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80',
  },
  {
    id: 2,
    name: 'Horseshoe Bay',
    location: 'Malaysia',
    country: 'Malaysia',
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=500&q=80',
  },
  {
    id: 3,
    name: 'Virgin Gorda',
    location: 'Japan',
    country: 'Japan',
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=500&q=80',
  },
];

const STATS = [
  { value: '24+', label: 'Cities' },
  { value: '700+', label: 'Places' },
  { value: '200+', label: 'Award' },
  { value: '2k+', label: 'Happy' },
];

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&q=80',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&q=80',
  'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=300&q=80',
  'https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?w=300&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&q=80',
  'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=300&q=80',
];

const LandingPage = () => {
  const [activeCategory, setActiveCategory] = useState('Beach');
  const [searchForm, setSearchForm] = useState({ location: 'Bangladesh', date: '', price: '$400-$700' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="landing-page">

      {/* ===== NAVBAR ===== */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-brand">
            <img src={tpLogo} alt="Tour Planner Logo" className="landing-logo-img" />
          </div>

          {/* Desktop Nav */}
          <ul className="landing-nav-links desktop-nav">
            <li><a href="#home" className="landing-nav-item active">Home</a></li>
            <li><a href="#popular" className="landing-nav-item">Category</a></li>
            <li><a href="#gallery" className="landing-nav-item">Blog</a></li>
            <li><a href="#features" className="landing-nav-item">About Us</a></li>
          </ul>
          <Link to="/login" className="landing-login-btn desktop-nav">Login</Link>

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Dropdown Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="mobile-nav-dropdown"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <a href="#home" className="landing-nav-item" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
              <a href="#popular" className="landing-nav-item" onClick={() => setIsMobileMenuOpen(false)}>Category</a>
              <a href="#gallery" className="landing-nav-item" onClick={() => setIsMobileMenuOpen(false)}>Blog</a>
              <a href="#features" className="landing-nav-item" onClick={() => setIsMobileMenuOpen(false)}>About Us</a>
              <div style={{ height: '1px', background: '#eee', margin: '1rem 0' }} />
              <Link to="/login" className="landing-login-btn" style={{ textAlign: 'center', display: 'block' }} onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="hero-section" id="home">
        <div className="hero-inner">
          {/* Left */}
          <motion.div
            className="hero-left"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="hero-heading">
              Explore<br />
              Beautiful<br />
              <span className="hero-world">World</span>
              <span className="hero-sparkle">✦</span>
            </h1>

            {/* Search Box */}
            <div className="hero-search-box">
              <div className="hero-search-field">
                <label>Located In</label>
                <div className="hero-search-select">
                  <MapPin size={14} />
                  <select
                    value={searchForm.location}
                    onChange={e => setSearchForm({ ...searchForm, location: e.target.value })}
                  >
                    <option>Bangladesh</option>
                    <option>Sri Lanka</option>
                    <option>Maldives</option>
                    <option>Thailand</option>
                    <option>Japan</option>
                  </select>
                </div>
              </div>
              <div className="hero-search-divider" />
              <div className="hero-search-field">
                <label>Date</label>
                <div className="hero-search-select">
                  <Calendar size={14} />
                  <input
                    type="text"
                    placeholder="Wed 8 July"
                    value={searchForm.date}
                    onChange={e => setSearchForm({ ...searchForm, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="hero-search-divider" />
              <div className="hero-search-field">
                <label>Price Range</label>
                <div className="hero-search-select">
                  <DollarSign size={14} />
                  <input
                    type="text"
                    placeholder="$400 - $700"
                    value={searchForm.price}
                    onChange={e => setSearchForm({ ...searchForm, price: e.target.value })}
                  />
                </div>
              </div>
              <Link to="/register" className="hero-search-btn">
                <Search size={18} />
                Search
              </Link>
            </div>

          </motion.div>

          {/* Right — Hero Image Circle */}
          <motion.div
            className="hero-right"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="hero-circle-bg">
              <img
                src="/hero-traveler.png"
                alt="Happy traveler with backpack"
                className="hero-traveler-img"
              />
              {/* Floating cards */}
              <motion.div
                className="hero-float-card hero-float-card-1"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <MapPin size={14} color="#FF6B35" />
                <span>200+ Destinations</span>
              </motion.div>
              <motion.div
                className="hero-float-card hero-float-card-2"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <Star size={14} color="#FFC107" fill="#FFC107" />
                <span>Best Experience</span>
              </motion.div>
            </div>
            {/* Dashed flight path decoration */}
            <div className="hero-plane-path">
              <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 80 Q80 10 160 30" stroke="#FF6B35" strokeWidth="1.5" strokeDasharray="6 4" fill="none" />
              </svg>
              <span className="hero-plane-icon">✈</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== POPULAR PLACES ===== */}
      <section className="popular-section" id="popular">
        <div className="section-inner">
          <div className="popular-header">
            <h2 className="section-title">Popular Place</h2>
            <div className="category-pills">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
              <Link to="/register" className="view-all-link">View all <ChevronRight size={14} /></Link>
            </div>
          </div>

          <div className="places-grid">
            {FEATURED_PLACES.map((place, i) => (
              <motion.div
                key={place.id}
                className="place-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ y: -6 }}
              >
                <div className="place-card-image">
                  <img src={place.image} alt={place.name} />
                </div>
                <div className="place-card-body">
                  <h3 className="place-card-name">{place.name}</h3>
                  <div className="place-card-meta">
                    <span className="place-card-rating">
                      {[...Array(Math.floor(place.rating))].map((_, ri) => (
                        <Star key={ri} size={12} fill="#FFC107" color="#FFC107" />
                      ))}
                      <span>{place.rating}</span>
                    </span>
                    <span className="place-card-location">
                      <MapPin size={11} />
                      {place.location}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EXPLORE ALL CORNERS ===== */}
      <section className="explore-section">
        <div className="section-inner">
          <div className="explore-inner">
            <motion.div
              className="explore-left"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="explore-avatars">
                {[1,2,3,4].map(i => (
                  <div key={i} className="explore-avatar" style={{ background: ['#FF6B35','#00BCD4','#FFB347','#6366f1'][i-1] }}>
                    {['A','B','C','D'][i-1]}
                  </div>
                ))}
              </div>
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80"
                alt="Happy traveler"
                className="explore-person-img"
              />
            </motion.div>
            <motion.div
              className="explore-right"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <h2>Explore all corners of<br />The world with us</h2>
              <p>
                Plan your dream vacation with our intelligent route optimizer. We connect you with the most beautiful destinations, trusted guides, and seamless travel experiences.
              </p>
              <div className="stats-row">
                {STATS.map(s => (
                  <div key={s.label} className="stat-item">
                    <span className="stat-value">{s.value}</span>
                    <span className="stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section className="gallery-section" id="gallery">
        <div className="section-inner">
          <div className="gallery-header">
            <h2 className="section-title">Our Gallery</h2>
            <Link to="/register" className="view-all-link">View All <ChevronRight size={14} /></Link>
          </div>
          <div className="gallery-grid">
            {GALLERY_IMAGES.map((img, i) => (
              <motion.div
                key={i}
                className={`gallery-item ${i === 0 ? 'gallery-item-tall' : ''}`}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <img src={img} alt={`Gallery ${i + 1}`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features-section" id="features">
        <div className="section-inner">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            Why Choose Tour.P?
          </h2>
          <div className="features-grid">
            {[
              { icon: <MapPin color="#FF6B35" size={28} />, title: 'Route Optimization', desc: 'Intelligent algorithms to find the fastest and most scenic routes for your tour.' },
              { icon: <Navigation color="#00BCD4" size={28} />, title: 'Vehicle Tracking', desc: 'Manage your fleet or personal vehicles with detailed diagnostics and history.' },
              { icon: <Settings color="#FF6B35" size={28} />, title: 'Custom Preferences', desc: 'Save your start locations, distance units, and vehicle types for instant access.' },
              { icon: <ShieldCheck color="#00BCD4" size={28} />, title: 'Secure Access', desc: 'Professional-grade authentication and user data protection systems.' },
            ].map((f, i) => (
              <motion.div
                key={i}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <div className="feature-icon-wrap">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="landing-cta">
            <Link to="/register" className="cta-primary-btn">Get Started Free</Link>
            <Link to="/login" className="cta-secondary-btn">Login to Dashboard</Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="landing-footer">
        <div className="landing-brand">
          <img src={tpLogo} alt="Tour Planner" className="landing-logo-img" style={{ filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
        </div>
        <p>© 2024 Tour Planner. All rights reserved.</p>
      </footer>

      <style>{landingCSS}</style>
    </div>
  );
};

const landingCSS = `
  .landing-page {
    min-height: 100vh;
    background: #f8f9fa;
    font-family: 'Poppins', 'Inter', sans-serif;
  }

  /* NAV */
  .landing-nav {
    background: white;
    border-bottom: 1px solid #eee;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 1px 6px rgba(0,0,0,0.05);
  }
  .landing-nav-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .landing-brand {
    display: flex;
    align-items: center;
  }
  .landing-logo-img {
    height: 42px;
    width: auto;
    object-fit: contain;
    border-radius: 10px;
    display: block;
  }
  .landing-nav-links {
    display: flex;
    list-style: none;
    gap: 0.25rem;
  }
  .landing-nav-item {
    color: #6b7280;
    font-size: 0.88rem;
    font-weight: 500;
    text-decoration: none;
    padding: 0.45rem 0.875rem;
    border-radius: 0.5rem;
    transition: all 0.2s;
  }
  .landing-nav-item:hover, .landing-nav-item.active {
    color: #FF6B35;
    background: rgba(255,107,53,0.08);
  }
  .landing-login-btn {
    background: #FF6B35;
    color: white;
    padding: 0.55rem 1.5rem;
    border-radius: 2rem;
    font-weight: 700;
    font-size: 0.875rem;
    text-decoration: none;
    transition: all 0.25s;
    box-shadow: 0 4px 12px rgba(255,107,53,0.3);
  }
  .landing-login-btn:hover {
    background: #e55a24;
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(255,107,53,0.4);
    color: white;
  }

  /* HERO */
  .hero-section {
    background: linear-gradient(135deg, #fff8f5 0%, #fff 60%, #f0f9ff 100%);
    padding: 5rem 2rem 4rem;
    overflow: hidden;
  }
  .hero-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 4rem;
  }
  .hero-heading {
    font-size: 3.75rem;
    line-height: 1.1;
    font-weight: 800;
    color: #1a1a2e;
    margin-bottom: 2.5rem;
    letter-spacing: -0.03em;
  }
  .hero-world { color: #FF6B35; }
  .hero-sparkle {
    color: #1a1a2e;
    font-size: 2rem;
    vertical-align: super;
    margin-left: 0.25rem;
  }
  .hero-search-box {
    display: flex;
    align-items: stretch;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 8px 30px rgba(0,0,0,0.1);
    overflow: hidden;
    border: 1px solid #f0f0f0;
    max-width: 640px;
  }
  .hero-search-field {
    flex: 1;
    padding: 0.875rem 1rem;
    min-width: 0;
  }
  .hero-search-field label {
    display: block;
    font-size: 0.68rem;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.3rem;
  }
  .hero-search-select {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    color: #FF6B35;
  }
  .hero-search-select select,
  .hero-search-select input {
    border: none;
    background: none;
    outline: none;
    font-size: 0.85rem;
    font-weight: 600;
    color: #1a1a2e;
    font-family: inherit;
    padding: 0;
    width: 100%;
  }
  .hero-search-divider {
    width: 1px;
    background: #f0f0f0;
    margin: 0.75rem 0;
  }
  .hero-search-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #FF6B35;
    color: white;
    padding: 1rem 1.5rem;
    font-weight: 700;
    font-size: 0.9rem;
    text-decoration: none;
    white-space: nowrap;
    transition: background 0.25s;
    border-radius: 0 1rem 1rem 0;
  }
  .hero-search-btn:hover {
    background: #e55a24;
    color: white;
  }

  /* HERO RIGHT */
  .hero-right {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .hero-circle-bg {
    width: 420px;
    height: 420px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fff0ea 0%, #fde8d8 100%);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    overflow: hidden;
    position: relative;
    box-shadow: 0 20px 60px rgba(255,107,53,0.15);
  }
  .hero-traveler-img {
    width: 90%;
    height: 95%;
    object-fit: contain;
    object-position: bottom center;
  }
  .hero-float-card {
    position: absolute;
    background: white;
    padding: 0.6rem 1rem;
    border-radius: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.78rem;
    font-weight: 700;
    color: #1a1a2e;
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    white-space: nowrap;
  }
  .hero-float-card-1 { top: 60px; left: -30px; }
  .hero-float-card-2 { bottom: 80px; right: -20px; }
  .hero-plane-path {
    position: absolute;
    top: 20px;
    right: -20px;
    width: 200px;
    pointer-events: none;
  }
  .hero-plane-icon {
    position: absolute;
    top: -8px;
    right: 5px;
    font-size: 1.25rem;
    transform: rotate(-30deg);
  }

  /* SECTION STYLES */
  .section-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  .section-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: #1a1a2e;
    margin: 0;
  }

  /* POPULAR PLACES */
  .popular-section {
    padding: 5rem 0;
    background: white;
  }
  .popular-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2.5rem;
  }
  .category-pills {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .category-pill {
    border: 1.5px solid #e5e7eb;
    background: white;
    color: #6b7280;
    padding: 0.4rem 1rem;
    border-radius: 2rem;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
  }
  .category-pill:hover {
    border-color: #FF6B35;
    color: #FF6B35;
  }
  .category-pill.active {
    background: #FF6B35;
    border-color: #FF6B35;
    color: white;
  }
  .view-all-link {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    color: #FF6B35;
    font-weight: 700;
    font-size: 0.85rem;
    text-decoration: none;
    white-space: nowrap;
  }
  .view-all-link:hover { color: #e55a24; }

  /* PLACE CARDS */
  .places-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.75rem;
  }
  .place-card {
    background: white;
    border-radius: 1rem;
    overflow: hidden;
    border: 1px solid #f0f0f0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    transition: all 0.3s ease;
    cursor: pointer;
  }
  .place-card:hover {
    box-shadow: 0 12px 32px rgba(0,0,0,0.12);
    border-color: transparent;
  }
  .place-card-image {
    height: 190px;
    overflow: hidden;
  }
  .place-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  .place-card:hover .place-card-image img {
    transform: scale(1.07);
  }
  .place-card-body {
    padding: 1rem 1.125rem;
  }
  .place-card-name {
    font-size: 1rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 0.5rem;
  }
  .place-card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .place-card-rating {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #6b7280;
  }
  .place-card-location {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 0.78rem;
    color: #9ca3af;
    font-weight: 500;
  }

  /* EXPLORE SECTION */
  .explore-section {
    padding: 5rem 0;
    background: #f8f9fa;
  }
  .explore-inner {
    display: grid;
    grid-template-columns: 1fr 1.4fr;
    gap: 5rem;
    align-items: center;
  }
  .explore-left {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .explore-avatars {
    position: absolute;
    top: -20px;
    left: 0;
    display: flex;
    gap: -8px;
  }
  .explore-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 0.8rem;
    border: 2px solid white;
    margin-left: -8px;
  }
  .explore-person-img {
    width: 320px;
    height: 360px;
    object-fit: cover;
    border-radius: 1.5rem;
    box-shadow: 0 20px 50px rgba(0,0,0,0.12);
  }
  .explore-right h2 {
    font-size: 2rem;
    font-weight: 800;
    color: #1a1a2e;
    line-height: 1.25;
    margin-bottom: 1.25rem;
  }
  .explore-right p {
    color: #6b7280;
    line-height: 1.75;
    font-size: 0.95rem;
    margin-bottom: 2.5rem;
  }
  .stats-row {
    display: flex;
    gap: 2.5rem;
    flex-wrap: wrap;
  }
  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  .stat-value {
    font-size: 2rem;
    font-weight: 800;
    color: #FF6B35;
    line-height: 1;
  }
  .stat-label {
    font-size: 0.78rem;
    color: #9ca3af;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* GALLERY */
  .gallery-section {
    padding: 5rem 0;
    background: white;
  }
  .gallery-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
  }
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 160px);
    gap: 1rem;
  }
  .gallery-item {
    border-radius: 1rem;
    overflow: hidden;
    cursor: pointer;
  }
  .gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
  .gallery-item:hover img { transform: scale(1.06); }
  .gallery-item-tall {
    grid-row: span 2;
  }

  /* FEATURES */
  .features-section {
    padding: 5rem 0;
    background: #f8f9fa;
  }
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.75rem;
    margin-bottom: 3rem;
  }
  .feature-card {
    background: white;
    border-radius: 1.25rem;
    padding: 2rem;
    border: 1px solid #f0f0f0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
  }
  .feature-card:hover {
    box-shadow: 0 12px 30px rgba(0,0,0,0.1);
    border-color: transparent;
  }
  .feature-icon-wrap {
    width: 56px;
    height: 56px;
    background: #fff8f5;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.25rem;
  }
  .feature-card h3 {
    font-size: 1.05rem;
    font-weight: 700;
    margin-bottom: 0.6rem;
    color: #1a1a2e;
  }
  .feature-card p {
    color: #6b7280;
    font-size: 0.875rem;
    line-height: 1.65;
  }

  /* CTA */
  .landing-cta {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  .cta-primary-btn {
    background: #FF6B35;
    color: white;
    padding: 0.875rem 2.5rem;
    border-radius: 2rem;
    font-weight: 700;
    font-size: 1rem;
    text-decoration: none;
    box-shadow: 0 6px 20px rgba(255,107,53,0.35);
    transition: all 0.25s;
  }
  .cta-primary-btn:hover {
    background: #e55a24;
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(255,107,53,0.45);
    color: white;
  }
  .cta-secondary-btn {
    background: white;
    color: #FF6B35;
    padding: 0.875rem 2.5rem;
    border-radius: 2rem;
    font-weight: 700;
    font-size: 1rem;
    text-decoration: none;
    border: 2px solid #FF6B35;
    transition: all 0.25s;
  }
  .cta-secondary-btn:hover {
    background: #FF6B35;
    color: white;
    transform: translateY(-2px);
  }

  /* FOOTER */
  .landing-footer {
    background: #1a1a2e;
    color: #9ca3af;
    padding: 2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  .landing-footer p { font-size: 0.85rem; }

  /* MOBILE MENU STYLES */
  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    color: #1a1a2e;
    padding: 0.5rem;
  }
  .mobile-nav-dropdown {
    display: none;
  }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .desktop-nav { display: none !important; }
    .mobile-menu-btn { display: flex; }
    .mobile-nav-dropdown {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 68px;
      left: 0;
      right: 0;
      background: white;
      padding: 1.5rem 2rem;
      box-shadow: 0 10px 20px rgba(0,0,0,0.06);
      border-top: 1px solid #f0f0f0;
      gap: 0.5rem;
    }
    
    .hero-inner { grid-template-columns: 1fr; text-align: center; gap: 2rem; }
    .hero-search-box { flex-direction: column; max-width: 100%; margin: 0 auto; }
    .hero-search-divider { width: 100%; height: 1px; margin: 0; }
    .hero-search-btn { border-radius: 0 0 1rem 1rem; justify-content: center; }
    .hero-circle-bg { width: 300px; height: 300px; margin: 0 auto; }
    .places-grid { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
    .explore-inner { grid-template-columns: 1fr; gap: 2rem; }
    .explore-person-img { width: 100%; max-width: 320px; height: auto; aspect-ratio: 4/5; margin: 0 auto; }
    .explore-left { padding-top: 2rem; }
    .gallery-grid { grid-template-columns: repeat(2, 1fr); grid-template-rows: auto; }
    .gallery-item-tall { grid-row: span 1; height: 160px; }
    .hero-float-card { display: none; }
    .hero-plane-path { display: none; }
  }

  @media (max-width: 600px) {
    .hero-heading { font-size: 2.75rem; }
    .hero-circle-bg { width: 260px; height: 260px; }
    .section-inner { padding: 0 1.5rem; }
    .popular-header { flex-direction: column; align-items: flex-start; }
    .stats-row { gap: 1.5rem; justify-content: center; }
    .gallery-grid { grid-template-columns: 1fr; }
  }
`;

export default LandingPage;

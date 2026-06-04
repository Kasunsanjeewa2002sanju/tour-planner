import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Settings, ShieldCheck } from 'lucide-react';
import Button from '../components/common/Button';

const LandingPage = () => {
  return (
    <div className="landing-container" style={{ minHeight: '100vh', padding: '2rem' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', marginBottom: '4rem' }}>
        <h2 style={{ margin: 0, color: '#6366f1' }}>Tour Planner</h2>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/login" style={{ color: '#f8fafc', fontWeight: '500' }}>Login</Link>
          <Link to="/register" style={{ color: '#6366f1', fontWeight: '600' }}>Sign Up</Link>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, #f8fafc, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Smart Tour Planning <br /> for Modern Travelers
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
            Optimize your journeys with AI-driven route planning, real-time vehicle management, and secure user preferences. Your next adventure starts here.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '5rem' }}>
            <Link to="/register" style={{ width: '200px' }}>
              <Button>Get Started</Button>
            </Link>
            <Link to="/login" style={{ width: '200px' }}>
              <Button variant="outline">Learn More</Button>
            </Link>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'left' }}>
          <FeatureCard 
            icon={<MapPin color="#6366f1" />}
            title="Route Optimization"
            description="Intelligent algorithms to find the fastest and most scenic routes for your tour."
          />
          <FeatureCard 
            icon={<Navigation color="#6366f1" />}
            title="Vehicle Tracking"
            description="Manage your fleet or personal vehicles with detailed diagnostics and history."
          />
          <FeatureCard 
            icon={<Settings color="#6366f1" />}
            title="Custom Preferences"
            description="Save your start locations, distance units, and vehicle types for instant access."
          />
          <FeatureCard 
            icon={<ShieldCheck color="#6366f1" />}
            title="Secure Access"
            description="Professional-grade authentication and user data protection systems."
          />
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    style={{ padding: '2rem', background: '#1e293b', borderRadius: '1rem', border: '1px solid #334155' }}
  >
    <div style={{ marginBottom: '1rem' }}>{icon}</div>
    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{title}</h3>
    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{description}</p>
  </motion.div>
);

export default LandingPage;

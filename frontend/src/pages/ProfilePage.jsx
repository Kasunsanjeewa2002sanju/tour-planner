import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, fetchPreferences, updatePreferences } from '../features/users/userSlice';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { motion } from 'framer-motion';
import { User, Shield, MapPin, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, preferences, loading } = useSelector((state) => state.user);
  
  const [profileData, setProfileData] = useState({
    email: '',
    phone_number: '',
    current_address: '',
    country: ''
  });

  const [prefData, setPrefData] = useState({
    default_start_location: '',
    preferred_distance_unit: 'km',
    current_vehicle_type: 'car'
  });

  useEffect(() => {
    dispatch(fetchPreferences());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setProfileData({
        email: profile.email || '',
        phone_number: profile.phone_number || '',
        current_address: profile.current_address || '',
        country: profile.country || ''
      });
    }
  }, [profile]);

  useEffect(() => {
    if (preferences) {
      setPrefData({
        default_start_location: preferences.default_start_location || '',
        preferred_distance_unit: preferences.preferred_distance_unit || 'km',
        current_vehicle_type: preferences.current_vehicle_type || 'car'
      });
    }
  }, [preferences]);

  const onProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });
  const onPrefChange = (e) => setPrefData({ ...prefData, [e.target.name]: e.target.value });

  const onProfileSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(profileData));
  };

  const onPrefSubmit = (e) => {
    e.preventDefault();
    dispatch(updatePreferences(prefData));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/dashboard')}
        style={{ background: 'none', border: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '2rem' }}
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <h1 style={{ marginBottom: '3rem' }}>Account Settings</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
        {/* Profile Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card"
          style={{ maxWidth: '100%' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <User color="#6366f1" />
            <h2 style={{ margin: 0 }}>Personal Information</h2>
          </div>
          
          <form onSubmit={onProfileSubmit}>
            <Input label="Email" name="email" value={profileData.email} onChange={onProfileChange} />
            <Input label="Phone Number" name="phone_number" value={profileData.phone_number} onChange={onProfileChange} />
            <Input label="Address" name="current_address" value={profileData.current_address} onChange={onProfileChange} />
            <Input label="Country" name="country" value={profileData.country} onChange={onProfileChange} />
            <Button type="submit" loading={loading}>Save Profile</Button>
          </form>
        </motion.div>

        {/* Preferences */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card"
          style={{ maxWidth: '100%' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <Shield color="#6366f1" />
            <h2 style={{ margin: 0 }}>System Preferences</h2>
          </div>
          
          <form onSubmit={onPrefSubmit}>
            <Input label="Default Start Location" name="default_start_location" value={prefData.default_start_location} onChange={onPrefChange} />
            
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.875rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>Distance Unit</label>
              <select 
                name="preferred_distance_unit" 
                value={prefData.preferred_distance_unit} 
                onChange={onPrefChange}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#0f172a', color: '#f8fafc', border: '1px solid #334155' }}
              >
                <option value="km">Kilometers (km)</option>
                <option value="miles">Miles (mi)</option>
              </select>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ fontSize: '0.875rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>Vehicle Type</label>
              <select 
                name="current_vehicle_type" 
                value={prefData.current_vehicle_type} 
                onChange={onPrefChange}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#0f172a', color: '#f8fafc', border: '1px solid #334155' }}
              >
                <option value="car">Car</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="van">Van</option>
                <option value="truck">Truck</option>
              </select>
            </div>
            
            <Button type="submit" loading={loading} variant="secondary">Update Preferences</Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;

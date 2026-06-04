import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../features/auth/authSlice';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone_number: '',
    current_address: '',
    country: ''
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(register(formData));
    if (register.fulfilled.match(resultAction)) {
      navigate('/login');
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card"
        style={{ maxWidth: '500px' }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create Account</h2>
        
        <form onSubmit={onSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              required
            />
            <Input
              label="Phone"
              name="phone_number"
              value={formData.phone_number}
              onChange={onChange}
            />
          </div>
          
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            required
            placeholder="Min 6 characters"
          />
          
          <Input
            label="Current Address"
            name="current_address"
            value={formData.current_address}
            onChange={onChange}
          />
          
          <Input
            label="Country"
            name="country"
            value={formData.country}
            onChange={onChange}
          />
          
          {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}
          
          <Button type="submit" loading={loading} style={{ marginTop: '0.5rem' }}>
            Register Now
          </Button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;

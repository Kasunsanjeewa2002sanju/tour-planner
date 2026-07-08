import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../features/auth/authSlice';
import { motion } from 'framer-motion';
import { Mail, Lock, Phone, MapPin, Globe } from 'lucide-react';
import tpLogo from '../assets/tplogo.png';

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
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(register(formData));
    if (register.fulfilled.match(resultAction)) navigate('/login');
  };

  const inputWithIcon = (id, icon, label, inputProps) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#FF6B35', display: 'flex' }}>
          {icon}
        </span>
        <input
          id={id}
          className="form-input"
          style={{ paddingLeft: '2.75rem' }}
          {...inputProps}
        />
      </div>
    </div>
  );

  return (
    <div className="auth-container">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card"
        style={{ maxWidth: '520px' }}
      >
        {/* Brand */}
        <div className="auth-brand">
          <img src={tpLogo} alt="Tour Planner" className="auth-logo-img" />
        </div>

        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join thousands of travelers worldwide</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-grid-2">
            {inputWithIcon('reg-email', <Mail size={16} />, 'Email Address', {
              type: 'email', name: 'email', value: formData.email, onChange, placeholder: 'name@example.com', required: true,
            })}
            {inputWithIcon('reg-phone', <Phone size={16} />, 'Phone Number', {
              name: 'phone_number', value: formData.phone_number, onChange, placeholder: '+1 234 567 890',
            })}
          </div>

          {inputWithIcon('reg-password', <Lock size={16} />, 'Password', {
            type: 'password', name: 'password', value: formData.password, onChange, placeholder: 'Min 6 characters', required: true,
          })}

          {inputWithIcon('reg-address', <MapPin size={16} />, 'Current Address', {
            name: 'current_address', value: formData.current_address, onChange, placeholder: 'Your city & address',
          })}

          {inputWithIcon('reg-country', <Globe size={16} />, 'Country', {
            name: 'country', value: formData.country, onChange, placeholder: 'Your country',
          })}

          <button id="register-submit" type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <p className="auth-link-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;

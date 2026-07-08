import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../features/auth/authSlice';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import tpLogo from '../assets/tplogo.png';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user, authInitialized } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!authInitialized) return;
    if (isAuthenticated && user) {
      if (user.role === 'admin' || user.role === 'super_admin') navigate('/admin/dashboard');
      else if (user.role === 'tour_guide') navigate('/guide/dashboard');
      else navigate('/dashboard');
    }
    return () => { dispatch(clearError()); };
  }, [authInitialized, isAuthenticated, user, navigate, dispatch]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="auth-container">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card"
      >
        {/* Brand */}
        <div className="auth-brand">
          <img src={tpLogo} alt="Tour Planner" className="auth-logo-img" />
        </div>

        <h1 className="auth-title">Welcome Back!</h1>
        <p className="auth-subtitle">Sign in to continue your adventure</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={17}
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#FF6B35' }}
              />
              <input
                id="login-email"
                className="form-input"
                style={{ paddingLeft: '2.75rem' }}
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={17}
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#FF6B35' }}
              />
              <input
                id="login-password"
                className="form-input"
                style={{ paddingLeft: '2.75rem', paddingRight: '3rem' }}
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={onChange}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0,
                  display: 'flex', alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <button id="login-submit" type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In →'}
          </button>
        </form>

        <p className="auth-link-text">
          Don't have an account?{' '}
          <Link to="/register">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;

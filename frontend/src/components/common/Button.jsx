import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', loading = false, disabled = false }) => {
  const baseStyles = 'px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white',
  };

  // Vanilla CSS fallback if Tailwind isn't fully set up or for custom styles
  const customStyles = {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    fontWeight: '600',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    opacity: disabled ? 0.5 : 1,
    backgroundColor: variant === 'primary' ? '#6366f1' : variant === 'secondary' ? '#334155' : 'transparent',
    border: variant === 'outline' ? '2px solid #6366f1' : 'none',
    color: variant === 'outline' ? '#6366f1' : '#ffffff',
    width: '100%',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={customStyles}
      className={className}
    >
      {loading ? (
        <span className="loader"></span> 
      ) : children}
    </motion.button>
  );
};

export default Button;

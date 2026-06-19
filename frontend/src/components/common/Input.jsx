import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  showPasswordToggle = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password' && showPasswordToggle;
  const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type;
  const containerStyle = {
    marginBottom: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  };

  const labelStyle = {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#94a3b8',
  };

  const inputStyle = {
    padding: isPasswordField ? '0.75rem 2.75rem 0.75rem 1rem' : '0.75rem 1rem',
    borderRadius: '0.5rem',
    backgroundColor: '#0f172a',
    border: `1px solid ${error ? '#ef4444' : '#334155'}`,
    color: '#f8fafc',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box',
  };

  const toggleButtonStyle = {
    position: 'absolute',
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const errorStyle = {
    fontSize: '0.75rem',
    color: '#ef4444',
    marginTop: '0.25rem',
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}{required && ' *'}</label>}
      <div style={{ position: 'relative' }}>
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = '#6366f1'}
          onBlur={(e) => e.target.style.borderColor = error ? '#ef4444' : '#334155'}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            style={toggleButtonStyle}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
};

export default Input;

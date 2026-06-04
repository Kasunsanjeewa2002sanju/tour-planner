import React from 'react';

const Input = ({ label, type = 'text', name, value, onChange, placeholder, error, required = false }) => {
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
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    backgroundColor: '#0f172a',
    border: `1px solid ${error ? '#ef4444' : '#334155'}`,
    color: '#f8fafc',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const errorStyle = {
    fontSize: '0.75rem',
    color: '#ef4444',
    marginTop: '0.25rem',
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}{required && ' *'}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={inputStyle}
        onFocus={(e) => e.target.style.borderColor = '#6366f1'}
        onBlur={(e) => e.target.style.borderColor = error ? '#ef4444' : '#334155'}
      />
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
};

export default Input;

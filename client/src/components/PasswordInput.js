import React, { useState } from 'react';

const PasswordInput = ({ name, placeholder, value, onChange, error, className = '' }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`password-input-group ${className}`}>
      <div className="password-input-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`form-input ${error ? 'error' : ''}`}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default PasswordInput;
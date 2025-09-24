import React, { useState } from 'react';

const FloatingLabelInput = ({ 
  type = 'text', 
  name, 
  label, 
  value, 
  onChange, 
  error,
  className = '',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className={`floating-input-group ${className}`}>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`floating-input ${error ? 'error' : ''} ${hasValue || isFocused ? 'has-value' : ''}`}
        {...props}
      />
      <label 
        htmlFor={name}
        className={`floating-label ${hasValue || isFocused ? 'active' : ''}`}
      >
        {label}
      </label>
      {error && (
        <span className="error-message">
          {error}
        </span>
      )}
    </div>
  );
};

export default FloatingLabelInput;
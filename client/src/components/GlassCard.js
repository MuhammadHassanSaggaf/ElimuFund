import React from 'react';

const GlassCard = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  ...props 
}) => {
  const variants = {
    default: 'glass-card',
    primary: 'glass-card glass-card-primary',
    success: 'glass-card glass-card-success',
    warning: 'glass-card glass-card-warning'
  };

  return (
    <div 
      className={`${variants[variant]} ${hover ? 'glass-card-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
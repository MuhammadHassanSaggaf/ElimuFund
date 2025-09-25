import React from "react";

const ProgressBar = ({ percentage, className = "" }) => {
  const validPercentage = typeof percentage === 'number' && !isNaN(percentage) ? percentage : 0;
  const clampedPercentage = Math.min(100, Math.max(0, validPercentage));

  return (
    <div className={`progress-bar-container ${className}`}>
      <div 
        className="progress-bar-bg"
        style={{
          background: '#DEB887',
          border: '2px solid #8B4513',
          height: '12px',
          borderRadius: '20px',
          overflow: 'hidden'
        }}
      >
        <div
          className="progress-bar-fill"
          style={{ 
            width: `${clampedPercentage}%`,
            background: 'linear-gradient(135deg, #8B4513 0%, #654321 100%)',
            height: '100%',
            borderRadius: '20px',
            transition: 'width 1s ease',
            boxShadow: '0 0 8px rgba(139, 69, 19, 0.6)'
          }}
        />
      </div>
      <span 
        className="progress-text"
        style={{
          color: '#8B4513',
          fontWeight: '800',
          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}
      >
        {Math.round(clampedPercentage)}% funded
      </span>
    </div>
  );
};

export default ProgressBar;

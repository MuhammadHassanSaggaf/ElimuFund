import React from "react";

const ProgressBar = ({ percentage, className = "" }) => {
  const validPercentage = typeof percentage === 'number' && !isNaN(percentage) ? percentage : 0;
  const clampedPercentage = Math.min(100, Math.max(0, validPercentage));

  return (
    <div className={`progress-bar-container ${className}`}>
      <div className="progress-bar-bg">
        <div
          className="progress-bar-fill"
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
      <span className="progress-text">
        {Math.round(clampedPercentage)}% funded
      </span>
    </div>
  );
};

export default ProgressBar;

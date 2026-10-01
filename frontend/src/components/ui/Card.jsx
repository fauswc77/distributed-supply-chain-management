import React from 'react';

const Card = ({ children, className = '', title, headerAction }) => {
  return (
    <div className={`glass-card ${className}`}>
      {(title || headerAction) && (
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
          {title && <h3 className="text-xl font-semibold m-0">{title}</h3>}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;

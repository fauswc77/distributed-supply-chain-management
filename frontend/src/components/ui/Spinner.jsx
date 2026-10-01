import React from 'react';

const Spinner = ({ size = 40 }) => {
  return (
    <div className="flex justify-center items-center p-8">
      <div 
        className="spinner" 
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default Spinner;

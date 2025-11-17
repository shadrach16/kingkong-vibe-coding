import React from 'react';

const Button = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:hover:scale-100 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
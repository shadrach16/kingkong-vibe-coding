import React from 'react';

const Input = React.forwardRef(({ label, id, type = 'text', className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col mb-4">
      {label && (
        <label htmlFor={id} className="text-gray-300 text-sm font-medium mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        ref={ref}
        className={`bg-gray-700 text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 ${className}`}
        {...props}
      />
    </div>
  );
});

export default Input;
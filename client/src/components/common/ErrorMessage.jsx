import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-red-900 border border-red-700 text-red-300 p-4 rounded-lg shadow-md">
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856a2 2 0 001.789-3.047L13.789 2.153a2 2 0 00-3.578 0L3.343 15.953a2 2 0 001.789 3.047z"
          />
        </svg>
        <span className="font-semibold">{message}</span>
      </div>
    </div>
  );
};

export default ErrorMessage;
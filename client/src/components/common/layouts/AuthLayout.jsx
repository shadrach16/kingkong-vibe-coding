import React from 'react';
import Header from '../Header';
import Footer from '../Footer';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-6 sm:p-8 ">
        <div className="w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-8 sm:p-10 transform transition-all duration-300 md:my-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout;
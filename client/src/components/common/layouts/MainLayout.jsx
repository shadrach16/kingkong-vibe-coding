import React from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 p-4 md:p-4 overflow-y-auto">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
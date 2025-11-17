import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Notifications from './Notifications';
import { ChevronDown, Bell, LogOut, User, Settings, X, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { Transition } from '@headlessui/react';
import classNames from 'classnames';

const Header = ({ isSidebarOpen, setIsSidebarOpen=f=>f}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const renderUserAvatar = () => {
    if (!user || !user.email) {
      return (
        <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      );
    }
    const initial = user.email.charAt(0).toUpperCase();
    return (
      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600 border border-blue-200">
        {initial}
      </div>
    );
  };

  const getFullName = (email) => {
    if (!email) return 'User';
    const parts = email.split('@');
    if (parts[0]) {
      return parts[0].replace(/[^a-zA-Z]/g, ' ')
        .split(' ')
        .map(name => name.charAt(0).toUpperCase() + name.slice(1))
        .join(' ');
    }
    return 'User';
  };

  const navLinks = [
    { name: 'Documentation', path: '/docs' },
    { name: 'Pricing', path: '/pricing' },
  ];

  return (
    <header className={`bg-white/70 backdrop-blur-md border-b border-gray-200 text-gray-800 ${isSidebarOpen ? 'p-2 sm:p-3 ':'px-3'} sticky top-0 z-50 shadow-sm transition-all duration-300`}>
      <div className="flex justify-between items-center w-full">
        {/* Left Section: Logo and Sidebar Toggle */}
        <div className="flex items-center space-x-2">
        {user  &&  <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-200 transition-colors text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <Menu className="h-5 w-5" />
          </button>
        }
          
          {!isSidebarOpen && <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2 font-mono text-xl font-semibold">
            <svg className="my-0 py-0" width='60px' height='60px' viewBox="0 0 300 300" id="monkey3" version="1.1"  fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <circle cx="74" cy="82" r="32" 
        style={{fillRule:'evenodd',clipRule:'evenodd',fill:"#fffafa",stroke:'#2a2222',strokeWidth:8,
        strokeLinecap:'round',strokeLinejoin:'round',strokeMiterlimit:10}}></circle> <circle cx="234" cy="82" r="32" 
              style={{fillRule:'evenodd',clipRule:'evenodd',fill:"#fffafa",stroke:'#2a2222',strokeWidth:8,
        strokeLinecap:'round',strokeLinejoin:'round',strokeMiterlimit:10}}></circle> <circle cx="154" cy="138" r="88"     style={{fillRule:'evenodd',clipRule:'evenodd',fill:"#fffafa",stroke:'#2a2222',strokeWidth:8,
        strokeLinecap:'round',strokeLinejoin:'round',strokeMiterlimit:10}}></circle> <path d=" M154,117.996C146.702,108.283,135.085,102,122,102c-22.091,0-40,17.909-40,40s17.909,40,40,40c13.085,0,24.702-6.283,32-15.996 c7.298,9.713,18.915,15.996,32,15.996c22.091,0,40-17.909,40-40s-17.909-40-40-40C172.915,102,161.298,108.283,154,117.996z"     style={{fillRule:'evenodd',clipRule:'evenodd',fill:"#fffafa",stroke:'#2a2222',strokeWidth:8,
        strokeLinecap:'round',strokeLinejoin:'round',strokeMiterlimit:10}}></path> <path d=" M154,258c22.091,0,40-17.909,40-40s-17.909-64-40-64s-40,41.909-40,64S131.909,258,154,258z" 
              style={{fillRule:'evenodd',clipRule:'evenodd',fill:"#dedede",stroke:'#2a2222',strokeWidth:7.7333,
        strokeLinecap:'round',strokeLinejoin:'round',strokeMiterlimit:10}}></path> <path d=" M114,218c12.102,5.113,25.839,8,40.402,8c14.241,0,27.693-2.761,39.598-7.664" 
              style={{ fill:"none",stroke:'#2a2222',strokeWidth:8,
        strokeLinecap:'round',strokeLinejoin:'round',strokeMiterlimit:10}}></path> <circle cx="122" cy="134" r="8" 
          style={{fillRule:'evenodd',clipRule:'evenodd'}}></circle> <circle cx="190" cy="134" r="8"  style={{fillRule:'evenodd',clipRule:'evenodd'}}></circle> <path d=" M148.875,172.466c2.83-3.296,7.43-3.281,10.247,0l13.365,15.566c2.829,3.296,1.574,5.967-2.781,5.967h-31.415 c-4.365,0-5.597-2.687-2.781-5.967L148.875,172.466z" 
            style={{fillRule:'evenodd',clipRule:'evenodd',fill:"#595959",stroke:'#2a2222',strokeWidth:8,
        strokeLinecap:'round',strokeLinejoin:'round',strokeMiterlimit:10}}></path> </g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> </g>
      </svg>
            <span className="text-indigo-600">King</span>
            <span className="text-gray-900">Kong</span>
          </Link>}
        </div>

        {/* Center Section: Main Nav Links */}
        <nav className="flex items-center space-x-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Section: User Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {user ? (
            <>
              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 rounded-md hover:bg-gray-200 transition-colors relative text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Notifications"
                  aria-expanded={isNotificationsOpen}
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                <Transition
                  show={isNotificationsOpen}
                  as={React.Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-150"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <div
                    ref={notificationsRef}
                    className="absolute right-0 mt-3 w-80 origin-top-right bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
                  >
                    <Notifications />
                  </div>
                </Transition>
              </div>

              {/* User Menu Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-800 transition-colors duration-200 hover:text-indigo-600 focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={isUserMenuOpen}
                >
                  {renderUserAvatar()}
                  <span className="hidden md:block font-semibold text-sm text-gray-700">{user ? getFullName(user.email) : 'Loading...'}</span>
                  <ChevronDown className={classNames("w-4 h-4 text-gray-500 transition-transform duration-200", { 'rotate-180': isUserMenuOpen })} />
                </button>
                <Transition
                  show={isUserMenuOpen}
                  as={React.Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-150"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <div className="absolute right-0 mt-3 w-56 origin-top-right bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50">
                    <div className="py-1">
                      <Link to="/settings?profile=1" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <User className="mr-2 h-4 w-4 text-gray-500" />
                        Your Profile
                      </Link>
                      <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Settings className="mr-2 h-4 w-4 text-gray-500" />
                        Settings
                      </Link>
                      <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/auth/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors duration-200">Sign In</Link>
              <Link to="/auth/register" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1.5 px-4 rounded-md shadow-sm transition-colors duration-300">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
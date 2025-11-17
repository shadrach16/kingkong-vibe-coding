import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FlaskConical,
  Layers,
  FileText,
  CreditCard,
  Settings,
  Book,
  User,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Crown,
  Zap, // Importing the Zap icon for "Internal Functions"
} from 'lucide-react';

const navIcons = {
  Dashboard: <LayoutDashboard className="h-5 w-5" />,
  'Canvas': <Layers className="h-5 w-5" />,
  'API Playground': <FlaskConical className="h-5 w-5" />,
  Logs: <FileText className="h-5 w-5" />,
  Billing: <CreditCard className="h-5 w-5" />,
  Settings: <Settings className="h-5 w-5" />,
  Documentation: <Book className="h-5 w-5" />,
  Admin: <User className="h-5 w-5" />,
  "Internal Functions": <Zap className="h-5 w-5" />, // Adding the new icon
};

const navItems = [
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/canvas', name: 'Canvas' },
  { path: '/playground', name: 'API Playground' },
  { path: '/manage-function', name: 'Internal Functions' }, // Adding the new path and name
  { path: '/logs', name: 'Logs' },
  { path: '/billing', name: 'Billing' },
  { path: '/settings', name: 'Settings' },
  { path: '/docs', name: 'Documentation' },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  console.log('ff', user);
  const getNavLinks = () => {
    const links = [...navItems];
    if (user?.role === 'admin') {
      links.push({ path: '/admin', name: 'Admin' });
    }
    return links;
  };

  const navLinks = getNavLinks();

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col h-full bg-gray-50 border-r border-gray-200 transition-all duration-300 ease-in-out shadow-xl
          ${isOpen ? 'w-64' : 'w-20'}`}
      >
        {/* Top Section: App Title and Collapse Button */}
        <div
          className={`relative flex items-center ${!isOpen ? 'p-4':""} border-b border-gray-200 transition-colors duration-300 ease-in-out ${
            !isOpen && 'justify-center'
          }`}
        >
          {isOpen ? ( <>
             <svg className="my-0 py-0 ml-2" width='60px' height='60px' viewBox="0 0 300 300" id="monkey3" version="1.1"  fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <circle cx="74" cy="82" r="32" 
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
            <h1 className="flex items-center space-x-2 font-mono text-xl font-semibold">
              <span className="text-indigo-600">King</span>
            <span className="text-gray-900">Kong</span>
            </h1>

            </>
          ) : (
            <span className="text-xl font-bold text-gray-800">K</span>
          )}
        
        </div>

        {/* Main Navigation */}
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `group flex items-center rounded-md p-2 text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-200'
                }`
              }
              title={link.name}
            >
              <div className="flex-shrink-0">{navIcons[link.name]}</div>
              <span
                className={`ml-3 whitespace-nowrap transition-all duration-200 ${
                  isOpen ? 'opacity-100' : 'opacity-0 w-0'
                }`}
              >
                {link.name}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Call to Action Section */}
        {user?.user?.subscriptionPlan === 'free' && (
          <div className="p-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-4 rounded-xl text-center space-y-2 border border-indigo-100 transition-shadow duration-300 hover:shadow-lg">
              <div className={`flex items-center justify-center ${!isOpen ? 'flex-col' : ''}`}>
                <Crown className={`h-6 w-6 text-yellow-300 ${!isOpen ? 'mb-2' : 'mr-2'}`} />
                {isOpen && <p className="font-semibold text-lg">Go Pro</p>}
              </div>
              {isOpen && (
                <p className="text-sm font-light text-indigo-100">
                  Unlock unlimited API calls and advanced features.
                </p>
              )}
              <NavLink
                to="/pricing"
                className={`inline-block w-full py-2 rounded-lg text-sm font-bold text-indigo-600
                  bg-white transition-colors duration-200 hover:bg-gray-100
                  ${!isOpen && 'hidden'}`}
              >
                Upgrade Now
              </NavLink>
            </div>
          </div>
        )}

        {/* User and Logout Section */}
        <div className="mt-auto p-4 border-t border-gray-200">
         
          <button
            onClick={logout}
            className="group flex items-center w-full mt-4 rounded-md p-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors duration-200"
            title="Log out"
          >
            <div className="flex-shrink-0">
              <LogOut className="h-5 w-5" />
            </div>
            <span
              className={`ml-3 whitespace-nowrap transition-all duration-200 ${
                isOpen ? 'opacity-100' : 'opacity-0 w-0'
              }`}
            >
              Log out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
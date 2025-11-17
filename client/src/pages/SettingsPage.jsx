import React, { useState } from 'react';
import ApiKeyManagement from '../components/user/ApiKeyManagement';
import ProfileSettings from '../components/user/ProfileSettings';
import TeamManagement from '../components/user/TeamManagement';
import { Key, User, Users, Minimize, Square, X } from 'lucide-react';
import MainLayout from '../components/common/layouts/MainLayout';
 
const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
 
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'api-key':
        return <ApiKeyManagement />;
      case 'team':
        return <TeamManagement />;
      default:
        return null;
    }
  };
 
  const tabs = [
    { id: 'profile', name: 'Profile', icon: <User className="h-5 w-5" /> },
    { id: 'api-key', name: 'API Key', icon: <Key className="h-5 w-5" /> },
    { id: 'team', name: 'Team', icon: <Users className="h-5 w-5" /> },
  ];
 
  return (
    <MainLayout>
    <div className="flex flex-col mx-auto   bg-gray-100 rounded-md border border-gray-300 overflow-hidden font-sans">
      {/* Window Title Bar */}
      <div className="bg-gray-200 border-b border-gray-300 p-2 flex justify-between items-center cursor-move flex-shrink-0">
        <div className="flex space-x-1">
         
        </div>
        <span className="text-sm font-medium text-gray-700">Settings</span>
        <div className="flex space-x-1 opacity-0">
          <Minimize className="w-3 h-3 text-gray-500" />
          <Square className="w-3 h-3 text-gray-500" />
          <X className="w-3 h-3 text-gray-500" />
        </div>
      </div>
 
      {/* Tab Navigation Toolbar */}
      <nav className="bg-gray-200 p-2 flex border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200
              ${activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm border border-gray-300'
                : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </nav>
 
      {/* Main Content Area */}
      <main className="flex-1 bg-white p-6 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
    </MainLayout>
  );
};
 
export default SettingsPage;
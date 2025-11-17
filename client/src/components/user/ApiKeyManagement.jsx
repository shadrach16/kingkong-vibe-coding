import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Key, RotateCw, Eye, EyeOff, ClipboardCheck, Clipboard, Minimize, Square, X } from 'lucide-react';
 
const ApiKeyManagement = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [keyVisible, setKeyVisible] = useState(false);
  const [copied, setCopied] = useState(false);
 
  const handleRegenerateKey = async () => {
    if (window.confirm('Are you sure you want to generate a new API key? This will invalidate your old key.')) {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/api-key`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        });
 
        const data = await response.json();
        if (response.ok) {
          login(user.email, data.apiKey, data.token);
          alert('New API key generated successfully!');
        } else {
          alert(data.message || 'Failed to generate new key.');
        }
      } catch (error) {
        alert('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };
 
  const handleCopyKey = () => {
    navigator.clipboard.writeText(user.user.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
 
  return (
    <div className="flex flex-col  mx-auto my-12 bg-gray-100 rounded-xl border border-gray-300 overflow-hidden font-sans">
      
 
      {/* Main Content Panel */}
      <div className="flex-1 p-8 bg-white overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-gray-900">
            <div className="p-2 bg-indigo-50 rounded-md">
              <Key className="h-6 w-6 text-indigo-500" />
            </div>
            <h3 className="text-2xl font-bold">API Key Management</h3>
          </div>
          <p className="text-sm text-gray-600">
            Your API key is used to authenticate your requests. Keep it secure and do not share it with anyone.
          </p>
 
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-inner">
            <div className="flex-1 font-mono text-sm sm:text-lg text-gray-800 overflow-hidden overflow-ellipsis break-all">
              {keyVisible ? user?.user?.apiKey : '••••••••••••••••••••••••••••••••'}
            </div>
            <div className="flex flex-shrink-0 space-x-2">
              <button
                onClick={handleCopyKey}
                disabled={copied}
                className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-teal-600 rounded-md shadow-sm hover:bg-teal-700 disabled:bg-gray-400 transition-colors"
              >
                {copied ? (
                  <ClipboardCheck className="h-4 w-4 text-white" />
                ) : (
                  <Clipboard className="h-4 w-4 text-white" />
                )}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={() => setKeyVisible(!keyVisible)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 transition-colors"
              >
                {keyVisible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {keyVisible ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
 
          <button
            onClick={handleRegenerateKey}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 transition-colors disabled:bg-gray-400"
          >
            <RotateCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Regenerating...' : 'Regenerate Key'}
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default ApiKeyManagement;
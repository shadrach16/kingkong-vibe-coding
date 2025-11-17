import React, { useState, useEffect } from 'react';
import MainLayout from '../components/common/layouts/MainLayout';
import BillingHistory from '../components/billing/BillingHistory';
import billingService from '../services/billingService';
import { useAuth } from '../context/AuthContext';
import { CreditCard, DollarSign, RefreshCw, BarChart2, Loader2, Minimize, Square, X } from 'lucide-react';
 
const BillingPage = () => {
  const [billingInfo, setBillingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
 
  useEffect(() => {
    const fetchBillingInfo = async () => {
      try {
        const info = await billingService.getBillingInfo(user.apiKey);
        setBillingInfo(info);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchBillingInfo();
    }
  }, [user]);
 
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <div className="flex items-center justify-center mb-6">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
          </div>
          <p className="text-xl md:text-xl font-semibold text-gray-700">
            Loading...
          </p>
          <p className="text-sm text-gray-500 max-w-sm my-6">
            Please wait a moment while we prepare your data.
          </p>
        </div>
      );
    }
 
    if (error) {
      return (
        <div className="flex items-center justify-center h-full text-lg text-red-500">
          Error: {error}
        </div>
      );
    }
 
    const usagePercentage = billingInfo?.currentPlan?.taskLimit !== 0
      ? (billingInfo?.usageCount / billingInfo?.currentPlan?.taskLimit) * 100
      : 0;
 
    return (
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-8">
          <p className="  text-lg text-gray-500">Manage your subscription, view your usage, and track payment history.</p>
        </div>
 
        {billingInfo && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-10">
            {/* Current Plan Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col items-start transition-transform hover:scale-[1.02]">
              <div className="flex items-center mb-4">
                <CreditCard className="h-8 w-8 text-indigo-500 mr-4" />
                <h3 className="text-2xl font-semibold">Current Plan</h3>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-2">{billingInfo.currentPlan.name}</p>
              <p className="text-sm text-gray-500">Your current active subscription plan.</p>
            </div>
 
            {/* Usage Metrics Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col items-start transition-transform hover:scale-[1.02]">
              <div className="flex items-center mb-4">
                <BarChart2 className="h-8 w-8 text-green-500 mr-4" />
                <h3 className="text-2xl font-semibold">Task Usage</h3>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold text-gray-900">{billingInfo.usageCount}</span>
                <span className="text-lg text-gray-500">
                  of {billingInfo.currentPlan.taskLimit === 0 ? 'unlimited' : billingInfo.currentPlan.taskLimit} tasks
                </span>
              </div>
              {billingInfo.currentPlan.taskLimit !== 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4 shadow-inner">
                  <div
                    className="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${usagePercentage}%` }}
                  ></div>
                </div>
              )}
            </div>
 
            {/* Plan Reset Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col items-start transition-transform hover:scale-[1.02]">
              <div className="flex items-center mb-4">
                <RefreshCw className="h-8 w-8 text-sky-500 mr-4" />
                <h3 className="text-2xl font-semibold">Plan Reset</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">Monthly</p>
              <p className="text-sm text-gray-500">Your plan resets on the first of every month.</p>
            </div>
          </div>
        )}
 
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sm:p-8">
          <div className="flex items-center mb-6">
            <DollarSign className="h-8 w-8 text-gray-700 mr-4" />
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">Billing History</h2>
          </div>
          <BillingHistory />
        </div>
      </div>
    );
  };
 
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center   bg-gray-200 font-sans">
        <div className="w-full  bg-gray-100 rounded-md  border border-gray-300 overflow-hidden flex flex-col">
          {/* Window Title Bar */}
          <div className="bg-gray-200 border-b border-gray-300 p-2 flex items-center justify-between">
          
            <span className="text-sm font-medium text-gray-700">Billing Dashboard</span>
            <div className="flex items-center space-x-2 opacity-0">
              <Minimize className="w-4 h-4 text-gray-500" />
              <Square className="w-4 h-4 text-gray-500" />
              <X className="w-4 h-4 text-gray-500" />
            </div>
          </div>
          {/* Main Content Area */}
          {renderContent()}
        </div>
      </div>
    </MainLayout>
  );
};
 
export default BillingPage;
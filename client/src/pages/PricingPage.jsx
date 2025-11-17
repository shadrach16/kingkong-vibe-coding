import React, { useState, useEffect } from 'react';
import MainLayout from '../components/common/layouts/MainLayout';
import PlanCard from '../components/billing/PlanCard';
import billingService from '../services/billingService';
import { useAuth } from '../context/AuthContext';
import { Loader2, Minimize, Square, X } from 'lucide-react';
 
const PricingPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const { user } = useAuth();
 
  useEffect(() => {
    const fetchPlansAndInfo = async () => {
      try {
        const plansData = await billingService.getPlans();
        const billingInfo = await billingService.getBillingInfo(user.apiKey);
        console.log(billingInfo)
        setPlans(plansData.sort((a, b) => a.price - b.price));
        setCurrentPlan(billingInfo?.currentPlan?.name);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchPlansAndInfo();
    }
  }, [user]);
 
  const handleChoosePlan = async (plan) => {
    try {
      setLoading(true);
      const session = await billingService.createCheckoutSession(plan.stripePriceId, user.apiKey);
      // Redirect to Stripe Checkout
      window.location.href = session.url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
 
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
          <div className="flex items-center justify-center mb-6">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
          </div>
          <p className="text-xl md:text-xl font-semibold text-gray-700">
            { 'Loading...'}
          </p>
          <p className="text-sm text-gray-500 max-w-sm">
            Please wait a moment while we prepare your data.
          </p>
        </div>
      );
    }
 
    if (error) {
      return (
        <div className="text-center text-red-400 p-8 h-full">
          Error: {error}
        </div>
      );
    }
 
    return (
      <div className="flex-1 overflow-auto p-8">
        <div className="text-center mt-4 mb-16">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Pricing Plans</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Choose the plan that's right for you. Get started today and scale as you grow.
          </p>
        </div>
 
        <div className="mt-16 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {plans.map((plan) => (
            <PlanCard
              key={plan.stripePriceId}
              plan={{ ...plan, price: (plan.price).toFixed(2) }}
              isCurrent={currentPlan === plan.name}
              onChoosePlan={handleChoosePlan}
              loading={loading}
            />
          ))}
        </div>
 
        <div className="mt-20 max-w-7xl mx-auto p-10 rounded-xl bg-gray-50 border border-gray-200 shadow-inner">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="font-semibold text-lg">What happens if I exceed my task limit?</h3>
              <p className="text-sm mt-1">
                You will receive a notification when you are approaching your limit. If you exceed it, your tasks will be paused until the next billing cycle or until you upgrade your plan.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Can I change my plan at any time?</h3>
              <p className="text-sm mt-1">
                Yes, you can upgrade or downgrade your plan at any time directly from your billing dashboard. Changes will take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Do you offer a refund policy?</h3>
              <p className="text-sm mt-1">
                We do not offer refunds, but you can cancel your subscription at any time. Your plan will remain active until the end of the current billing period.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
 
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center  font-sans">
        <div className="w-full   bg-gray-100 rounded-md   border border-gray-300 overflow-hidden flex flex-col">
          {/* Window Title Bar */}
          <div className="bg-gray-200 border-b border-gray-300 p-2 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2">
            
            </div>
            <span className="text-sm font-medium text-gray-700">Pricing Plans</span>
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
 
export default PricingPage;
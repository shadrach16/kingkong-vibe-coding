import React from 'react';
import Button from '../common/forms/Button';
import { Check, ArrowRight, Sun, Zap, Award } from 'lucide-react';

const PlanCard = ({ plan, isCurrent, onChoosePlan, loading }) => {
  const getIcon = (planName) => {
    switch (planName) {
      case 'Free':
        return <Sun className="h-12 w-12 text-yellow-500" />;
      case 'Pro':
        return <Zap className="h-12 w-12 text-indigo-500" />;
      case 'Enterprise':
        return <Award className="h-12 w-12 text-purple-500" />;
      default:
        return null;
    }
  };

  const getButtonText = () => {
    if (loading) {
      return 'Processing...';
    }
    if (isCurrent) {
      return 'Current Plan';
    }
    return 'Choose Plan';
  };

  return (
    <div
      className={`relative bg-white rounded-3xl shadow-md border-1 p-8 flex flex-col justify-between 
        transform transition-all duration-500 ease-in-out hover:scale-105
        ${isCurrent ? 'border-indigo-600' : 'border-gray-200'}
      `}
    >
      {isCurrent && (
        <div className="absolute top-0 right-0 -mt-3 -mr-3 px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-full shadow-lg transform rotate-6">
          CURRENT
        </div>
      )}

      <div className="flex-grow">
        <div className="flex items-center justify-between mb-4">
          {getIcon(plan.name)}
          <h3 className="text-3xl font-bold text-gray-900 ml-4">{plan.name}</h3>
        </div>

        <p className="text-gray-500 text-sm mb-6 min-h-[40px]">
          {plan.name === 'Free'
            ? 'Perfect for trying out our platform with limited access.'
            : plan.name === 'Pro'
            ? 'For professionals and growing teams who need more power.'
            : 'Unleash the full power of our platform with enterprise-level features.'}
        </p>

        <div className="flex items-baseline space-x-2 mb-8">
          <span className="text-5xl font-extrabold text-gray-900">
            {plan.price === '0.00' ? 'Free' : `$${plan.price}`}
          </span>
          <span className="text-xl text-gray-500">{plan.price === '0.00' ? '' : '/mo'}</span>
        </div>

        <ul className="text-gray-700 space-y-4 mb-8">
          <li className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
            <span className="font-semibold mr-1">{plan.taskLimit === 0 ? 'Unlimited' : `${plan.taskLimit}`}</span> API Calls
          </li>
          <li className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
            Access to all core features
          </li>
          <li className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
            Priority community support
          </li>
        </ul>
      </div>

      <div>
        <Button
          onClick={() => onChoosePlan(plan)}
          disabled={isCurrent || loading}
          className={`w-full py-4 text-lg font-bold rounded-xl
            ${isCurrent ? 'bg-gray-200 text-gray-700 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}
          `}
        >
          {getButtonText()}
          {!isCurrent && !loading && <ArrowRight className="inline-block ml-2 h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
};

export default PlanCard;
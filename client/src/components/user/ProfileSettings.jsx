import React, {useState,useEffect} from 'react';
import { useAuth } from '../../context/AuthContext';
import billingService from '../../services/billingService';
import {
  Mail,
  UserCircle,
  Briefcase,
  Calendar,
  Star,
  Crown,
  Edit,
  User,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import moment from 'moment';

const ProfileSettings = () => {
  const { user } = useAuth();
  const profile = user?.user;
    const [billingInfo, setBillingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


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



  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-gray-200 shadow-inner">
        <div className="p-4 bg-gray-100 rounded-full mb-4">
          <UserCircle className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700">Profile Not Found</h3>
        <p className="mt-2 text-sm text-gray-500">
          Could not load user profile. Please try logging out and back in.
        </p>
      </div>
    );
  }

  const getPlanDetails = (plan) => {
    switch (plan) {
      case 'free':
        return { name: 'Free Tier', color: 'text-gray-500 bg-gray-100', icon: <Star className="h-5 w-5 text-gray-500" /> };
      case 'pro':
        return { name: 'Pro Plan', color: 'text-indigo-700 bg-indigo-100', icon: <Crown className="h-5 w-5 text-indigo-500" /> };
      default:
        return { name: 'Unknown Plan', color: 'text-gray-500 bg-gray-100', icon: <Star className="h-5 w-5 text-gray-500" /> };
    }
  };

  const planInfo = getPlanDetails(profile.subscriptionPlan);

  return (
    <div className="space-y-8 my-12">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0 relative">
              {profile.imageUrl ? (
                <img
                  className="h-24 w-24 rounded-full border-4 border-white shadow-lg"
                  src={profile.imageUrl}
                  alt={`${profile.name}'s profile`}
                />
              ) : (
                <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 border-4 border-white shadow-lg">
                  <UserCircle className="h-full w-full" />
                </div>
              )}
              <button
                className="absolute bottom-0 right-0 p-2 bg-gray-800 text-white rounded-full border-2 border-white shadow-md transition-colors duration-200 hover:bg-gray-700"
                aria-label="Edit profile picture"
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl font-bold text-gray-900 truncate">{profile.name || profile.email}</h2>
              <p className="mt-1 text-sm font-medium text-gray-500 truncate">{profile.email}</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors self-start sm:self-auto">
            <Edit className="h-4 w-4" />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <User className="h-5 w-5 text-indigo-500" />
            Basic Information
          </h4>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <span>{profile.email}</span>
            </li>
            <li className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span>Joined {moment(profile.createdAt).format('MMMM D, YYYY')}</span>
            </li>
            {profile.company && (
              <li className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-gray-400" />
                <span>{profile.company}</span>
              </li>
            )}
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-500" />
            Account & Plan
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full ${planInfo.color}`}>
                {planInfo.icon}
                {planInfo.name}
              </span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Zap className="h-5 w-5 text-gray-400" />
              <span>API Calls: <strong>{billingInfo?.usageCount || 0}</strong> / <strong>{ billingInfo?.currentPlan?.taskLimit|| '∞'}</strong></span>
            </div>
            <p className="text-gray-500 mt-2 text-sm">
              Your usage is reset monthly. Upgrade for higher limits and more features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
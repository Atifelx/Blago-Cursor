import React from 'react';
import { useSelector } from 'react-redux';
import { CheckCircle, CreditCard, Star, Zap, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SubscriptionStatus = () => {
  const currentUser = useSelector(state => state.user.currentUser);
  const navigate = useNavigate();

  if (!currentUser?.user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center py-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-600">Loading...</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const user = currentUser.user;
  const isPaid = user.subscriptionStatus === 'paid';
  const isTrial = user.subscriptionStatus === 'trial';
  const isExpired = user.subscriptionStatus === 'expired' || user.subscriptionStatus === 'unpaid';
  
  // Determine user type for branding
  const userType = isPaid ? 'Pro User' : isTrial ? 'Trial User' : 'Expired User';
  const userTypeColor = isPaid ? 'from-emerald-500 to-emerald-600' : isTrial ? 'from-blue-500 to-blue-600' : 'from-gray-500 to-gray-600';

  const expiryDate = isPaid ? user.paidUntil : user.trialEndDate;
  const daysRemaining = user.daysRemaining || 0;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src="/fevicon.svg" alt="Blago AI" className="w-16 h-16" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Blago AI</h1>
          <p className="text-xl text-gray-600">Your Subscription Status</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* User Type Badge */}
          <div className={`bg-gradient-to-r ${userTypeColor} px-8 py-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{userType}</h2>
                  <p className="text-white/80">
                    {isPaid ? 'Premium Access Active' : isTrial ? 'Trial Access Active' : 'Access Expired'}
                  </p>
                  {isPaid && (
                    <p className="text-white/70 text-sm mt-1">
                      One-time payment • Manual renewal • No auto-billing
                    </p>
                  )}
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-white font-semibold">
                  {isPaid ? 'PRO' : isTrial ? 'TRIAL' : 'EXPIRED'}
                </span>
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Status */}
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <h3 className="text-lg font-semibold text-green-800">Active Subscription</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-semibold text-green-700 capitalize">
                        {isPaid ? 'Paid' : isTrial ? 'Trial' : 'Expired'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Days Remaining:</span>
                      <span className="font-semibold text-blue-600">{daysRemaining} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expires:</span>
                      <span className="font-semibold">{formatDate(expiryDate)}</span>
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Account Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Username:</span>
                      <span className="font-medium">{user.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Since:</span>
                      <span className="font-medium">{formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Features & Actions */}
              <div className="space-y-6">
                {/* Pro Features */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-800 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Pro Features
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Unlimited AI Writing</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Advanced Document Generation</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Web Scraping Tools</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">Priority Support</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  {!isPaid && (
                    <button
                      onClick={() => navigate('/Pay')}
                      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>Upgrade to Pro</span>
                    </button>
                  )}

                </div>

                {/* Billing Info for Pro Users */}
                {isPaid && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Billing Information</h4>
                    <p className="text-sm text-blue-700">
                      <strong>No recurring charges:</strong> You paid once and get full access for {daysRemaining} days. 
                      Your subscription will automatically expire on {formatDate(expiryDate)}.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatus;

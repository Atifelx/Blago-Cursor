import React from 'react';
import { useSelector } from 'react-redux';
import { CheckCircle, Calendar, CreditCard, Star, Zap, Users, Clock, Shield } from 'lucide-react';
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

  const cancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features.')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
      const response = await fetch(`${apiBase}/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Subscription cancelled successfully');
        // Refresh the page to update the subscription status
        window.location.reload();
      } else {
        alert('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Error cancelling subscription');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
            <Star className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Blago AI</h1>
          <p className="text-xl text-gray-600">Your Subscription Status</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Pro User Badge */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Pro User</h2>
                  <p className="text-purple-100">Premium Access Active</p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-white font-semibold">PRO</span>
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
                  <button
                    onClick={() => navigate('/Pay')}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Make Advanced Payment</span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Users className="w-5 h-5" />
                    <span>Go to Dashboard</span>
                  </button>

                  {isPaid && (
                    <button
                      onClick={cancelSubscription}
                      className="w-full bg-red-50 text-red-600 font-semibold py-3 px-6 rounded-xl hover:bg-red-100 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Clock className="w-5 h-5" />
                      <span>Cancel Subscription</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatus;

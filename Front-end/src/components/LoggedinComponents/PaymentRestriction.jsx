import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CreditCard, AlertCircle, Zap } from 'lucide-react';

const PaymentRestriction = ({ user }) => {
    const navigate = useNavigate();

    const isExpired = user?.subscriptionStatus === 'expired' || user?.subscriptionStatus === 'unpaid';

    if (!isExpired) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-8 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
                    <p className="text-white/90">Your trial has expired</p>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Continue Using Blago AI</h3>
                        <p className="text-gray-600 mb-4">
                            Your free trial has ended. Upgrade to Blago Pro to continue using all features.
                        </p>
                    </div>

                    {/* Features List */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h4 className="font-medium text-gray-900 mb-3">What you'll get with Blago Pro:</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                                <Zap className="w-4 h-4 text-green-500" />
                                <span className="text-gray-700">Unlimited AI Writing</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Zap className="w-4 h-4 text-green-500" />
                                <span className="text-gray-700">Advanced Document Generation</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Zap className="w-4 h-4 text-green-500" />
                                <span className="text-gray-700">Web Scraping Tools</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Zap className="w-4 h-4 text-green-500" />
                                <span className="text-gray-700">Priority Support</span>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="text-center mb-6">
                        <div className="text-3xl font-bold text-gray-900 mb-1">$29.00</div>
                        <div className="text-gray-600">per month • Cancel anytime</div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/Pay')}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                            <CreditCard className="w-5 h-5" />
                            <span>Upgrade to Pro - $29/month</span>
                        </button>

                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-gray-100 text-gray-700 font-medium py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Continue with Limited Access
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            Limited features available without subscription
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentRestriction;

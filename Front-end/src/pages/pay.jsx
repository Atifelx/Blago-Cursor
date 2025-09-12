
import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Loader, Bot, Zap, Users, Star, Clock, Shield } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserSubscription } from '../app/user/userSlice';

const BlagoAISubscription = () => {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle', 'processing', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [userSubscription, setUserSubscription] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);

  // Get current user from Redux state and dispatch
  const currentUser = useSelector(state => state.user.currentUser);
  const dispatch = useDispatch();

  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';
  const PAYPAL_CONFIG = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'AQ9FgZsH6PVU--XOe0-tG_d1Gws73H6jpXCDSxOzxfCOvHuG0lE5pcccp69rOUTCNUWpYSPa4GUXc040',
    environment: 'sandbox',
    planId: 'P-5ML4271244454362WXNWU5NQ',
  };

  // Get user from localStorage or context
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch user subscription status
  const fetchUserSubscription = async () => {
    try {
      setLoadingSubscription(true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.log('No access token found');
        setLoadingSubscription(false);
        return;
      }

      console.log('Fetching subscription status...');
      const response = await fetch(`${apiBase}/subscription-status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Subscription status response:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Subscription data:', data);
        setUserSubscription(data);
      } else {
        const errorData = await response.json();
        console.error('Subscription fetch error:', errorData);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoadingSubscription(false);
    }
  };

  // Load PayPal SDK and set subscription status from current user
  useEffect(() => {
    const loadPayPalSDK = () => {
      if (window.paypal) {
        setIsSDKLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CONFIG.clientId}&components=buttons&enable-funding=card&disable-funding=paylater,venmo`;
      script.async = true;
      script.onload = () => setIsSDKLoaded(true);
      script.onerror = () => setErrorMessage('Failed to load PayPal SDK');
      document.head.appendChild(script);
    };

    loadPayPalSDK();

    // Use current user data instead of making API call
    if (currentUser && currentUser.user) {
      console.log('Using current user data:', currentUser.user);
      setUserSubscription(currentUser.user);
      setLoadingSubscription(false);
    } else {
      console.log('No current user found, fetching subscription...');
      fetchUserSubscription();
    }

    return () => {
      const existingScript = document.querySelector(`script[src*="paypal.com/sdk/js"]`);
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, [currentUser]);

  // Initialize PayPal buttons when SDK loads
  useEffect(() => {
    if (!isSDKLoaded || paymentStatus !== 'idle') return;

    const timer = setTimeout(() => {
      renderWalletButtons();
    }, 1000);

    return () => clearTimeout(timer);
  }, [isSDKLoaded, paymentStatus]);


  const renderWalletButtons = async () => {
    if (!window.paypal) return;
    try {
      await window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal'
        },
        // Prevent opening in new tab
        createOrder: async () => {
          const resp = await fetch(`${apiBase}/paypal/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: '29.00', currency: 'USD' })
          });
          const data = await resp.json();
          if (!resp.ok) throw new Error(data.message || 'Failed to create order');
          return data.id;
        },
        onApprove: async ({ orderID }) => {
          try {
            setPaymentStatus('processing');
            // Get email from current user data
            const email = currentUser?.user?.email || undefined;
            console.log('Capturing payment for email:', email);
            const resp = await fetch(`${apiBase}/paypal/capture-order`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderID, email })
            });
            const result = await resp.json();
            if (!resp.ok) throw new Error(result.message || 'Capture failed');
            const capture = result?.result?.purchase_units?.[0]?.payments?.captures?.[0];
            setOrderData({
              orderID,
              status: result?.result?.status || capture?.status || 'COMPLETED',
              amount: capture?.amount?.value,
              currency: capture?.amount?.currency_code,
            });
            setPaymentStatus('success');
            // Update Redux state with new subscription data
            setTimeout(() => {
              // Update user subscription in Redux state
              dispatch(updateUserSubscription({
                subscriptionStatus: 'paid',
                paidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                lastPaymentDate: new Date().toISOString(),
                daysRemaining: 30
              }));
              
              // Also refresh from API to ensure data consistency
              fetchUserSubscription();
              
              // Auto-transition to subscription status after 3 seconds
              setTimeout(() => {
                setPaymentStatus('idle');
              }, 3000);
            }, 1000);
          } catch (e) {
            setPaymentStatus('error');
            setErrorMessage(e.message);
          }
        },
        onError: (err) => {
          setPaymentStatus('error');
          setErrorMessage(err?.message || 'Payment failed');
        }
      }).render('#paypal-button-container');
    } catch (error) {
      console.error('PayPal Buttons failed:', error);
    }
  };

  const resetPayment = () => {
    setPaymentStatus('idle');
    setErrorMessage('');
    setSubscriptionData(null);
    setOrderData(null);
  };

  const cancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features.')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${apiBase}/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Subscription cancelled successfully');
        fetchUserSubscription(); // Refresh subscription status
      } else {
        alert('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Error cancelling subscription');
    }
  };

  // Processing screen
  if (paymentStatus === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center py-8">
            <Loader className="w-12 h-12 animate-spin mx-auto mb-6 text-blue-500" />
            <h3 className="text-2xl font-bold mb-4 text-blue-600">Processing Your Payment</h3>
            <p className="text-gray-600 mb-6">Setting up your Blago AI account...</p>
            <div className="space-y-2 text-sm text-green-600">
              <p className="flex items-center justify-center"><CheckCircle className="w-4 h-4 mr-2" /> Payment approved by PayPal</p>
              <p className="flex items-center justify-center"><Loader className="w-4 h-4 mr-2 animate-spin" /> Activating subscription...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success screen
  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold mb-4 text-green-600">🎉 Payment Successful!</h3>
            <p className="text-gray-600 mb-6 text-lg">Welcome to Blago AI Professional</p>

            {orderData && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                <h4 className="font-semibold text-green-800 mb-3">Payment Details</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <p><strong>Order ID:</strong> {orderData.orderID}</p>
                  <p><strong>Amount:</strong> ${orderData.amount} {orderData.currency}</p>
                  <p><strong>Status:</strong> {orderData.status}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 font-medium"
              >
                Go to Dashboard
              </button>
              <button
                onClick={resetPayment}
                className="text-gray-600 hover:text-gray-800 underline"
              >
                Make Another Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error screen
  if (paymentStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-red-600">Payment Failed</h3>
            <p className="text-gray-600 mb-6">{errorMessage || 'There was an issue processing your payment.'}</p>
            <div className="space-y-4">
              <button
                onClick={resetPayment}
                className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-all duration-200 font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="text-gray-600 hover:text-gray-800 underline"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while fetching subscription
  if (loadingSubscription) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center py-8">
              <Loader className="w-12 h-12 animate-spin mx-auto mb-6 text-blue-500" />
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Loading Subscription Status</h3>
              <p className="text-gray-600">Please wait while we fetch your subscription details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show subscription status if user has active subscription
  if (userSubscription && (userSubscription.subscriptionStatus === 'paid' || userSubscription.subscriptionStatus === 'trial')) {
    const expiryDate = userSubscription.subscriptionStatus === 'paid'
      ? userSubscription.paidUntil
      : userSubscription.trialEndDate;

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Left Side - Pro User Status */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">PRO</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Pro User</h1>
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Active Subscription
                </div>
              </div>

              {/* Subscription Status Card */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Subscription Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600 capitalize">{userSubscription.subscriptionStatus}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-medium">Blago Pro</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Days Remaining:</span>
                    <span className="font-bold text-blue-600 text-lg">{userSubscription.daysRemaining} days</span>
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              {orderData && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Transaction Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{orderData.orderID}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">${orderData.amount} {orderData.currency}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-green-600">{orderData.status}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Payment Cycle & Actions */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">B</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">Blago Pro</span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">Next Payment Cycle</h3>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Next Billing Date:</span>
                      <span className="font-medium">{new Date(expiryDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">$29.00 USD</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cycle:</span>
                      <span className="font-medium">Monthly</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setPaymentStatus('idle');
                      setOrderData(null);
                    }}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
                  >
                    Make Advanced Payment
                  </button>

                  <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all duration-200 font-medium"
                  >
                    Go to Dashboard
                  </button>

                  <button
                    onClick={cancelSubscription}
                    className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-all duration-200 font-medium"
                  >
                    Cancel Subscription
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    Your subscription will automatically renew on {new Date(expiryDate).toLocaleDateString()}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main subscription page
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left Side - Subscription Details */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">B</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Try Blago Pro</h1>
              <div className="text-4xl font-bold text-green-600 mb-2">14 days free</div>
              <p className="text-lg text-gray-600">Then $29.00 per month starting after trial</p>
            </div>

            {/* Feature Card */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Blago Pro</h3>
              <p className="text-gray-600 mb-4">Unlocks unlimited AI writing tools, advanced features, and premium support</p>
              <div className="text-sm text-gray-500">$29.00 / month after</div>
            </div>

            {/* Annual Billing Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
              <div>
                <div className="font-medium text-gray-900">Save $58 with annual billing</div>
                <div className="text-sm text-gray-500">$24.00/month</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Summary */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">$29.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span className="text-gray-500">(Enter address to calculate)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total after trial:</span>
                <span className="font-medium">$29.00</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-600">Total due today:</span>
                <span className="font-bold text-green-600">$0.00</span>
              </div>
            </div>
          </div>

          {/* Right Side - Payment Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-bold">B</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">Blago</span>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                  defaultValue={user?.email || ''}
                />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">Enter payment details</h3>

              {/* PayPal Payment Section */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.51-.978c-.57-.7-1.39-1.1-2.46-1.1H8.5c-.524 0-.968.382-1.05.9L5.32 19.337h4.606l1.12-7.106c.082-.518.526-.9 1.05-.9h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437.292-1.867-.002-3.137-1.012-4.287z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Secure Payment with PayPal</h4>
                    <p className="text-gray-600 mb-4">Complete your payment securely with PayPal. You can pay with your PayPal balance, bank account, or credit card.</p>
                  </div>

                  {/* PayPal Button */}
                  <div id="paypal-button-container" className="mb-4"></div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-center space-x-2 text-sm text-blue-700">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span>Your payment information is secure and encrypted</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  By continuing, you agree to save your payment method with Blago.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlagoAISubscription;
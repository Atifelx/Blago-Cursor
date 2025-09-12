import React, { useState, useEffect } from 'react';
import { CreditCard, Shield, CheckCircle, AlertCircle, Loader, Zap, Bot, Clock, Users, Star } from 'lucide-react';

const BlagoAISubscription = () => {
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [showDebug, setShowDebug] = useState(false);

  // PayPal Configuration
  const PAYPAL_CONFIG = {
    clientId: import.meta?.env?.VITE_PAYPAL_CLIENT_ID || "AQ9FgZsH6PVU--XOe0-tG_d1Gws73H6jpXCDSxOzxfCOvHuG0lE5pcccp69rOUTCNUWpYSPa4GUXc040",
    environment: "sandbox"
  };

  // Load PayPal SDK
  useEffect(() => {
    if (window.paypal) {
      setIsSDKLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CONFIG.clientId}&intent=capture&currency=USD&components=buttons`;
    script.async = true;

    script.onload = () => {
      console.log('PayPal SDK loaded successfully');
      setIsSDKLoaded(true);
    };

    script.onerror = () => {
      console.error('Failed to load PayPal SDK');
      setErrorMessage('Failed to load PayPal SDK. Please refresh the page.');
    };

    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector(`script[src*="paypal.com/sdk/js"]`);
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, []);

  // Initialize PayPal buttons when SDK is loaded
  useEffect(() => {
    if (isSDKLoaded && paymentStatus === 'idle') {
      const timer = setTimeout(() => {
        initializePayPal();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isSDKLoaded, paymentStatus]);

  const initializePayPal = () => {
    const container = document.getElementById('paypal-button-container');
    if (!container || !window.paypal) {
      console.error('PayPal container or SDK not available');
      return;
    }

    console.log('Initializing PayPal buttons...');

    // Clear existing buttons
    container.innerHTML = '';

    try {
      window.paypal.Buttons({
        style: {
          shape: 'rect',
          color: 'blue',
          layout: 'vertical',
          label: 'pay',
          height: 55,
          tagline: false
        },
        createOrder: function (data, actions) {
          return actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
              {
                amount: {
                  currency_code: 'USD',
                  value: '29.00'
                },
                description: 'Blago AI Professional - One-time access'
              }
            ],
            application_context: {
              brand_name: 'Blago AI',
              user_action: 'PAY_NOW'
            }
          });
        },
        onApprove: async function (data, actions) {
          try {
            setPaymentStatus('processing');
            const details = await actions.order.capture();
            const orderInfo = {
              orderID: data.orderID,
              status: details?.status || 'COMPLETED',
              payerName: details?.payer?.name?.given_name,
              payerEmail: details?.payer?.email_address,
              amount: details?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value,
              currency: details?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.currency_code,
              captureId: details?.purchase_units?.[0]?.payments?.captures?.[0]?.id,
            };
            setOrderData(orderInfo);
            setPaymentStatus('success');
          } catch (error) {
            console.error('Error capturing order:', error);
            setPaymentStatus('error');
            setErrorMessage('Failed to complete payment: ' + error.message);
          }
        },
        onCancel: function () {
          setPaymentStatus('cancelled');
          setErrorMessage('You cancelled the payment. No charges were made.');
        },
        onError: function (err) {
          console.error('PayPal error:', err);
          setPaymentStatus('error');

          let errorMsg = 'Payment failed. Please try again.';
          if (err && typeof err === 'object') {
            if (err.message) {
              errorMsg = err.message;
            } else if (err.details && err.details[0] && err.details[0].description) {
              errorMsg = err.details[0].description;
            } else if (err.name) {
              errorMsg = `PayPal Error: ${err.name}`;
            }
          } else if (typeof err === 'string') {
            errorMsg = err;
          }

          setErrorMessage(errorMsg);
        }
      }).render('#paypal-button-container').then(function () {
        console.log('PayPal buttons rendered successfully');
      }).catch(function (error) {
        console.error('Failed to render PayPal buttons:', error);
        setErrorMessage('Failed to render payment buttons: ' + error.message);
      });

    } catch (error) {
      console.error('Error initializing PayPal buttons:', error);
      setErrorMessage('Failed to initialize payment system: ' + error.message);
    }
  };

  const resetPayment = () => {
    setPaymentStatus('idle');
    setErrorMessage('');
    setSubscriptionData(null);
    setOrderData(null);
  };

  const viewSubscriptionDetails = () => {
    if (subscriptionData) {
      const details = `
Subscription Details:
• Subscription ID: ${subscriptionData.subscriptionId}
• Status: ${subscriptionData.status}
• Plan ID: ${subscriptionData.planId}
• Start Date: ${new Date(subscriptionData.createTime).toLocaleDateString()}
• Next Billing: ${subscriptionData.nextBillingTime ? new Date(subscriptionData.nextBillingTime).toLocaleDateString() : 'N/A'}
• Amount: ${subscriptionData.amount}
• Payer ID: ${subscriptionData.payerID}
      `;
      alert(details);
    }
  };

  // Processing screen
  if (paymentStatus === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center py-8">
            <Loader className="w-12 h-12 animate-spin mx-auto mb-6 text-blue-500" />
            <h3 className="text-2xl font-bold mb-4 text-blue-600">Processing Your Subscription</h3>
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
            <h3 className="text-3xl font-bold mb-3 text-green-600">🎉 Payment Successful</h3>
            <p className="text-gray-600 text-lg mb-8">Your Blago AI purchase is complete</p>

            {orderData && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8 text-left border border-green-200">
                <h4 className="font-bold text-gray-800 mb-4 text-center flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Order Details
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-gray-500 text-xs">Order ID</p>
                    <p className="text-blue-600 font-mono text-xs break-all">{orderData.orderID}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-gray-500 text-xs">Status</p>
                    <p className="text-green-600 font-semibold">{orderData.status}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-gray-500 text-xs">Amount</p>
                    <p className="text-gray-800 font-semibold">${orderData.amount} {orderData.currency}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-gray-500 text-xs">Payer</p>
                    <p className="text-gray-800">{orderData.payerName || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 justify-center mb-6">
              <button
                onClick={resetPayment}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold flex items-center"
              >
                <Zap className="w-5 h-5 mr-2" />
                Continue
              </button>
              {orderData && (
                <button
                  onClick={() => alert(`Order: ${orderData.orderID}\nStatus: ${orderData.status}\nAmount: $${orderData.amount} ${orderData.currency}`)}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium flex items-center"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  View Details
                </button>
              )}
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h5 className="font-semibold text-blue-800 mb-2">🚀 What's Next?</h5>
              <div className="text-blue-700 text-sm space-y-1">
                <p>• Access all premium AI features immediately</p>
                <p>• Your subscription auto-renews monthly</p>
                <p>• Cancel anytime from your PayPal account</p>
                <p>• Email confirmation sent to your PayPal email</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error/Cancelled screen
  if (paymentStatus === 'error' || paymentStatus === 'cancelled') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-red-700">
              {paymentStatus === 'error' ? '❌ Subscription Failed' : '⚠️ Subscription Cancelled'}
            </h3>
            <p className="text-gray-600 mb-6">{errorMessage}</p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
              <h4 className="font-semibold text-red-800 mb-2">What happened?</h4>
              <p className="text-red-700 text-sm">
                {paymentStatus === 'error'
                  ? 'There was an issue processing your subscription. This could be due to payment method issues, network problems, or PayPal service interruption.'
                  : 'You chose to cancel the subscription process. No charges were made to your account and no subscription was created.'
                }
              </p>
            </div>

            <button
              onClick={resetPayment}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold flex items-center justify-center mx-auto"
            >
              <Loader className="w-5 h-5 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main subscription page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl shadow-xl">
              <Bot className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent mb-4">
            Blago AI
          </h1>
          <p className="text-gray-600 text-lg md:text-xl mb-2">Advanced AI Technology at Your Fingertips</p>
          <p className="text-gray-500">Join thousands of users already transforming their workflow</p>
        </div>

        {/* Existing Subscription Notice */}
        {subscriptionData && paymentStatus === 'idle' && (
          <div className="mb-8 p-6 bg-green-50 border-2 border-green-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                <div>
                  <h4 className="font-semibold text-green-800">✅ Active Subscription Found</h4>
                  <p className="text-green-700 text-sm">
                    Subscription ID: {subscriptionData.subscriptionId.slice(0, 20)}...
                  </p>
                </div>
              </div>
              <button
                onClick={viewSubscriptionDetails}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 text-sm font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        )}

        {/* Main Pricing Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-blue-100">

          {/* Plan Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Zap className="w-6 h-6 mr-2" />
                  <h2 className="text-2xl font-bold">Professional Plan</h2>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full px-4 py-1">
                  <span className="text-sm font-medium">Most Popular</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold mb-2">$29</div>
                <div className="text-blue-100 text-lg md:text-xl mb-2">per month</div>
                <div className="text-blue-200 text-sm">Billed monthly • Cancel anytime</div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Social Proof */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-8 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center text-blue-700">
                <Users className="w-5 h-5 mr-2" />
                <span className="font-semibold">2,500+ Active Users</span>
              </div>
              <div className="flex items-center text-blue-700">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                <span className="font-semibold">4.9/5 Rating</span>
              </div>
              <div className="flex items-center text-blue-700">
                <Clock className="w-5 h-5 mr-2" />
                <span className="font-semibold">99.9% Uptime</span>
              </div>
            </div>

            {/* Features Grid */}
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Everything You Need</h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[
                { icon: '🧠', title: 'Advanced AI Processing', desc: 'GPT-4 level capabilities' },
                { icon: '📊', title: 'Real-time Analytics', desc: 'Live performance insights' },
                { icon: '🔗', title: 'API Access & Integration', desc: 'Full developer access' },
                { icon: '🛟', title: 'Priority Support', desc: '24/7 expert assistance' },
                { icon: '⚡', title: '99.9% Uptime SLA', desc: 'Enterprise reliability' },
                { icon: '🎯', title: 'Custom Model Training', desc: 'Personalized AI models' },
                { icon: '∞', title: 'Unlimited Requests', desc: 'No usage limits' },
                { icon: '💾', title: 'Export & Backup Tools', desc: 'Secure data management' }
              ].map((feature, index) => (
                <div key={index} className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 hover:shadow-md transition-all duration-200">
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h4 className="font-bold text-gray-800 mb-1">{feature.title}</h4>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Security Section */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl mb-8 border border-green-200">
              <div className="flex items-start">
                <Shield className="w-7 h-7 text-green-500 mr-4 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-2 text-lg">🔒 Enterprise-Grade Security</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Your payment is processed securely through PayPal's encrypted infrastructure.
                    No payment details are stored on our servers. SSL encryption protects all data transfers.
                    Cancel your subscription anytime directly from PayPal with no hidden fees or penalties.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="border-t-2 border-gray-100 pt-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Get Started?</h3>
                <p className="text-gray-600">Join Blago AI today and transform your workflow</p>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl mb-6 border-2 border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 flex items-center">
                      <Bot className="w-5 h-5 mr-2 text-blue-500" />
                      Blago AI Professional
                    </h4>
                    <p className="text-gray-600 mt-1">Full access to all premium features</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-4xl font-bold text-blue-600">$29</div>
                    <div className="text-gray-500">per month</div>
                  </div>
                </div>
              </div>

              {/* Debug Information (toggle) */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setShowDebug(!showDebug)}
                  className="text-xs text-blue-600 hover:text-blue-700 underline"
                >
                  {showDebug ? 'Hide technical details' : 'Show technical details'}
                </button>
                {showDebug && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-xl border text-xs text-gray-600">
                    <h5 className="font-semibold text-gray-800 mb-2">🔍 Debug Info:</h5>
                    <p><strong>SDK Loaded:</strong> {isSDKLoaded ? '✅ Yes' : '❌ No'}</p>
                    <p><strong>Client ID:</strong> {PAYPAL_CONFIG.clientId.slice(0, 20)}...</p>
                    <p><strong>Plan ID:</strong> {PAYPAL_CONFIG.planId}</p>
                    <p><strong>Environment:</strong> {PAYPAL_CONFIG.environment}</p>
                    <p><strong>PayPal Available:</strong> {typeof window !== 'undefined' && window.paypal ? '✅ Yes' : '❌ No'}</p>
                  </div>
                )}
              </div>

              {/* PayPal Buttons Container */}
              <div className="mb-6">
                <div className="flex items-center justify-center">
                  <div id="paypal-button-container" className="min-h-[60px] w-full max-w-sm"></div>
                </div>
              </div>

              {/* Loading State */}
              {!isSDKLoaded && (
                <div className="text-center py-8 bg-blue-50 rounded-xl">
                  <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                  <p className="text-blue-600 font-medium">Loading secure payment options...</p>
                  <p className="text-gray-500 text-sm mt-1">Connecting to PayPal...</p>
                </div>
              )}

              {/* Error Display */}
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl" role="alert" aria-live="polite">
                  <div className="flex items-start">
                    <AlertCircle className="w-6 h-6 text-red-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-red-700 font-semibold">Payment Error</p>
                      <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Information */}
              <div className="text-center text-sm text-gray-500 mt-8 space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="font-medium text-gray-700 mb-2">🔒 Secure Payment • Cancel Anytime • No Hidden Fees</p>
                  <p>Monthly subscription for $29.00 USD. Billing occurs automatically every month.</p>
                  <p className="mt-2">By subscribing, you agree to our Terms of Service and Privacy Policy.</p>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-yellow-700 font-medium">⚠️ Sandbox Mode Active</p>
                  <p className="text-yellow-600 text-xs mt-1">This is a test environment - No real payments will be processed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Footer */}
        <div className="text-center mt-12 p-6 bg-white rounded-xl shadow-lg border">
          <h4 className="font-bold text-gray-800 mb-2">Need Help?</h4>
          <p className="text-gray-600 mb-3">Our support team is here to assist you</p>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <span className="text-blue-600 font-medium">📧 support@blago.ai</span>
            <span className="text-gray-400">•</span>
            <span className="text-blue-600 font-medium">💬 Live Chat Available</span>
            <span className="text-gray-400">•</span>
            <span className="text-blue-600 font-medium">📞 1-800-BLAGO-AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlagoAISubscription;




















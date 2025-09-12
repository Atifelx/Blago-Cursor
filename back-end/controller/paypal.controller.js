import axios from 'axios';
import User from '../module/user.model.js';
import { errorHandler } from '../utils/error.js';

const PAYPAL_BASE = process.env.PAYPAL_MODE === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;
  if (!clientId || !secret) {
    throw new Error('Missing PayPal credentials');
  }
  const token = Buffer.from(clientId + ':' + secret).toString('base64');
  const resp = await axios.post(
    PAYPAL_BASE + '/v1/oauth2/token',
    new URLSearchParams({ grant_type: 'client_credentials' }),
    { headers: { Authorization: `Basic ${token}` } }
  );
  return resp.data.access_token;
}

// POST /api/paypal/create-order { amount, currency }
export const createOrder = async (req, res, next) => {
  try {
    const accessToken = await getAccessToken();
    const { amount = '29.00', currency = 'USD' } = req.body || {};
    const order = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: { currency_code: currency, value: amount },
          description: 'Blago AI Professional - One-time access',
        },
      ],
      application_context: {
        brand_name: 'Blago AI',
        user_action: 'PAY_NOW',
        shipping_preference: 'NO_SHIPPING',
      },
    };
    const resp = await axios.post(PAYPAL_BASE + '/v2/checkout/orders', order, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    });
    res.json({ id: resp.data.id });
  } catch (err) {
    next(err);
  }
};

// POST /api/paypal/capture-order { orderID, email }
export const captureOrder = async (req, res, next) => {
  try {
    const { orderID, email } = req.body;
    if (!orderID) return next(errorHandler(400, 'orderID required'));
    const accessToken = await getAccessToken();
    const resp = await axios.post(
      PAYPAL_BASE + `/v2/checkout/orders/${orderID}/capture`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // If email provided, mark user paid for 30 days
    if (email) {
      const user = await User.findOne({ email });
      if (user) {
        const base = user.paidUntil && user.paidUntil > new Date() ? user.paidUntil : new Date();
        user.paidUntil = new Date(base.getTime() + 30 * 24 * 60 * 60 * 1000);
        user.subscriptionStatus = 'paid';
        user.lastPaymentDate = new Date();
        await user.save();
      }
    }

    res.json({ success: true, result: resp.data });
  } catch (err) {
    // surface PayPal error message if present
    const msg = err?.response?.data || err.message;
    next(errorHandler(400, typeof msg === 'string' ? msg : JSON.stringify(msg)));
  }
};

// POST /api/paypal/cancel-subscription { email }
export const cancelPayPalSubscription = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(errorHandler(400, 'email required'));

    // Find user and cancel their subscription
    const user = await User.findOne({ email });
    if (user) {
      user.subscriptionStatus = 'expired';
      user.paidUntil = new Date(); // Set to current date to expire immediately
      await user.save();
    }

    res.json({ success: true, message: 'Subscription cancelled successfully' });
  } catch (err) {
    next(errorHandler(500, err.message));
  }
};



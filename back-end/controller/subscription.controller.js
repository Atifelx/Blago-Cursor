import User from "../module/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

// GET /api/subscription-status (uses JWT token)
export const getSubscriptionStatus = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : req.cookies.access_token;
    
    if (!token) return next(errorHandler(401, 'Access token required'));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return next(errorHandler(404, 'user not found'));

    const now = new Date();
    let subscriptionStatus = user.subscriptionStatus;
    if (user.paidUntil && user.paidUntil > now) {
      subscriptionStatus = 'paid';
    } else if (now <= (user.trialEndDate || now)) {
      subscriptionStatus = 'trial';
    } else {
      subscriptionStatus = 'expired';
    }
    const daysRemaining = (() => {
      const target = subscriptionStatus === 'paid' ? user.paidUntil : user.trialEndDate;
      if (!target) return 0;
      const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
      return Math.max(0, diff);
    })();

    res.json({
      success: true,
      subscriptionStatus,
      trialEndDate: user.trialEndDate,
      paidUntil: user.paidUntil,
      daysRemaining,
      plan: user.plan,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/payment/confirm
// Body: { email, orderID, amount, currency }
export const confirmPayment = async (req, res, next) => {
  try {
    const { email, orderID, amount, currency } = req.body;
    if (!email || !orderID) return next(errorHandler(400, 'email and orderID are required'));
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, 'user not found'));

    // Extend paidUntil by 45 days from now (or from existing paidUntil if in future)
    // This gives 15 extra days for advanced payments
    const base = user.paidUntil && user.paidUntil > new Date() ? user.paidUntil : new Date();
    const nextPaidUntil = new Date(base.getTime() + 45 * 24 * 60 * 60 * 1000);

    user.subscriptionStatus = 'paid';
    user.lastPaymentDate = new Date();
    user.paidUntil = nextPaidUntil;
    await user.save();

    res.json({
      success: true,
      message: 'Payment recorded',
      paidUntil: user.paidUntil,
      subscriptionStatus: user.subscriptionStatus,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/cancel-subscription (uses JWT token)
export const cancelSubscription = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : req.cookies.access_token;
    
    if (!token) return next(errorHandler(401, 'Access token required'));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return next(errorHandler(404, 'user not found'));

    // Set subscription to expired
    user.subscriptionStatus = 'expired';
    await user.save();

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      subscriptionStatus: 'expired',
    });
  } catch (err) {
    next(err);
  }
};



import express from 'express';
import { signup, signin, update, verifyemail, Gsignup, initiateEmailVerification, verifyEmailAndCompleteSignup, cleanupIncompleteUsers, expireUserTrial } from '../controller/auth.controller.js'
import { confirmPayment, getSubscriptionStatus, cancelSubscription } from '../controller/subscription.controller.js'
import { createOrder, captureOrder, cancelPayPalSubscription } from '../controller/paypal.controller.js'
const authRoutes = express.Router();

// Route to get users
authRoutes.post('/Gsignup', Gsignup);
authRoutes.post('/signup', signup);
authRoutes.put('/update', update);
authRoutes.post('/signin', signin);
authRoutes.post('/verifyemail', verifyemail);
// Email verification endpoints
authRoutes.post('/initiate-email-verification', initiateEmailVerification);
authRoutes.post('/verify-email-complete-signup', verifyEmailAndCompleteSignup);
authRoutes.post('/cleanup-incomplete-users', cleanupIncompleteUsers);
authRoutes.post('/expire-user-trial', expireUserTrial);
// subscription/payment endpoints
authRoutes.get('/subscription-status', getSubscriptionStatus);
authRoutes.post('/payment/confirm', confirmPayment);
authRoutes.post('/cancel-subscription', cancelSubscription);
authRoutes.post('/paypal/create-order', createOrder);
authRoutes.post('/paypal/capture-order', captureOrder);
authRoutes.post('/paypal/cancel-subscription', cancelPayPalSubscription);
export default authRoutes;


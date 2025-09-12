import express from 'express';
import {signup ,signin,update,verifyemail,Gsignup} from '../controller/auth.controller.js'
import { confirmPayment, getSubscriptionStatus } from '../controller/subscription.controller.js'
const authRoutes = express.Router();

// Route to get users
authRoutes.post('/Gsignup', Gsignup);
authRoutes.post('/signup', signup);
authRoutes.put('/update', update);
authRoutes.post('/signin', signin);
authRoutes.post('/verifyemail', verifyemail);
// subscription/payment endpoints
authRoutes.get('/subscription-status', getSubscriptionStatus);
authRoutes.post('/payment/confirm', confirmPayment);
export default authRoutes; 


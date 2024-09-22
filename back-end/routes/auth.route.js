import express from 'express';
import signup from '../controller/auth.controller.js'

const authRoutes = express.Router();

// Route to get users
authRoutes.post('/signup', signup);

export default authRoutes; 
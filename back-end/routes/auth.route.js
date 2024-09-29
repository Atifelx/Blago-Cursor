import express from 'express';
import {signup ,signin} from '../controller/auth.controller.js'
const authRoutes = express.Router();

// Route to get users
authRoutes.post('/signup', signup);
authRoutes.post('/signin', signin);
export default authRoutes; 
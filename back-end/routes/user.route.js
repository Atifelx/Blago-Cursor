
import express from 'express';
import  user  from '../controller/user.controller.js';

const userRoutes = express.Router();

// Route to get users
userRoutes.get('/users', user);

export default userRoutes; 
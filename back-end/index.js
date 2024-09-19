import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';



dotenv.config();

const app = express()
const PORT = process.env.PORT || 4000;



app.use(express.json());






mongoose.connect(process.env.MONGOURI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

  
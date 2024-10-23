import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import AIRoutes from './routes/openAiChat.js';
import cors from 'cors';
// import { createProxyMiddleware } from 'http-proxy-middleware';


dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000;

app.options('*', cors()); // Handles preflight requests for all routes


app.use(express.json());




app.use(cors());

// const corsOptions = {
//   origin: 'http://blago.fun', // Replace with your frontend URL
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
//   credentials: true, // Allow credentials (cookies, authorization headers, etc.)
// };

// app.use(cors(corsOptions)); // Use CORS middleware with the defined options
// app.options('*', cors()); // Optionally, keep this to handle preflight requests









mongoose.connect(process.env.MONGOURI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

  
  app.get('/', (req, res) => {
    res.send('Welcome to Blago, its blago under the Hood! visit:blago.fun to access the app!')
  })


 
  app.use('/api', authRoutes);
  app.use('/api', AIRoutes);

  app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');    /// setting for ignoring console error 
    next();
  });

  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500; // Set status code from error or default to 500
    const message = err.message || "Internal Server Error"; // Set message from error or default message
   

    res.status(statusCode).json({ // Send JSON response
        success: false,
        statusCode,
        message,
      
    });
});




app.listen(PORT ,() => {
  console.log(`Server running at http://localhost:${PORT}`);
});
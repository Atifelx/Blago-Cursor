import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import AIRoutes from './routes/openAiChat.js';
import cors from 'cors';



dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000;


app.use(express.json());


 app.use(cors());


// const allowedOrigins = [
//   'https://blago-nine.vercel.app',
//   'http://localhost:3000/api',
//   'http://localhost:4173/api',
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT'],
//   credentials: true,
// }));





mongoose.connect(process.env.MONGOURI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

  
  app.get('/', (req, res) => {
    res.send('Welcome to Blago, its blago under the Hood! visit:blago.fun to access the app!')
  })


  app.get('/test', (req, res) => {
    res.send('This is texting URL for Blago Backend!')
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
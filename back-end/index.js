import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {getUsers} from './routes/user.route.js';


dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000;



app.use(express.json());






mongoose.connect(process.env.MONGOURI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

  
  app.get('/', (req, res) => {
    res.send('Hello World, how the API')
  })


  app.get('/api', getUsers);

app.listen(PORT ,() => {
  console.log(`Server running at http://localhost:${PORT}`);
});
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

  
  app.get('/test',(req,res)=>{

    res.send({message:'Api is working in index js code!'});
});

app.listen(PORT ,() => {
  console.log(`Server running at http://localhost:${PORT}`);
});
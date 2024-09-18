import express from 'express';
import mongoose from 'mongoose';


const app = express()
const PORT = process.env.PORT || 4000;


app.use(express.json());


const mongoURI = 'mongodb+srv://aatif2003:B9eV5IW1CenQIBzY@cluster0.ejfff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your connection string




mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Simple route
app.get('/', (req, res) => {
    res.send('Hello, Express with MongoDB!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
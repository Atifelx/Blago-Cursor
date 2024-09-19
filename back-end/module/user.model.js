
import { Schema, model } from 'mongoose';

// Define the schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create the model
const User = model('User', userSchema);

export default User;
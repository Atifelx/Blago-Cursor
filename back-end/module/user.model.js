
import { Schema, model } from 'mongoose';

// Define the schema
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false ,default:"12345678" },
  createdAt: { type: Date, default: Date.now },
  photoUrl: { type: String, required: false ,default:"User-URL_for_profile"},

});

// Create the model
const User = model('User', userSchema);

export default User;
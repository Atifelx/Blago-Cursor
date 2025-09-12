
import { Schema, model } from 'mongoose';


// Define the schema
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false ,default:"12345678" },
  createdAt: { type: Date, default: Date.now },
  photoUrl: { type: String, required: false },
  source: { type: String, required: false },
  // EditerData:{type: String, required: false },
  // Subscription / Trial fields
  subscriptionStatus: { type: String, enum: ['trial', 'paid', 'expired', 'unpaid'], default: 'trial' },
  trialStartDate: { type: Date, default: Date.now },
  trialEndDate: { 
    type: Date, 
    default: function() {
      return new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    }
  },
  paidUntil: { type: Date },
  lastPaymentDate: { type: Date },
  plan: { type: String, default: 'pro-monthly' },

});

// Create the model
const User = model('User', userSchema);

export default User;







// import { Schema, model } from 'mongoose';

// // Define the schema
// const userSchema = new Schema({
//   username: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: false, default: "12345678" },
//   createdAt: { type: Date, default: Date.now },
//   photoUrl: { type: String, required: false },
//   source: { type: String, required: false },
  
//   // Payment Status (bare minimum)
//   subscriptionStatus: { 
//     type: String, 
//     enum: ['trial', 'paid', 'unpaid'], 
//     default: 'trial' 
//   },
  
//   // Trial Management
//   trialStartDate: { type: Date, default: Date.now },
//   trialEndDate: { 
//     type: Date, 
//     default: function() {
//       return new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days from now
//     }
//   },
  
//   // PayPal Integration
//   paypalSubscriptionId: { type: String, required: false }, // PayPal subscription ID
//   lastPaymentDate: { type: Date, required: false }
// });

// // Virtual field to check trial days remaining
// userSchema.virtual('trialDaysRemaining').get(function() {
//   if (this.subscriptionStatus !== 'trial') return 0;
//   const now = new Date();
//   const diff = this.trialEndDate - now;
//   return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
// });

// // Method to check if user has access
// userSchema.methods.hasAccess = function() {
//   if (this.subscriptionStatus === 'paid') return true;
//   if (this.subscriptionStatus === 'trial' && new Date() < this.trialEndDate) return true;
//   return false;
// };

// // Create the model
// const User = model('User', userSchema);
// export default User;
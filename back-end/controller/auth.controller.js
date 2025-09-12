import User from "../module/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";



export const signup = async (req, res, next) => {
    const { username , email, password } = req.body;

    if (!username  || !email || (req.body.source !== 'google' && !password)) {
        return next(errorHandler(400, 'All fields are required'));
    }

    try {

        let hashedPassword;

        // Hash password only if it's provided and the signup is not from Google Auth
        if (password) {
            hashedPassword = await bcryptjs.hash(password, 10);
        }



       
       const newUser = new User({
        username,
        email,
        password: hashedPassword || undefined, // set to undefined if no password
        photoUrl: req.body.photoUrl || "User-URL_for_profile", // Handle photo URL for Google Auth
        source: 'Blago',
        subscriptionStatus: 'trial',
        trialStartDate: new Date(),
        trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    });


        await newUser.save();
        res.json({ message: 'Signup Successful...' });






    } catch (error) {
        next(error);
    }
};



export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(errorHandler(400, 'All fields are required'));
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(401, 'Account not found')); // Changed to 401
        }

        if (validUser.source=="google") {
            return next(errorHandler(401, 'Please Continue With Google!')); // Changed to 401
        }


        const validPassword = bcryptjs.compareSync(password, validUser.password);

        if (!validPassword) {
            return next(errorHandler(401, 'Invalid password')); // Changed to 401
        }





        // Derive current subscription state
        const now = new Date();
        let subscriptionStatus = validUser.subscriptionStatus;
        if (validUser.paidUntil && validUser.paidUntil > now) {
            subscriptionStatus = 'paid';
        } else if (now <= (validUser.trialEndDate || now)) {
            subscriptionStatus = 'trial';
        } else {
            subscriptionStatus = 'expired';
        }

        const daysRemaining = (() => {
            const target = subscriptionStatus === 'paid' ? validUser.paidUntil : validUser.trialEndDate;
            if (!target) return 0;
            const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
            return Math.max(0, diff);
        })();

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res
            .status(200)
            .cookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'Strict' }) // Added security options
            .json({ 
                
                message: 'Sign in successful' ,

                user: {
                    id: validUser._id,
                    username : validUser.username ,
                    email: validUser.email,
                    createdAt:validUser.createdAt,
                    photoUrl:validUser.photoUrl,
                    subscriptionStatus,
                    trialEndDate: validUser.trialEndDate,
                    paidUntil: validUser.paidUntil,
                    daysRemaining,
                    // Include other user properties as needed
                }

            });
    } catch (error) {
        next(error);
    }
};


export const update = async (req, res, next) => {
    const {  password, email} = req.body; 

  
    try {
    
        const validUser = await User.findOne({ email });

        if (!validUser) {
            return next(errorHandler(401, 'user data not found')); // Changed to 401
        }

      

        let hashedPassword;

        // Hash password only if it's provided
        if (password) {
            hashedPassword = await bcryptjs.hash(password, 10);
        }

        // Update the existing user
        validUser.password = hashedPassword || validUser.password; // Only update password if provided
      

        await validUser.save(); // Save the updated user

        res.status(200).json({ 
            message: 'Password updated successfully',
            
           
        });
    } catch (error) {
        next(error);
    }
};



export const verifyemail = async (req, res, next) => {
   
    const { email } = req.body;

   

    try {

        const validUser = await User.findOne({ email });
        
        if (!validUser) {
            // Directly return the 400 response with "verify email failed" message
            return res.status(400).json({ 
                success: false,
                message: 'User not found In Blgao',
            });
        }



        const now = new Date();
        let subscriptionStatus = validUser.subscriptionStatus;
        if (validUser.paidUntil && validUser.paidUntil > now) {
            subscriptionStatus = 'paid';
        } else if (now <= (validUser.trialEndDate || now)) {
            subscriptionStatus = 'trial';
        } else {
            subscriptionStatus = 'expired';
        }
        const daysRemaining = (() => {
            const target = subscriptionStatus === 'paid' ? validUser.paidUntil : validUser.trialEndDate;
            if (!target) return 0;
            const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
            return Math.max(0, diff);
        })();

        res.status(200).json({ 
            success: true,
            message: 'verify email successful' ,
            user: {
                id: validUser._id,
                username : validUser.username ,
                email: validUser.email,
                createdAt:validUser.createdAt,
                photoUrl:validUser.photoUrl,
                subscriptionStatus,
                trialEndDate: validUser.trialEndDate,
                paidUntil: validUser.paidUntil,
                daysRemaining,
            }
        });


    } catch (error) {
        next(error);
    }


};

export const Gsignup = async (req, res, next) => {
    const { username, email, photoUrl,  } = req.body;

    try {
        const newUser = new User({
            username,
            email,
            password: '12345678', // Ensure the password is stored securely
            photoUrl,
            source: 'google',
            // initialize trial on google sign up as well
            subscriptionStatus: 'trial',
            trialStartDate: new Date(),
            trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        });

        await newUser.save();

        // Return the saved user data in the response
        res.json({
            message: 'Signup Successful...',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                photoUrl: newUser.photoUrl,
                createdAt: newUser.createdAt, // Include any other fields as needed
            }
        });
    } catch (error) {
        next(error);
    }
};



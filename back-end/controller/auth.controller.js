import User from "../module/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { generateVerificationToken, sendVerificationEmail } from "../utils/emailService.js";

// Database-driven email verification - no memory cache needed



export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || (req.body.source !== 'google' && !password)) {
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

        if (validUser.source == "google") {
            return next(errorHandler(401, 'Please Continue With Google!')); // Changed to 401
        }

        // Check if email is verified for Blago users
        if (validUser.source === 'Blago' && !validUser.isEmailVerified) {
            return next(errorHandler(401, 'Please verify your email before signing in.'));
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

                message: 'Sign in successful',

                user: {
                    id: validUser._id,
                    username: validUser.username,
                    email: validUser.email,
                    createdAt: validUser.createdAt,
                    photoUrl: validUser.photoUrl,
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
    const { password, email } = req.body;


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
            message: 'verify email successful',
            user: {
                id: validUser._id,
                username: validUser.username,
                email: validUser.email,
                createdAt: validUser.createdAt,
                photoUrl: validUser.photoUrl,
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
    const { username, email, photoUrl, } = req.body;

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

// Step 1: Send verification email (email-only signup)
export const initiateEmailVerification = async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(errorHandler(400, 'Email is required'));
    }

    try {
        // FIRST: Check if user already exists in database
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return next(errorHandler(400, 'User already exists with this email. Please sign in instead.'));
        }

        // Generate verification code (6 digits)
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Create temporary user record in database with verification data
        const tempUser = new User({
            email,
            username: '', // Will be filled in step 2
            password: '', // Will be filled in step 2
            source: 'Blago',
            subscriptionStatus: 'trial',
            trialStartDate: new Date(),
            trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            isEmailVerified: false,
            emailVerificationCode: verificationCode,
            emailVerificationExpires: verificationExpires
        });

        await tempUser.save();

        // Send verification email
        await sendVerificationEmail(email, verificationCode);

        console.log('Verification email sent:', {
            email,
            verificationCode,
            userId: tempUser._id
        });

        res.json({
            success: true,
            message: 'Verification email sent successfully',
            userId: tempUser._id
        });

    } catch (error) {
        console.error('Error in initiateEmailVerification:', error);
        next(error);
    }
};

// Step 2: Verify email code and complete registration
export const verifyEmailAndCompleteSignup = async (req, res, next) => {
    const { userId, verificationCode, username, password } = req.body;

    if (!userId || !verificationCode || !username || !password) {
        return next(errorHandler(400, 'All fields are required'));
    }

    try {
        // Find the temporary user in database
        const tempUser = await User.findById(userId);
        if (!tempUser) {
            return next(errorHandler(400, 'Invalid verification request'));
        }

        // Check if verification code matches and hasn't expired
        if (tempUser.emailVerificationCode !== verificationCode) {
            return next(errorHandler(400, 'Invalid verification code'));
        }

        if (new Date() > tempUser.emailVerificationExpires) {
            return next(errorHandler(400, 'Verification code has expired'));
        }

        // Validate username is not empty
        if (!username || username.trim() === '') {
            return next(errorHandler(400, 'Username is required'));
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Update the temporary user to permanent user
        tempUser.username = username.trim();
        tempUser.password = hashedPassword;
        tempUser.isEmailVerified = true;
        tempUser.emailVerificationCode = undefined;
        tempUser.emailVerificationExpires = undefined;

        await tempUser.save();

        console.log('User successfully completed signup:', {
            id: tempUser._id,
            email: tempUser.email,
            username: tempUser.username,
            isEmailVerified: tempUser.isEmailVerified
        });

        res.json({
            success: true,
            message: 'Email verified and account created successfully'
        });

    } catch (error) {
        console.error('Error completing signup:', error);
        next(error);
    }
};

// Database cleanup endpoint - remove incomplete users
export const cleanupIncompleteUsers = async (req, res, next) => {
    try {
        // First, clean up specific problematic emails
        const problematicEmails = ['atif.skelx@gmail.com', 'atif.elx@gmail.com'];
        let cleanedCount = 0;

        for (const email of problematicEmails) {
            const result = await User.deleteMany({
                email: email,
                isEmailVerified: false
            });
            cleanedCount += result.deletedCount;
            if (result.deletedCount > 0) {
                console.log(`Cleaned up ${result.deletedCount} incomplete user(s) for email: ${email}`);
            }
        }

        // Then clean up all other incomplete users
        const result = await User.deleteMany({
            $or: [
                { username: '' },
                { username: { $exists: false } },
                { password: '' },
                { password: { $exists: false } }
            ],
            isEmailVerified: false
        });

        cleanedCount += result.deletedCount;
        console.log(`Total cleaned up ${cleanedCount} incomplete users from database`);

        res.json({
            success: true,
            message: `Cleaned up ${cleanedCount} incomplete users from database`,
            problematicEmailsCleaned: problematicEmails
        });

    } catch (error) {
        console.error('Error cleaning up incomplete users:', error);
        next(error);
    }
};

// Test endpoint - expire user trial for testing payment flow
export const expireUserTrial = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return next(errorHandler(400, 'Email is required'));
        }

        // Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        // Set trial end date to yesterday (expired)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        user.trialEndDate = yesterday;
        user.subscriptionStatus = 'expired';

        await user.save();

        console.log(`Expired trial for user: ${email}`);
        console.log(`New trial end date: ${user.trialEndDate}`);
        console.log(`New subscription status: ${user.subscriptionStatus}`);

        res.json({
            success: true,
            message: `Trial expired for user: ${email}`,
            user: {
                email: user.email,
                username: user.username,
                subscriptionStatus: user.subscriptionStatus,
                trialEndDate: user.trialEndDate,
                daysRemaining: 0
            }
        });

    } catch (error) {
        console.error('Error expiring user trial:', error);
        next(error);
    }
};



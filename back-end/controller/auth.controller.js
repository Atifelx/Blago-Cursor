import User from "../module/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";



// Moved signup export to the top for clarity
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



       // const hashedPassword = await bcryptjs.hash(password, 10);


       // const newUser = new User({ username , email, password: hashedPassword });
       
       const newUser = new User({
        username,
        email,
        password: hashedPassword || undefined, // set to undefined if no password
        photoUrl: req.body.photoUrl || "User-URL_for_profile", // Handle photo URL for Google Auth
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
            return next(errorHandler(401, 'user not found')); // Changed to 401
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(401, 'Invalid password')); // Changed to 401
        }

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
            return next(errorHandler(401, 'user not found')); // Changed to 401
        }



        res
            .status(200)
 
            .json({ 
                
                message: 'verify email successful' ,

                user: {
                  
                    email: validUser.email,
                
                }

            });
    } catch (error) {
        next(error);
    }









};
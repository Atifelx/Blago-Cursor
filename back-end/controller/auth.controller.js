
import User from "../module/user.model.js"
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export  const signup = async(req,res,next)=>
    
    {

   
    const { username, email, password } = req.body;

    if (!username || !email || !password)
        
        {
       next(errorHandler(400,'All field is Required'));
    }



const hashedPassword =bcryptjs.hashSync(password,10);


const newUser = new User({
    username,
    email,
    password:hashedPassword,
});



try {
    await newUser.save();
    res.json('Signup Successful...');
} catch (error) {
    next(error);
}


    }

export default signup;

import User from "../module/user.model.js"
import bcryptjs from "bcryptjs";

export  const signup = async(req,res)=>
    
    {

   
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: 'All fields are required: username, email, and password.',
        });
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
    res.status(500).json({ message: 'Error saving user', error: error.message });
}


    }

export default signup;
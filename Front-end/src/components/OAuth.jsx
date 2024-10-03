import React from 'react';
import { Button } from 'flowbite-react';
import { FaGoogle } from "react-icons/fa6";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useSelector, useDispatch } from 'react-redux';
import { signinSuccess } from '../app/user/userSlice';
import { useNavigate } from "react-router-dom";

function OAuth() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);
   
    const handleGoogleClick = async () => {
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();

        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            const gResult = await signInWithPopup(auth, provider);
            const Guser = gResult.user;
            console.log("User Info from Google:", Guser);

            const userData = {
                username: Guser.displayName || "User_" + Guser.uid, // Fallback if displayName is null
                email: Guser.email,
                photoUrl: Guser.photoURL,
                source: 'google' // Indicate that this user signed up with Google
            };

            // Dispatch to Redux Toolkit
            dispatch(signinSuccess(userData));

            navigate('/createpassword');
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };

    return (
        <Button className="flex items-center mt-2 mb-2 px-4 py-2 bg-gray-400 text-white rounded cursor-pointer text-center" onClick={handleGoogleClick}>
            <FaGoogle className="mr-1.5 text-gray-500 text-xl" />
            Sign Up with Google
        </Button>
    );
}

export default OAuth;

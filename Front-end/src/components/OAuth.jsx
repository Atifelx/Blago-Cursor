import React from 'react';
import { Button } from 'flowbite-react';
import { FaGoogle } from "react-icons/fa6";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useSelector, useDispatch } from 'react-redux';
import { signinSuccess , GuserExist,signinFailure,signout} from '../app/user/userSlice';
import { useNavigate } from "react-router-dom";
import Pop_Component from "../components/Google_popup";
import { FcGoogle } from "react-icons/fc";
const apiUrlG = import.meta.env.VITE_API_BASE_URL;

function OAuth() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);

    const handleGoogleClick = async () => {
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();



  provider.setCustomParameters({ prompt: 'select_account' });

        try {

          const gResult = await signInWithPopup(auth, new GoogleAuthProvider());
          // const gResult = await signInWithPopup(auth, provider);




            const Guser = gResult.user;
            console.log("User Info from Google:", Guser);

            const userData = {
                username: Guser.displayName || 'User', // Fallback if displayName is null
                email: Guser.email,
                photoUrl: Guser.photoURL,
                source: 'google',
            };

            try {

                const response = await fetch(`${apiUrlG }/verifyemail`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({email:Guser.email}) // Ensure the body is an object
                });

                const result = await response.json(); // Get the response as JSON

                if (result.success) {
                   
                setTimeout(() => {
    
                    dispatch(signout());
                }, 1000); 
                 
                    navigate("/signin");  
                    dispatch(GuserExist(false));
                } 
                
                else {


                    dispatch(GuserExist(true));
                  
                    setTimeout(() => {
                       
                        dispatch(signout());
                    }, 1000); 

                       
                        dispatch(signinSuccess(userData)); 
                        navigate('/createpassword');  
    
                }

            } catch (error) {
                console.log("Error during email verification:", error);
            }

        } catch (error) {
            console.log("Error during Google sign-in:", error);
        }
    };

    return (
        <Button 
            className="flex items-center mt-2 mb-2 px-4 py-2 bg-gray-100 border  text-neutral-700 rounded-xl cursor-pointer text-center" 
            onClick={handleGoogleClick}
        >
            <FcGoogle className="mr-1.5 text-xl text-neutral-700" />
            Sign Up with Google
        </Button>
    );
}

export default OAuth;

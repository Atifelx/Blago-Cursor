import React, { useState } from 'react';
import { Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { signinStart, signinSuccess, signinFailure ,signout,errorClear} from '../app/user/userSlice';
import OAuth from "../components/OAuth.jsx";
import { Link } from 'react-router-dom';

const apiUrlS = import.meta.env.VITE_API_BASE_URL;

const SignupForm = () => {
  //const [errorMessage, setErrorMessage] = useState(null); 
// const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  const dispatch = useDispatch();



  const currentUser = useSelector((state) => state.user.currentUser);
  const error = useSelector((state) => state.user.error);
  const loading = useSelector((state) => state.user.loading);



  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value.trim()
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled before proceeding
    if (!formData.username || !formData.email || !formData.password) {
      dispatch(signinFailure({ message: 'Please fill all the fields.' }));
      return;
    }


    dispatch(signinStart());
  



    try {
    


const response = await fetch(`${apiUrlS }/signup`, {

   
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      console.log('Success:', result);


      if (result.success === false) {
        dispatch(signinFailure({ message: result.message || 'Wrong credentials. Please try again.' }));

        // Nested condition to check for duplicate error
        if (result.message && result.message.includes("duplicate")) {
          dispatch(signinFailure({ message: 'You have an account with US, Please Signin!' }));
          navigate("/signin");
        }
        
        return;
      } else {
       // dispatch(signinSuccess(result));

       dispatch(signout);
        // navigate("/signin");

        setTimeout(() => {
         // dispatch(signout);
         dispatch(signinSuccess());
          navigate("/signin");
      }, 1000); // 5000 ms = 5 seconds



      }





  




   
    } catch (error) {
     
      dispatch(signinFailure({ message: error.message || 'An unexpected error occurred.' }));
    } 
  };

  return (
    <form className="mx-w-full max-w-sm p-6 bg-white rounded-sm shadow-sm" onSubmit={handleSubmit}>
 <div className="mb-5">
  <label htmlFor="username" className="mr-4 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Username</label>
  <input
    type="text"
    id="username"
    value={formData.username}
    onChange={handleChange}
    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    placeholder="Your username"
    autoComplete="username" // Ensure this matches the suggestion
    required
  />
</div>

      <div className="mb-5">
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="name@youremail.com" 
          autoComplete="email" 
          required 
        />
      </div>
      <div className="mb-5">
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
        <input
          type="password"
          placeholder="Type your Password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
          required 
          autoComplete="current-password" 
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`text-white ${loading ? 'bg-gray-500' : 'bg-emerald-500 hover:bg-emerald-700'} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
      >
        {loading ? (
          <>
            <Spinner />
            <span>Loading..</span>
          </>
        ) : 'SignUp'}
      </button>

    {/* <OAuth/> */}

      <label htmlFor="signin" className="block mb-2 text-sm font-medium text-gray-400 dark:text-white mt-5">
        Have an account?
        <Link to="/signin" className="text-blue-600 hover:underline">
        <span> Sign In</span>
</Link>

        
      </label>
      
      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 mt-5" role="alert">
          {error.message}
        </div>
      )}
    </form>
  );
};

export default SignupForm;

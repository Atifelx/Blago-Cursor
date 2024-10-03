import React from 'react';
import { Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { signinStart, signinSuccess, signinFailure } from '../app/user/userSlice';
import OAuth from "../components/OAuth.jsx";


const SigninForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.currentUser);
  const error = useSelector((state) => state.user.error);
  const loading = useSelector((state) => state.user.loading);

  const [formData, setFormData] = React.useState({
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
    if (!formData.email || !formData.password) {
      dispatch(signinFailure({ message: 'Please fill all the fields.' }));
      return;
      
    }

    
    
    dispatch(signinStart());


 


    try {
      const response = await fetch('http://localhost:3000/api/signin', 
        
        {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

    
      if (result.success === false) {
        dispatch(signinFailure({ message: result.message || 'Wrong credentials. Please try again.' })
    );                               } 
      
      else {




   

        dispatch(signinSuccess(result)); // sending data to redux tool kit 

        setFormData({ email: '', password: '' });  // clear form data after submission in UI  

        navigate("/");



           }


      


    } catch (error) {
      dispatch(signinFailure({ message: error.message || 'An unexpected error occurred.' }));
      
    } 
  };


  return (
    <form className="mx-auto" onSubmit={handleSubmit}>
      <label className="text-2xl subpixel-antialiased text-gray-400 text-center block">Sign In</label>

      <div className="mb-5">
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full max-w-85"
          placeholder="Enter Your Email"
          autoComplete="email"
          required
        />
      </div>
      <div className="mb-5">
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
        <input
          type="password"
          id="password"
          value={formData.password}
          placeholder="Enter Your Password"
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 max-w-85"
          required
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`text-white ${loading ? 'bg-gray-500' : 'bg-emerald-500 hover:bg-emerald-700'} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 `}
      >
        {loading ? (
          <>
            <Spinner />
            <span>Loading..</span>
          </>
        ) : 'Sign In'}
      </button>
   


   

      <label htmlFor="signin" className="block mb-2 text-sm font-medium text-gray-400 dark:text-white mt-5">
        Don't have an account?
        <a href="/signup" className="text-blue-600 hover:underline">
          <span> SignUp</span>
        </a>
      </label>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          {error.message}
        </div>
      )}

    
    </form>
  );
};

export default SigninForm;

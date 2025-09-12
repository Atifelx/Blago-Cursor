import React, { useEffect } from 'react';
import { Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { signinStart, signinSuccess, signinFailure, GuserExist, errorClear } from '../app/user/userSlice';
const apiUrl = import.meta.env.VITE_API_BASE_URL || '/api';
import { Link } from 'react-router-dom';
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

    dispatch(errorClear());

    if (!formData.email || !formData.password) {
      dispatch(signinFailure({ message: 'Please fill all the fields.' }));
      return;
    }

    dispatch(signinStart());





    try {
      const response = await fetch(`${apiUrl}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        dispatch(signinFailure({ message: result.message || 'Wrong credentials. Please try again.' }));
        return;

      } else {

        dispatch(signinSuccess(result));// Update redux state


        navigate('/dashboard');

        setFormData({ email: '', password: '' }); // Clear form data after submission
        dispatch(errorClear());

      }
    } catch (error) {
      dispatch(signinFailure({ message: error.message || 'An unexpected error occurred.' }));
    }
  };

  useEffect(() => {
    setFormData({ email: '', password: '' });
  }, []);



  return (
    <form className="max-w-sm mx-auto p-6 bg-white rounded-md shadow-sm" onSubmit={handleSubmit}>
      <h2 className="text-2xl text-gray-400 text-center mb-5">Sign In</h2>

      <div className="mb-5">
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Enter Your Email"
          autoComplete="email"
          required
        />
      </div>

      <div className="mb-5">
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Enter Your Password"
          required
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`text-white ${loading ? 'bg-gray-500' : 'bg-emerald-500 hover:bg-emerald-700'} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5`}
      >
        {loading ? (
          <>
            <Spinner />
            <span>Loading..</span>
          </>
        ) : 'Sign In'}
      </button>

      <div className="mt-5 text-center">
        <p className="text-sm font-medium text-gray-500 mr-2">
          Don't have an account?
          <Link to="/signup" className="text-blue-400 hover:underline text-sm ml-2">Sign Up</Link>

        </p>
        <p className="text-sm font-medium text-gray-500 mr-2">
          Forgot password?
          <Link to="/resetpassword" className="text-blue-400 hover:underline text-sm ml-2 ">Reset</Link>

        </p>


      </div>
      <OAuth className="justify-center" />
      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 mt-5" role="alert">
          {error.message}
        </div>
      )}
    </form>
  );
};

export default SigninForm;

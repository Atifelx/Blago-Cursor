import React, { useState, useEffect } from 'react';
import { Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { signinStart, signinSuccess, signinFailure, signout, errorClear } from '../app/user/userSlice';
import OAuth from "../components/OAuth.jsx";
import { Link } from 'react-router-dom';

const apiUrlS = import.meta.env.VITE_API_BASE_URL || '/api';

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.currentUser);
  const error = useSelector((state) => state.user.error);
  const loading = useSelector((state) => state.user.loading);

  // Email verification flow states
  const [signupStep, setSignupStep] = useState(1); // 1: email, 2: verification code + password
  const [verificationData, setVerificationData] = useState({
    userId: '',
    email: ''
  });

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    verificationCode: ''
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
    dispatch(signinStart());

    try {
      if (signupStep === 1) {
        // Step 1: Send verification email
        if (!formData.email) {
          dispatch(signinFailure({ message: 'Please enter your email address.' }));
          return;
        }

        const response = await fetch(`${apiUrlS}/initiate-email-verification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: formData.email })
        });

        const result = await response.json();
        console.log('Email verification initiated:', result);

        if (result.success) {
          setVerificationData({
            userId: result.userId,
            email: formData.email
          });
          setSignupStep(2);
          dispatch(signinSuccess());
        } else {
          dispatch(signinFailure({ message: result.message || 'Failed to send verification email.' }));
        }

      } else if (signupStep === 2) {
        // Step 2: Verify email code and complete signup
        if (!formData.verificationCode || !formData.username || !formData.password) {
          dispatch(signinFailure({ message: 'Please fill all the fields.' }));
          return;
        }

        const response = await fetch(`${apiUrlS}/verify-email-complete-signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: verificationData.userId,
            verificationCode: formData.verificationCode,
            username: formData.username,
            password: formData.password
          })
        });

        const result = await response.json();
        console.log('Email verification completed:', result);

        if (result.success) {
          dispatch(signinSuccess());
          navigate("/signin");
        } else {
          dispatch(signinFailure({ message: result.message || 'Invalid verification code.' }));
        }

      }
    } catch (error) {
      dispatch(signinFailure({ message: error.message || 'An unexpected error occurred.' }));
    }
  };

  const handleBackToEmail = () => {
    setSignupStep(1);
    setFormData(prev => ({
      ...prev,
      verificationCode: '',
      username: '',
      password: ''
    }));
    dispatch(errorClear());
  };

  useEffect(() => {
    setFormData({ email: '', password: '', username: '', verificationCode: '' });
  }, []);

  return (
    <form className="mx-w-full max-w-sm p-6 bg-white rounded-sm shadow-sm" onSubmit={handleSubmit}>

      {/* Step 1: Email Input */}
      {signupStep === 1 && (
        <>
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Your email
            </label>
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
        </>
      )}

      {/* Step 2: Verification Code + Username + Password */}
      {signupStep === 2 && (
        <>
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-sm text-emerald-800">
              <strong>Verification email sent!</strong><br />
              We've sent a 6-digit verification code to <strong>{verificationData.email}</strong>
            </p>
          </div>

          <div className="mb-5">
            <label htmlFor="verificationCode" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Verification Code
            </label>
            <input
              type="text"
              id="verificationCode"
              value={formData.verificationCode}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter 6-digit code"
              maxLength="6"
              required
            />
          </div>

          <div className="mb-5">
            <label htmlFor="username" className="mr-4 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Your Username
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Your username"
              autoComplete="username"
              required
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Your password
            </label>
            <input
              type="password"
              placeholder="Type your Password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="button"
            onClick={handleBackToEmail}
            className="text-gray-600 hover:text-gray-800 text-sm mb-3"
          >
            ← Back to email
          </button>
        </>
      )}

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
        ) : signupStep === 1 ? 'Send Verification Email' : 'Complete Signup'}
      </button>

      <OAuth />

      <label htmlFor="signin" className="block mb-2 text-sm font-medium text-gray-400 dark:text-white mt-5">
        Have an account?
        <Link to="/signin" className="text-blue-500 hover:underline">
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
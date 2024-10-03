import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../app/user/userSlice'; // Adjust the import path
import { useNavigate } from "react-router-dom";
const Spinner = () => (
  <div className="loader">Loading...</div>
);

function CreatePassword() {
  const [formData, setFormData] = useState({ password: '' });
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector(selectCurrentUser); // Get user data from Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Log the password and user data to be submitted
    console.log('Password to be submitted:', formData.password);
    console.log('User data:', currentUser);

    // Prepare data to send to your backend
    const userData = {
      ...currentUser, // Spread currentUser data
      password: formData.password, // Add password
    };

    try {
      const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData), // Send the combined data
      });

      if (response.ok) {
        console.log("User data sent successfully!");

        navigate('/') /// main program 


        // Handle successful signup if needed
      } else {
        const errorData = await response.json();
        console.error("Failed to send user data:", response.statusText, errorData);
      }
    } catch (error) {
      console.error("Error during signup:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="flex-1 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
          <div className="mb-5">
            <label 
              htmlFor="password" 
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Create Your password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`text-white ${loading ? 'bg-gray-500' : 'bg-emerald-500 hover:bg-emerald-700'} focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5`}
          >
            {loading ? (
              <>
                <Spinner />
                <span>Loading..</span>
              </>
            ) : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePassword;

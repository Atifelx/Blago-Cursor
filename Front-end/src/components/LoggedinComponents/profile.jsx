import React from 'react';
import { useSelector } from 'react-redux'; 
import { Button } from "flowbite-react";
const apiUrlP = import.meta.env.VITE_API_BASE_URL;

function Profile() {
  const currentUser = useSelector(state => state.user.currentUser);

  const [success, setSuccess] = React.useState(''); // To handle success messages
  const [formData, setFormData] = React.useState({ password: '' });
  const [error, setError] = React.useState(null);
  const [showPassword, setShowPassword] = React.useState(false); // New state for showing password


  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwrdData = {
      email: currentUser.user.email,
      password: formData.password,
    };

    try {
      const response = await fetch(`${apiUrlP}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwrdData),
      });

      const update = await response.json();
      setSuccess(update.message);
    } catch (error) {
      console.error("Error during password change:", error);
      setError(error.message || 'An error occurred while updating the password.');
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <div className="flex  flex-grow flex-col justify-evenly p-4 bg-white">
      {/* User Image Placeholder */}
      <div className="mb-5 ml-28">


<img 
  src={
    currentUser?.user?.photoUrl && currentUser.user.photoUrl !== "User-URL_for_profile"
      ? currentUser.user.photoUrl
      : `https://eu.ui-avatars.com/api/?size=64&name=${currentUser?.user?.username || 'User'}`
  }
  alt="User"
  className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
/>




      </div>

     
     <div>
      <form className="w-full max-w-sm p-6 bg-white rounded-md shadow-sm" onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
          <input
            type="email"
            id="email"
            value={currentUser.user.email}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
            placeholder="Enter Your Email"
            autoComplete="email"
            readOnly 
          />
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Change Password</label>
          <input
             type={showPassword ? 'text' : 'password'} // Toggle between text and password
            id="password"
            value={formData.password}
            placeholder="Enter Your Password"
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            autoComplete="current-password" 
          />
        </div>

<div className='mb-5'>
        <input
        
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)} // Toggle the state
                className="mr-2"
              />
              <label htmlFor="showPassword" className="text-sm text-neutral-700">Show Password</label>


              </div>


        <Button type="submit">Update</Button>

        {success && (
          <div className="p-4 mb-4 text-sm text-green-500 rounded-lg bg-green-50 mt-5" role="alert">
            {success}
          </div>
        )}
      </form>

      </div>
    </div>
  );
}

export default Profile;

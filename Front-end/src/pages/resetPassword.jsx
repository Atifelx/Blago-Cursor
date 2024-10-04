import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
const Spinner = () => <div className="loader">Loading...</div>;

function CreatePassword() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(''); // To handle success messages
  const [passwordState, setPasswordState] = useState(false); // To handle password state

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    if (passwordState) {
      passwordChange(); // Call passwordChange if passwordState is true
    } else {
      verifyUser(); // Call verifyUser otherwise
    }
  };

  const verifyUser = async () => {                       // Verify User ----------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>
    setLoading(true);
    setSuccess(''); // Clear previous success messages

    const useremail = {
      email: formData.email // Collect email from formData
    };

    try {
      const response = await fetch('http://localhost:3000/api/verifyemail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(useremail)
      });

      const result = await response.json(); // Get the response as JSON

      if (!response.ok) {
        throw new Error(result.message || 'Failed to verify email');
      }

      // Set success message from the result
      setSuccess(result.message); // Assuming API returns a message property
      setPasswordState(true);



    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const passwordChange = async () => {            // passwordChange ----------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>
    
    
    const passwrddata = {
        email:formData.email,
      password: formData.password,
      
    };

    setLoading(true); // Set loading to true

    try {
      const response = await fetch('http://localhost:3000/api/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwrddata), // Send the combined data
      });

      const update = await response.json(); // Get the response as JSON

      if (!response.ok) {
        throw new Error(update.message || 'Failed to update password');
      }

      // Set success message from the result
      setSuccess(update.message); // Assuming API returns a message property






       navigate('/signin'); // Navigate to the main program




    } catch (error) {
      console.error("Error during password change:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen dark:bg-gray-800">
      <div className="flex-1 flex items-center justify-center">
        <div className="p-6">
          <span className='text-[100px] font-extrabold text-gray-400 hover:text-emerald-500'>Blago</span>
          <p className='text-sm text-gray-400 left-5 hover:text-emerald-500'>Create your own Blog and share with Others, Start here!</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <form className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md" onSubmit={handleSubmit}>
          <h2 className="text-base font-extralight mb-2">Verify your Email & create New Password</h2>

          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email} // Bind email state
              onChange={handleChange} // Add onChange handler
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              required
            />
          </div>

          {passwordState && (
            <div className="mb-5">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Create your Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                placeholder="Enter Your Password"
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                autoComplete="current-password"
              />
            </div>
          )}

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
            ) : (passwordState ? 'Update' : 'Verify')}
          </button>

          {success && (
          <div className="mt-5 p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
            {success}
          </div>
        )}


        </form>

       
      </div>
    </div>
  );
}

export default CreatePassword;

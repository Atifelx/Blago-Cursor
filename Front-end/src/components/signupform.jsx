import React from 'react';

const SignupForm = () => {
  return (
    <form className="mx-auto">
      <div className="mb-5">
        <label htmlFor="username" className="mr-4 block mb-2 text-sm font-medium text-gray-900 dark:text-white ">Your Username</label>
        <input 
          type="text" 
          id="username" 
          className="  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 " 
          placeholder="Your username" maxlength="30"
          required 
        />
      </div>
      <div className="mb-5">
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
        <input 
          type="email" 
          id="email" 
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
          placeholder="name@flowbite.com" 
          required maxlength="30"
        />
      </div>
      <div className="mb-5">
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
        <input 
          type="password" 
          id="password" 
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
          required maxlength="30"
        />
      </div>
      <button type="submit" class="text-white bg-emerald-500  hover:bg-emerald-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Signup</button>
      <label htmlFor="signin" className="block mb-2 text-sm font-medium text-gray-400 dark:text-white mt-5"> Have an account ?
      <a href="/signin" className="text-blue-600 hover:underline ">
  <span > Sign In</span>
</a>
      </label>
    </form>
  );
};

export default SignupForm;

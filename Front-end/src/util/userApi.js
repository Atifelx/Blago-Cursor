// userApi.js

export async function updateUser(userId, method, updateData) 

{
    const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(updateData),
    });
  
    if (!response.ok) {
      throw new Error('Failed to update the user');
    }
  
    return response.json();
  }
  

//   import React from 'react';
// import { updateUser } from './userApi'; // Adjust the import path as needed

// const YourComponent = () => {
//   const handleUpdate = async () => {
//     const userId = "1234567890abcdef"; // Replace with the actual user ID
//     const updateData = {
//       name: "New Name",
//       email: "newemail@example.com",
//     };

//     try {
//       const updatedUser = await updateUser(userId, 'PUT', updateData);
//       console.log('User updated successfully:', updatedUser);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleUpdate}>Update User</button>
//     </div>
//   );
// };

// export default YourComponent;

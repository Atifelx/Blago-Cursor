// import { Navbar, Button , Avatar} from "flowbite-react";
// import { Link } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux'; 
// import { signout } from '../app/user/userSlice.js';
// import React, { useState } from 'react';

// export default function Header() {
//   const [isOpen, setIsOpen] = useState(false); 
//   const dispatch = useDispatch();

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   }; 

//   const handleSignOut = () => {
//     dispatch(signout());
//   }

//   const currentUser = useSelector(state => state.user.currentUser);




  
//   return (
//     <div>
//       <Navbar fluid rounded className="justify-items-center bg-gradient-to-br from-emerald-50 via-white to-cyan-50-50">

  

//       {/* bg-emerald-500 */}
//         <Navbar.Brand href="/" >
//         <span className="self-center whitespace-nowrap text-2xl font-semibold text-emerald-500">Blago</span>
 
//         </Navbar.Brand>


//         <Navbar.Collapse >
//           <Navbar.Link as={Link} to="/" style={{ display: currentUser ? 'none' : 'block' }} className="text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-offset-2">Home</Navbar.Link>
//           {/* <Navbar.Link as={Link} to="/projects">Projects</Navbar.Link> */}
//           <Navbar.Link as={Link} to="/signup" style={{ display: currentUser ? 'none' : 'block' }} className="text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50  focus:ring-offset-2"> Sign Up</Navbar.Link>
//         </Navbar.Collapse>


//         {!currentUser && (
//           <Link to="/signin">
//             <Button outline size="lg">Sign In</Button>
//           </Link>
//         )}


//         {currentUser && (
//           <div>
    


// <Avatar 
//   img={
//     currentUser?.user?.photoUrl === "User-URL_for_profile"
//       ? `https://eu.ui-avatars.com/api/?size=64&name=${currentUser?.user?.username || 'User'}`
//       : currentUser?.user?.photoUrl
//   }
//   status="online" 
//   alt="Rounded avatar" 
//   onClick={toggleDropdown} 
//   className="w-10 h-10 rounded-full"
// />



//             {isOpen && (
//               <div className="absolute right-0 z-10 mt-2 w-48 bg-white border rounded shadow-lg">
//                 <div className="py-2 px-4 text-gray-800 text-sm">
//                   <div>{"@"}{currentUser?.user?.username}</div>
//                   <div>{currentUser?.user?.email}</div>
//                 </div>
//                 <div className="border-t border-gray-200"></div>
//                 <div className="py-2">
//                   <button
//                     onClick={() => console.log('Navigating to profile')}
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                   >
//                     Profile
//                   </button>
//                   <button
//                     onClick={handleSignOut}
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                   >
//                     Sign Out
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </Navbar>
//     </div>
//   );
// }


//-----------------------------------------------------------------------------------------------

import { Button, Avatar } from "flowbite-react";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; 
import { signout } from '../app/user/userSlice.js';
import React, { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false); 
  const dispatch = useDispatch();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  }; 

  const handleSignOut = () => {
    dispatch(signout());
  }

  const currentUser = useSelector(state => state.user.currentUser);

  return (
    <header className="w-full relative bg-gradient-to-b from-blue-50  to-purple-50">
          {/* <section className="relative pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50"></section> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-semibold text-emerald-600">Blago</span>
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {!currentUser && (
              <>
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Home
                </Link>
                <Link 
                  to="/signup" 
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Right side - Sign In button or User Avatar */}
          <div className="flex items-center space-x-4">
            {!currentUser ? (
              <Link to="/signin">
                <Button 
                  size="sm"
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign In
                </Button>
              </Link>
            ) : (
              <div className="relative">
                <Avatar 
                  img={
                    currentUser?.user?.photoUrl === "User-URL_for_profile"
                      ? `https://eu.ui-avatars.com/api/?size=40&name=${currentUser?.user?.username || 'User'}`
                      : currentUser?.user?.photoUrl
                  }
                  size="sm"
                  alt="User avatar" 
                  onClick={toggleDropdown} 
                  className="cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 transition-all duration-200"
                />

                {isOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">@{currentUser?.user?.username}</p>
                      <p className="text-sm text-gray-500 truncate">{currentUser?.user?.email}</p>
                    </div>
                    <button
                      onClick={() => console.log('Navigating to profile')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          {!currentUser && (
            <div className="md:hidden">
              <button
                type="button"
                className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition-colors duration-200"
                onClick={() => setIsOpen(!isOpen)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {!currentUser && isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white bg-opacity-50 rounded-lg mt-2">
              <Link 
                to="/" 
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 text-base font-medium transition-colors duration-200"
              >
                Home
              </Link>
              <Link 
                to="/signup" 
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 text-base font-medium transition-colors duration-200"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
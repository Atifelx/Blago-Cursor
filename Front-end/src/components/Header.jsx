import { Navbar, Button , Avatar} from "flowbite-react";
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
    <div>
      <Navbar fluid rounded className="justify-items-center shadow-sm mb-1">


        <Navbar.Brand href="/" >
        <span className="self-center whitespace-nowrap text-2xl font-semibold text-neutral-400">Blago</span>
 
        </Navbar.Brand>


        <Navbar.Collapse >
          <Navbar.Link as={Link} to="/" style={{ display: currentUser ? 'none' : 'block' }}>Home</Navbar.Link>
          {/* <Navbar.Link as={Link} to="/projects">Projects</Navbar.Link> */}
          <Navbar.Link as={Link} to="/signup" style={{ display: currentUser ? 'none' : 'block' }}> Sign Up</Navbar.Link>
        </Navbar.Collapse>


        {!currentUser && (
          <Link to="/signin">
            <Button outline>Sign In</Button>
          </Link>
        )}


        {currentUser && (
          <div>
    


<Avatar 
  img={
    currentUser?.user?.photoUrl === "User-URL_for_profile"
      ? `https://eu.ui-avatars.com/api/?size=64&name=${currentUser?.user?.username || 'User'}`
      : currentUser?.user?.photoUrl
  }
  status="online" 
  alt="Rounded avatar" 
  onClick={toggleDropdown} 
  className="w-10 h-10 rounded-full"
/>



            {isOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 bg-white border rounded shadow-lg">
                <div className="py-2 px-4 text-gray-800 text-sm">
                  <div>{"@"}{currentUser?.user?.username}</div>
                  <div>{currentUser?.user?.email}</div>
                </div>
                <div className="border-t border-gray-200"></div>
                <div className="py-2">
                  <button
                    onClick={() => console.log('Navigating to profile')}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Navbar>
    </div>
  );
}

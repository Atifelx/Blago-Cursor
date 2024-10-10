import { Navbar, Button } from "flowbite-react";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; 
import { signout } from '../app/user/userSlice.js';
import React, { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false); //creating dropdown
  const dispatch = useDispatch();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  }; // toggle button in profile

  const handleSignOut = () => {
    dispatch(signout());
  }

  const currentUser = useSelector(state => state.user.currentUser);

  return (
    <div>
      <Navbar className="border-b-2 w-screen ">
        <Navbar.Brand href="/">
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white text-emerald-500">Blago</span>
        </Navbar.Brand>

        <Navbar.Collapse>
          <Navbar.Link as={Link} to="/" style={{ display: currentUser ? 'none' : 'block' }}>Home</Navbar.Link>
          <Navbar.Link as={Link} to="/about" style={{ display: currentUser ? 'none' : 'block' }}>About</Navbar.Link>
          {/* <Navbar.Link as={Link} to="/dashboard">Dashboard</Navbar.Link> */}
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
            <img 
              className="w-10 h-10 rounded-full" 
              src={currentUser?.user?.photoUrl || '/public/avatar.jpg'} 
              alt="Rounded avatar" 
              onClick={toggleDropdown} 
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

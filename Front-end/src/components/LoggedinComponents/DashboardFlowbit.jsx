import React, { useState } from 'react';
import { Sidebar , Button} from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";
import { Link, useLocation } from 'react-router-dom';
import {  useDispatch } from 'react-redux';





function DashboardFlowbit() {




  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility
  const dispatch = useDispatch();







  return (
    <div>
  

      <Sidebar
        aria-label="Default sidebar example"
        className={`md:block ${isOpen ? 'block' : 'hidden'} transition-all h-screen`} // Toggle sidebar visibility
      >
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item 
              // as={Link} 
              // to="/" 
              icon={HiChartPie} 
              className="text-sm"
              active={location.pathname === '/'}
            >
              Dashboard
            </Sidebar.Item>

            <Sidebar.Item 
              as={Link} 
              to="/profile" 
              icon={HiViewBoards} 
              label="User" 
              labelColor="dark" 
              className="text-sm"
              active={location.pathname === '/profile'}
            >
              Profile
            </Sidebar.Item>

            <Sidebar.Item 
              as={Link} 
              to="/Chat-AI" 
              icon={HiInbox} 
              label="456" 
              className="text-sm"
              active={location.pathname === '/Chat-AI '}
            >
              Chat-Ai
            </Sidebar.Item>

            <Sidebar.Item 
              // as={Link} 
              // to="/users" 
              icon={HiUser} 
              className="text-sm"
              active={location.pathname === '/users'}
            >
              Users
            </Sidebar.Item>

            <Sidebar.Item 
              // as={Link} 
              // to="/products" 
              icon={HiShoppingBag} 
              className="text-sm"
              active={location.pathname === '/products'}
            >
              Products
            </Sidebar.Item>







            
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}

export default DashboardFlowbit;

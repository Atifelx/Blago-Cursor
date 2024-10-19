import React, { useState } from 'react';
import { Sidebar , Button} from "flowbite-react";
import { HiChartPie, HiShoppingBag,HiClipboardList,HiChip ,HiUserCircle} from "react-icons/hi";
import { Link, useLocation } from 'react-router-dom';
import {  useDispatch } from 'react-redux';





function DashboardFlowbit() {




  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility
  const dispatch = useDispatch();







  return (
    <div>
  

      <Sidebar
        aria-label="Blago-sidebar"
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
              icon={HiUserCircle} 
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
              icon={HiChip} 
              // label="456" 
              className="text-sm"
              active={location.pathname === '/Chat-AI'}
            >
              Chat-Ai
            </Sidebar.Item>

            <Sidebar.Item 
              as={Link} 
              to="/Blog-Writer" 
              icon={HiClipboardList} 
              className="text-sm"
              active={location.pathname === '/Blog-Writer'}
            >
              Blog-writer
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

import React, { useState } from 'react';
import { Sidebar , Button} from "flowbite-react";
import { HiChartPie, HiShoppingBag,HiClipboardList,HiChip ,HiUserCircle} from "react-icons/hi";
import { Link, useLocation } from 'react-router-dom';
import {  useDispatch } from 'react-redux';
import { HiAdjustments, HiCloudDownload } from "react-icons/hi";




function DashboardFlowbit() {




  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility
  const dispatch = useDispatch();







  return (


<div className="flex flex-1 flex-col">

<div className="flex flex-1 flex-col lg:hidden sm:block md:hidden text-sm font-light text-neutral-700">

<div className='font-thin  text-sm  p-4 ml-2 mr-2 mb-96 mt-96 border rounded-md bg-gray-50'>
<span>Please Use in the large screen Device , not optimised for Mobile !</span>
  </div>

</div>

<div>
<Sidebar
  aria-label="Blago-sidebar"
  className={`md:block ${isOpen ? 'block' : 'hidden'} transition-all h-screen`} // Toggle sidebar visibility
>
  <Sidebar.Items>
    <Sidebar.ItemGroup>
      <Sidebar.Item 
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
        className="text-sm"
        active={location.pathname === '/Chat-AI'}
      >
        Chat-AI
      </Sidebar.Item>

      <Sidebar.Item 
        as={Link} 
        to="/Blog-Writer" 
        icon={HiClipboardList} 
        className="text-sm"
        active={location.pathname === '/Blog-Writer'}
      >
        Blog Writer
      </Sidebar.Item>

      <Sidebar.Item 
        icon={HiShoppingBag} 
        className="text-sm"
        active={location.pathname === '/products'}
      >
        Plagiarism
      </Sidebar.Item>
      
    </Sidebar.ItemGroup>
  </Sidebar.Items>
</Sidebar>
</div>


</div>





  );
}

export default DashboardFlowbit;

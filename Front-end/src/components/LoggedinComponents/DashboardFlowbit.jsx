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



<div>
<Sidebar
  aria-label="Blago-sidebar"
  className={`md:block ${isOpen ? 'block' : 'hidden'} transition-all h-screen`} // Toggle sidebar visibility
>
  <Sidebar.Items>
    <Sidebar.ItemGroup>
  

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
        Its free !
      </Sidebar.Item>
      
    </Sidebar.ItemGroup>
  </Sidebar.Items>
</Sidebar>
</div>


</div>





  );
}

export default DashboardFlowbit;

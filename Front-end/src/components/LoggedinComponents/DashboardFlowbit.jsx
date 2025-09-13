import React, { useState } from 'react';
import { Sidebar, Button } from "flowbite-react";
import { HiChartPie, HiShoppingBag, HiClipboardList, HiChip, HiUserCircle } from "react-icons/hi";
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiAdjustments, HiCloudDownload } from "react-icons/hi";
import { FaPersonDigging } from "react-icons/fa6";
import { FaBrain } from "react-icons/fa";
import { MdManageAccounts, MdOutlinePayment } from "react-icons/md";
import { MdArticle } from "react-icons/md";
import { IoDocumentAttach } from "react-icons/io5";
import { Lock } from "lucide-react";


function DashboardFlowbit() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.currentUser);

  // Check if user has expired subscription
  const isExpired = currentUser?.user?.subscriptionStatus === 'expired' || currentUser?.user?.subscriptionStatus === 'unpaid';

  // Helper function to render sidebar items with disabled state
  const renderSidebarItem = (to, icon, children, active = false) => {
    const isDisabled = isExpired && to !== '/Pay';

    if (isDisabled) {
      return (
        <div className="flex items-center px-2 py-2 text-gray-400 cursor-not-allowed">
          <div className="flex items-center">
            {React.createElement(icon, { className: "w-5 h-5 mr-3" })}
            <span className="text-sm">{children}</span>
            <Lock className="w-3 h-3 ml-2" />
          </div>
        </div>
      );
    }

    return (
      <Sidebar.Item
        as={Link}
        to={to}
        icon={icon}
        className="text-sm"
        active={active}
      >
        {children}
      </Sidebar.Item>
    );
  };







  return (


    <div className="flex flex-1 flex-col">



      <div>
        <Sidebar
          aria-label="Blago-sidebar"
          className={`md:block ${isOpen ? 'block' : 'hidden'} transition-all h-screen`} // Toggle sidebar visibility
        >
          <Sidebar.Items>
            <Sidebar.ItemGroup>


              {renderSidebarItem("/Chat-AI", FaBrain, "Blog-AI", location.pathname === '/Chat-AI')}

              {renderSidebarItem("/Web-Scrapper", FaPersonDigging, "Web Scrapping", location.pathname === '/Web-Scrapper')}

              {renderSidebarItem("/Blog-Writer", HiClipboardList, "AI Editer", location.pathname === '/Blog-Writer')}

              {renderSidebarItem("/DOC-AI", IoDocumentAttach, "Doc-AI", location.pathname === '/DOC-AI')}

              {renderSidebarItem("/Essay-AI", MdArticle, "Essay-AI", location.pathname === '/Essay-AI')}


              {/* Removed stale Subcriptions menu item */}



              {renderSidebarItem("/Pay", MdManageAccounts, "Pay", location.pathname === '/Pay')}



            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>


    </div>





  );
}

export default DashboardFlowbit;

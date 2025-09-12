import React, { useState } from 'react';
import { Sidebar, Button } from "flowbite-react";
import { HiChartPie, HiShoppingBag, HiClipboardList, HiChip, HiUserCircle } from "react-icons/hi";
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { HiAdjustments, HiCloudDownload } from "react-icons/hi";
import { FaPersonDigging } from "react-icons/fa6";
import { FaBrain } from "react-icons/fa";
import { MdManageAccounts, MdOutlinePayment } from "react-icons/md";
import { MdArticle } from "react-icons/md";
import { IoDocumentAttach } from "react-icons/io5";


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
                icon={FaBrain}
                className="text-sm"
                active={location.pathname === '/Chat-AI'}
              >
                Blog-AI
              </Sidebar.Item>



              <Sidebar.Item
                as={Link}
                to="/Web-Scrapper"
                icon={FaPersonDigging}
                className="text-sm"
                active={location.pathname === '/Web-Scrapper'}
              >
                Web Scrapping
              </Sidebar.Item>


              <Sidebar.Item
                as={Link}
                to="/Blog-Writer"
                icon={HiClipboardList}
                className="text-sm"
                active={location.pathname === '/Blog-Writer'}
              >
                AI Editer
              </Sidebar.Item>

              <Sidebar.Item
                as={Link}
                to="/DOC-AI"
                icon={IoDocumentAttach}
                className="text-sm"
                active={location.pathname === '/DOC-AI'}
              >
                Doc-AI
              </Sidebar.Item>



              <Sidebar.Item
                as={Link}
                to="/Essay-AI"
                icon={MdArticle}
                className="text-sm"
                active={location.pathname === '/DOC-AI'}
              >
                Essay-AI
              </Sidebar.Item>


              {/* Removed stale Subcriptions menu item */}



              <Sidebar.Item
                as={Link}
                to="/Pay"
                icon={MdManageAccounts}
                className="text-sm"
                active={location.pathname === '/Pay'}
              >
                Pay
              </Sidebar.Item>



            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>


    </div>





  );
}

export default DashboardFlowbit;

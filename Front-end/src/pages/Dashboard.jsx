import { useSelector } from 'react-redux'; 
import { useLocation } from 'react-router-dom';
import DashboardFlowbit from '../components/LoggedinComponents/DashboardFlowbit';
import Profile from '../components/LoggedinComponents/profile';
import ChatComponent from '../components/LoggedinComponents/AiChatDefault';
import EditorComponent from '../components/LoggedinComponents/Intial.editer'
import WebScrapper from '../components/LoggedinComponents/customtool/scrap';

function Dashboard() {
  const location = useLocation();
  const currentUser = useSelector(state => state.user.currentUser);

  return (
 

<div className="flex flex-row sm:w-auto">  {/* Main container of dashboard */}
  <div>
    <DashboardFlowbit />
  </div> 

  <div className="flex-grow"> 
    {location.pathname === '/profile' && <Profile />}
    {location.pathname === '/Chat-AI' && <ChatComponent />}
    {location.pathname === '/Blog-Writer' && <EditorComponent />}
    {location.pathname === '/Web-Scrapper' && <WebScrapper />}
  </div>
</div>



  );
}

export default Dashboard;

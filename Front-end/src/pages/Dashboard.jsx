import { useSelector } from 'react-redux'; 
import { useLocation } from 'react-router-dom';
import DashboardFlowbit from '../components/LoggedinComponents/DashboardFlowbit';
import Profile from '../components/LoggedinComponents/profile';
import ChatComponent from '../components/LoggedinComponents/AiChatDefault';

function Dashboard() {
  const location = useLocation();
  const currentUser = useSelector(state => state.user.currentUser);

  return (
    <div className="flex flex-row sm:w-auto">  {/* Main container of dashboard */}
      <div >
        <DashboardFlowbit />
      </div> 

      <div className="flex-grow"> {/* Adjusted for more space for profile */}
        {/* {location.pathname === '/profile' && <Profile />} Render Profile if path matches */}
        {location.pathname === '/profile' ? <Profile /> : null}
        <div > {/* Adjusted for more space for profile */}
        {location.pathname === '/Chat-AI'? <ChatComponent/>: null} {/* Render Profile if path matches */}
      </div>

      </div>

      
      
    </div>
  );
}

export default Dashboard;

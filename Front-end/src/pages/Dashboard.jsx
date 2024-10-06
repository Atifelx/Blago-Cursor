import react from 'react';
import { useSelector } from 'react-redux'; 
import DashboardUIO from '../components/LoggedinComponents/DashboardUIO';
import DashboardUI from '../components/LoggedinComponents/dashboardUI';


function Dashboard() {

  const currentUser = useSelector(state => state.user.currentUser);

  return (
    <div>

    {/* <div className='ml-5 font-extralight '>
      Welcome , {currentUser?.user?.username} {" "} !
    </div> */}
    
    
    <DashboardUIO />
    {/* <DashboardUI/> */}

    </div>
  )
}

export default Dashboard

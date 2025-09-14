import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import DashboardFlowbit from '../components/LoggedinComponents/DashboardFlowbit';
import Profile from '../components/LoggedinComponents/profile';
import ChatComponent from '../components/LoggedinComponents/AiChatDefault';
import EditorComponent from '../components/LoggedinComponents/Intial.editer'
import WebScrapper from '../components/LoggedinComponents/customtool/scrap';
import DOCgen from '../components/LoggedinComponents/customtool/DocGen';
import EssayAI from '../components/LoggedinComponents/customtool/essayai';
import SubscriptionStatus from '../components/LoggedinComponents/SubscriptionStatus';
import PaymentRestriction from '../components/LoggedinComponents/PaymentRestriction';
import Pay from './pay';





function Dashboard() {
  const location = useLocation();
  const currentUser = useSelector(state => state.user.currentUser);

  // Check if user has active subscription
  const hasActiveSubscription = currentUser?.user &&
    (currentUser.user.subscriptionStatus === 'paid' ||
      currentUser.user.subscriptionStatus === 'trial');

  // Check if user has expired subscription
  const hasExpiredSubscription = currentUser?.user &&
    (currentUser.user.subscriptionStatus === 'expired' ||
      currentUser.user.subscriptionStatus === 'unpaid');

  // For Pay route, show subscription status if user has active subscription, otherwise show payment form
  const renderPayPage = () => {
    if (location.pathname === '/Pay') {
      return hasActiveSubscription ? <SubscriptionStatus /> : <Pay />;
    }
    return null;
  };

  return (
    <div className="flex flex-row sm:w-auto relative bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">  {/* Main container of dashboard */}
      <div>
        <DashboardFlowbit />
      </div>

      <div className="flex-grow bg-white/50 backdrop-blur-sm">
        {location.pathname === '/profile' && <Profile />}
        {location.pathname === '/Chat-AI' && <ChatComponent />}
        {location.pathname === '/Blog-Writer' && <EditorComponent />}
        {location.pathname === '/Web-Scrapper' && <WebScrapper />}
        {location.pathname === '/DOC-AI' && <DOCgen />}
        {location.pathname === '/Essay-AI' && <EssayAI />}
        {renderPayPage()}
      </div>

      {/* Payment Restriction Overlay - only show for expired users on non-payment pages */}
      {hasExpiredSubscription && location.pathname !== '/Pay' && (
        <PaymentRestriction user={currentUser?.user} />
      )}
    </div>
  );
}

export default Dashboard;

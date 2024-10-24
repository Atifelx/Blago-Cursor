
import React from 'react';
import { BrowserRouter as Router, Routes, Route , Navigate} from 'react-router-dom';
import { useSelector } from 'react-redux'; 




import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Footer from './components/footer.jsx';
import Createpassword from './pages/createpassword.jsx';
import Resetpassword from './pages/resetPassword';
import Profile from './components/LoggedinComponents/profile.jsx'

const App = () => {


  const currentUser = useSelector(state => state.user.currentUser);

  // const initialState = {
  //   currentUser:null,
  //   error:null,
  //   loading:false
  // }
  //------------------------------------
  //  const userSlice = createSlice({
    
  //   name: 'user',
  //   initialState,

  //-----------------------------------------
  // signinSuccess:(state,action)=>{
  //   state.currentUser = action.payload;
  //   state.loading=false;
  //   state.error=null;

  //<EditorComponent />


  return (
<Router>
  <Header />
  <Routes>

     
  {!currentUser && ( 
      <>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/resetpassword" element={<Resetpassword />} />
        {/* <Route path="*" element={<Navigate to="/signin" />} />  */}
      </>
  
  )}  

     {currentUser && ( 
      <>
      <Route path= "/createpassword" element={<Createpassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Dashboard />} />
        <Route path="/Chat-AI" element={<Dashboard />} />
        <Route path="/Blog-Writer" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/dashboard" />} /> Redirect all other routes to /dashboard
      </>
     )}

  </Routes>
  <Footer />
</Router>

  );
};

export default App;

import {React}from 'react'
import SigninForm from '../components/signinform';
import Pop_Component from "../components/Google_popup";
import { useSelector } from 'react-redux';
import {  GuserExist} from '../app/user/userSlice';

function Signin() {


  const userExist = useSelector((state) => state.user.userExist);


  return (



      <div className="min-h-screen mt-20 flex flex-col md:flex-row " >
   



<div className="basis-1/2 ml-10 mr-10 mb-5 items-center h-screen "> {/* Logo span */}
  <span className='text-[100px] font-extrabold text-neutral-400 hover:text-emerald-500 '>Blago</span>
  <p className='text-sm text-neutral-400 left-5 hover:text-emerald-500 '>"Meet Blago: Your go-to AI writing assistant! Get instant answers, seamlessly transfer search results, and effortlessly rewrite sentences. Create and export documents in seconds—perfect for eBooks, research, and interviews. Streamline your resumes and cover letters with ease. Experience writing like never before with Blago!"
</p>

</div> {/* Logo span */}

<div className="basis-1/2 ml-10 mr-10 mb-5 items-center "> {/* signup input */}
<SigninForm/>
<div> {userExist && <Pop_Component />} </div>
           </div>

</div>

  )
}

export default Signin;

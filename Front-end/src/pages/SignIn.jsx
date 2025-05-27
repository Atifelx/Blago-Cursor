// import {React}from 'react'
// import SigninForm from '../components/signinform';
// import Pop_Component from "../components/Google_popup";
// import { useSelector } from 'react-redux';
// import {  GuserExist} from '../app/user/userSlice';

// function Signin() {


//   const userExist = useSelector((state) => state.user.userExist);


//   return (



//       <div className="min-h-screen mt-20 flex flex-col md:flex-row bg-white">
   



// <div className="basis-1/2 ml-10 mr-10 mb-5 items-center h-screen "> {/* Logo span */}
//   <span className='text-[100px] font-extrabold  text-emerald-500 hover:text-emerald-400 '>Blago</span>
//   <p className='font-thin text-neutral-400 left-5 hover:text-neutral-600 '>"Meet Blago: Your AI writing assistant for instant answers and effortless document creation. Transform search results, rewrite with ease, and streamline your resumes and eBooks in seconds!"
// </p>

// </div> {/* Logo span */}

// <div className="basis-1/2 ml-10 mr-10 mb-5 items-center "> {/* signup input */}
// <SigninForm/>
// <div> {userExist && <Pop_Component />} </div>
//            </div>

// </div>

//   )
// }

// export default Signin;


//---------------------------------------------------

import React from 'react'
import SigninForm from '../components/signinform';
import Pop_Component from "../components/Google_popup";
import { useSelector } from 'react-redux';
import { GuserExist } from '../app/user/userSlice';

function Signin() {
  const userExist = useSelector((state) => state.user.userExist);

  return (
    <section className="relative pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="min-h-screen mt-20 flex flex-col md:flex-row">
        <div className="basis-1/2 ml-10 mr-10 mb-5 items-center h-screen"> {/* Logo span */}
          <span className='text-[100px] font-extrabold text-emerald-500 hover:text-emerald-400'>Blago</span>
          <p className='font-thin text-neutral-800 left-5 hover:text-neutral-900'>
            "Meet Blago: Your AI writing assistant for instant answers and effortless document creation. Transform search results, rewrite with ease, and streamline your resumes and eBooks in seconds!"
          </p>
        </div> {/* Logo span */}

        <div className="basis-1/2 ml-10 mr-10 mb-5 items-center"> {/* signup input */}
          <SigninForm/>
          <div> 
            {userExist && <Pop_Component />} 
          </div>
        </div>
      </div>
    </section>
  )
}

export default Signin;

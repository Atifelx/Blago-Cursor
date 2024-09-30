import {React}from 'react'
import SigninForm from '../components/signinform';



function Signin() {
  return (

      <div className="min-h-screen mt-20 flex flex-col md:flex-row " >


<div className="basis-1/2 ml-10 mr-10 mb-5 items-center h-screen "> {/* Logo span */}
  <span className='text-[100px] font-extrabold text-gray-400 hover:text-emerald-500 '>Blago</span>
  <p className='text-sm text-gray-400 left-5 hover:text-emerald-500 '>Create your own Blog and share with Others, Start here!</p>
</div> {/* Logo span */}

<div className="basis-1/2 ml-10 mr-10 mb-5 items-center "> {/* signup input */}
<SigninForm/>
           </div>

</div>

  )
}

export default Signin;

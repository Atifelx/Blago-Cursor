// import React from 'react';
// import Signupform from '../components/signupform';

// function SignUp() {
//   return (


//     <div className="min-h-screen mt-20 flex flex-col md:flex-row ">


//       <div className="basis-1/2 ml-10 mr-10 mb-5 items-center h-screen"> {/* Logo span */}
//         <span className='text-[100px] font-extrabold text-emerald-500  hover:text-emerald-400 '>Blago</span>
//         <p className='font-thin text-neutral-400 left-5 hover:text-neutral-600 '>Introducing Blago, your ultimate AI tool for effortless writing! With Blago, you can search anything and get instant responses through its built-in chat AI. Transfer search results directly to the editor and easily re-write your sentences.
// Create and export documents in a flash, whether you're drafting Kindle eBooks, research articles, or preparing for interviews. Blago streamlines resume and cover letter creation, making it a must-have for bloggers and writers alike. Experience fast, efficient, and versatile writing like never before!
// </p>
//       </div> {/* Logo span */}

//       <div className="basis-1/2 ml-10 mr-10 mb-5 items-center "> {/* signup input */}
//        <Signupform/>
//                  </div>

//     </div>
//   );
// }

// export default SignUp;

// // flex flex-col md:flex-row

//-----------------------------------------------------------------------------------------



import React from 'react';
import Signupform from '../components/signupform';

function SignUp() {
  return (
    <section className="relative pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="min-h-screen mt-20 flex flex-col md:flex-row">
        <div className="basis-1/2 ml-10 mr-10 mb-5 items-center h-screen"> {/* Logo span */}
          <span className='text-[100px] font-extrabold text-emerald-500 hover:text-emerald-400'>Blago</span>
          <p className='font-thin text-neutral-800 left-5 hover:text-neutral-900'>
         
         Meet Blago — your AI-powered writing sidekick!
Search, chat, rewrite, and create all in one place.
Draft eBooks, articles, resumes, and more—fast.
          </p>
        </div> {/* Logo span */}

        <div className="basis-1/2 ml-10 mr-10 mb-5 items-center"> {/* signup input */}
          <Signupform/>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
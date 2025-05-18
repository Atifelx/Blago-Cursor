// import { Link } from 'react-router-dom';
// import HeaderComponent from './hero';
// import EditorComponent from '../components/LoggedinComponents/Intial.editer';

// function Home() {
//   return (
    
// <div>


// <section className="pt-12 bg-gray-50 sm:pt-16">
//         <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
//           <div className="max-w-2xl mx-auto text-center">
//             <h1 className="px-6 text-lg text-gray-600 font-inter">AI-powered writing tool for bloggers, writers, and text editors, offering an easy way to convert your text into documents.</h1>
//             <p className="mt-5 text-4xl font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:text-6xl lg:leading-tight font-pj">
//             Inspire, Craft, Publish—With a Touch of 
//               <span className="relative inline-flex sm:inline">
//                 <span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
//                 <span className="relative"> AI Magic.</span>
//               </span>
//             </p>

//             <div className="px-8 sm:items-center sm:justify-center sm:px-0 sm:space-x-5 sm:flex mt-9">
//       <Link
//         to="/signup"
//         title="Try Now"
//         className="inline-flex items-center justify-center w-full px-8 py-3 text-lg font-bold text-white transition-all duration-200 bg-emerald-500 border-2 border-transparent sm:w-auto rounded-xl font-pj hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
//         role="button"
//       >
//         Experience It for Yourself—Try Now!
//       </Link>
//     </div>

//             <p className="mt-8 text-base text-gray-500 font-inter">Free to use—no credit card needed!</p>
//           </div>
//         </div>

//         <div className="pb-12 bg-white">
//           <div className="relative">
//             <div className="absolute inset-0 h-2/3 bg-gray-50"></div>
//             <div className="relative mx-auto">
//               <div className="lg:max-w-6xl lg:mx-auto">
           
 
 
//     <EditorComponent />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>


// </div>




//   );
// }

// export default Home;

//------------------------------------------ New page design------------------------------


import { Link } from 'react-router-dom';
import HeaderComponent from './hero';
import EditorComponent from '../components/LoggedinComponents/Intial.editer';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="pt-16 pb-8 sm:pt-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Tagline */}
            <div className="inline-block px-4 py-2 mb-6 text-2xl font-medium text-emerald-600 bg-indigo-50 rounded-full">
              AI-Powered Writing Assistant
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">AI-powered writing tool for bloggers,writers, and text editors!</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400  to-emerald-800">
              
              Rewrite Like Human !
              </span>
            </h1>
            

            <p className="mt-6 text-xl text-gray-600">
  Select text &gt; click AI icon &gt; tap <code>AI WRITE</code> to rewrite it.
</p>
<p className="mt-2 text-2xl">
  <span className="text-yellow-500 font-semibold">Paste</span> the text in the editor and test the <span className="text-red-500 font-semibold">demo feature!</span>
</p>


        
          </div>
        </div>
      </section>

     
      {/* Editor Section */}
      <section className="py-12">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
  
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mx-auto">
            <div className="flex justify-center w-full">
              <EditorComponent />
            </div>
          </div>
          

           {/* Value Proposition Section */}
      
         
        </div>
      </section>




    </div>
  );
}

export default Home;
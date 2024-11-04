import { Link } from 'react-router-dom';
import HeaderComponent from './hero';


function Home() {
  return (
    
<div>


<section className="pt-12 bg-gray-50 sm:pt-16">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="px-6 text-lg text-gray-600 font-inter">AI-powered writing tool for bloggers, writers, and text editors, offering an easy way to convert your text into documents.</h1>
            <p className="mt-5 text-4xl font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:text-6xl lg:leading-tight font-pj">
            Inspire, Craft, Publish—With a Touch of 
              <span className="relative inline-flex sm:inline">
                <span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
                <span className="relative"> AI Magic.</span>
              </span>
            </p>

            <div className="px-8 sm:items-center sm:justify-center sm:px-0 sm:space-x-5 sm:flex mt-9">
      <Link
        to="/signup"
        title="Try Now"
        className="inline-flex items-center justify-center w-full px-8 py-3 text-lg font-bold text-white transition-all duration-200 bg-emerald-500 border-2 border-transparent sm:w-auto rounded-xl font-pj hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
        role="button"
      >
        Experience It for Yourself—Try Now!
      </Link>
    </div>

            <p className="mt-8 text-base text-gray-500 font-inter">Free to use—no credit card needed!</p>
          </div>
        </div>

        <div className="pb-12 bg-white">
          <div className="relative">
            <div className="absolute inset-0 h-2/3 bg-gray-50"></div>
            <div className="relative mx-auto">
              <div className="lg:max-w-6xl lg:mx-auto">
           
                <div className="relative w-3/4 h-auto mx-auto"> 
      <span className="bg-gradient-to-r from-[#50C878] via-[#FF44EC] to-[#FF675E] blur-lg filter opacity-50 w-full h-full absolute inset-0" /> {/* Increased opacity */}
      <video
        controls
        autoPlay
        loop
        muted
        className="rounded-2xl shadow-2xl border border-gray-300 mt-5 relative z-10 w-full h-auto"
      >
        <source src="/demo.mp4" type="video/mp4" /> 
        Your browser does not support the video tag.
      </video>
    </div>
 

              </div>
            </div>
          </div>
        </div>
      </section>


</div>




  );
}

export default Home;

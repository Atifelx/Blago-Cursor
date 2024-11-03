import React, { useState } from 'react';

const HeaderComponent = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-x-hidden bg-gray-50">
      <header className="py-4 md:py-6">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <a href="#" title="" className="flex rounded outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-2">
                <img className="w-auto h-8" src="https://cdn.rareblocks.xyz/collection/clarity/images/logo.svg" alt="" />
              </a>
            </div>

            <div className="flex lg:hidden">
              <button
                type="button"
                className="text-gray-900"
                onClick={() => setExpanded(!expanded)}
                aria-expanded={expanded}
              >
                {!expanded ? (
                  <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>

            <div className="hidden lg:flex lg:ml-16 lg:items-center lg:justify-center lg:space-x-10 xl:space-x-16">
              <a href="#" title="" className="text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"> Features </a>
              <a href="#" title="" className="text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"> Pricing </a>
              <a href="#" title="" className="text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"> Automation </a>
            </div>

            <div className="hidden lg:ml-auto lg:flex lg:items-center lg:space-x-10">
              <a href="#" title="" className="text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"> Customer Login </a>
              <a
                href="#"
                title=""
                className="inline-flex items-center justify-center px-6 py-3 text-base font-bold leading-7 text-white transition-all duration-200 bg-gray-900 border border-transparent rounded-xl hover:bg-gray-600 font-pj focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                role="button"
              >
                Sign up
              </a>
            </div>
          </div>

          {expanded && (
            <nav>
              <div className="px-1 py-8">
                <div className="grid gap-y-7">
                  <a href="#" title="" className="flex items-center p-3 -m-3 text-base font-medium text-gray-900 transition-all duration-200 rounded-xl hover:bg-gray-50 focus:outline-none font-pj focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"> Features </a>
                  <a href="#" title="" className="flex items-center p-3 -m-3 text-base font-medium text-gray-900 transition-all duration-200 rounded-xl hover:bg-gray-50 focus:outline-none font-pj focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"> Pricing </a>
                  <a href="#" title="" className="flex items-center p-3 -m-3 text-base font-medium text-gray-900 transition-all duration-200 rounded-xl hover:bg-gray-50 focus:outline-none font-pj focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"> Automation </a>
                  <a href="#" title="" className="flex items-center p-3 -m-3 text-base font-medium text-gray-900 transition-all duration-200 rounded-xl hover:bg-gray-50 focus:outline-none font-pj focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"> Customer Login </a>
                  <a
                    href="#"
                    title=""
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-bold leading-7 text-white transition-all duration-200 bg-gray-900 border border-transparent rounded-xl hover:bg-gray-600 font-pj focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                    role="button"
                  >
                    Sign up
                  </a>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

  
    </div>
  );
};

export default HeaderComponent;

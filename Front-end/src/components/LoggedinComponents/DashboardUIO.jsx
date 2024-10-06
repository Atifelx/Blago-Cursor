import React from 'react';
import { useSelector } from 'react-redux'; 



function DashboardUIO() {

    const currentUser = useSelector(state => state.user.currentUser);

  return (
  



    <div className="flex ">
      <div className="w-40 h-screen bg-gray-100 p-1 rounded-xl shadow-xl text-gray-700 top-auto text-sm font-light">
      

      <div>
        <div className='ml-2 font-extralight text-sm mb-8'>
      Welcome , {currentUser?.user?.username} {" "} !
    </div>


        <div className="space-y-2 top-10">



          <div className="  p-1 hover:text-gray-500 transition ">
            <a href="#item1">Item 1</a>
          </div>


          <div className="  p-1 hover:text-gray-500  transition ">
            <a href="#item1">Item 2</a>
          </div>

          <div className="  p-1 hover:text-gray-500  transition ">
            <a href="#item1">Item 3</a>
          </div>
    
        </div>
      </div>
      <div className="flex-1 p-3">
        {/* Main content goes here */}
        <p>context area </p>
      </div>
    </div>
  




    </div>
  )
}

export default DashboardUIO

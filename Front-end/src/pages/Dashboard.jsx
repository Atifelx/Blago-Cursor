import React from 'react'
import { useSelector } from 'react-redux'; 


function Dashboard() {

  const currentUser = useSelector(state => state.user.currentUser);

  return (
    <div className='ml-5 font-extralight '>
      Welcome , {currentUser?.user?.username} {" "} !
    </div>
  )
}

export default Dashboard

import React from 'react'
import { useState } from 'react';







function Test3() {

    const [people, SetPeople] = useState([]);

const handleAPi =async()=>{


try {
    

const response = await fetch("https://swapi.dev/api/people/");

const data = await response.json();

SetPeople(data.results);


} catch (error) {
    console.log("Error encountered ")
}



}

  return (
    <div>
      <p >Get list of data from an API</p>
      <button classNameName='bg-orange-500 border-x-2' onClick={handleAPi}>Click</button>
      <div>{
        
        people.map((person)=>(<div>{person.name}</div>))
        }
        </div>


 





    </div>
  )
}

export default Test3

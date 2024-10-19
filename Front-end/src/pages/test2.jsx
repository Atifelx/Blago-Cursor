import React, { useState } from 'react';



//https://swapi.dev/api/people/
function Test2() {

const [data,Setdata]=useState('');

const HandleClick = async()=>{

  try {

    const data = await fetch('https://swapi.dev/api/people/');
    const response =await data.json();
    Setdata(response.results)
    console.log(response.results[0]);
    
  } catch (error) {
    console.log("fetch error");
  }


}

 

  return (
    <div>
    <div>get the list of item</div>
    <button onClick={HandleClick}> Get the list from API</button>
    <div>{data.map((item)=>(<div>{item.name}</div>))}</div>
    </div>
  
  );
}

export default Test2;







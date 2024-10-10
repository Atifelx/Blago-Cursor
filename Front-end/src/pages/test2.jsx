import React, { useState } from 'react';

function Test2() {
  const [people, setPeople] = useState([]);

  const handleData = async () => {
    try {
      const response = await fetch("https://swapi.dev/api/people/");
      const data = await response.json();
      setPeople(data.results); // Set the people to data.results
    } catch (error) {
      console.log("Error while fetching the API:", error);
    }
  };

  return (
    <div>
      <p>Get the data from an API</p>
      <button onClick={handleData} className=' bg-slate-500'>Get</button>
      {/* <div>
        {people.map((person, index) => (
          <div key={index}>{person.name}</div> // Render each person's name
        ))}
      </div> */}

<div>
    {
      people.map((person)=>(<div>person.name</div>)  )
    }
</div>
    </div>
  );
}

export default Test2;







import { React }from 'react'
// import './styles/App.css';

// import '../../App.css'


import EditorComponent from './Intial.editer';

function Editer() {

   


  return (
    <div>

    <div className="flex flex-1  w-screen h-screen" >
  
    <div className="App flex flex-1 justify-center text-neutral-700 w-screen sm:w-auto">
      <EditorComponent />
    </div>

    </div>

    </div>
  )
}

export default Editer

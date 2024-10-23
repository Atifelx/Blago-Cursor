import React from 'react'
import hero from '../assets/blago.webp';


//backgroundImage: `url(${hero})`,

function Home() {
  return (
 
 

<div className="hero bg-base-200 min-h-screen flex flex-row">
  <div className="flex-1 hidden md:block"></div> {/* Empty space on the left, hidden on small screens */}
  
  <div className="hero-content flex-1 flex justify-center items-center text-left max-w-md mx-auto">
    <div className="text-center"> {/* Center text within the content */}
      <h1 className="text-5xl font-bold">Blago</h1>
      <p className="py-6">
        "Meet Blago: Your go-to AI writing assistant! Get instant answers, seamlessly transfer search results, and effortlessly rewrite sentences. Create and export documents in seconds—perfect for eBooks, research, and interviews. Streamline your resumes and cover letters with ease. Experience writing like never before with Blago!"
      </p>
      <a href="/signup" className="btn bg-emerald-500">Get Started</a>
    </div>
  </div>
</div>






//------------------------------------


 


















  )
}

export default Home



// Introducing Blago, your ultimate AI tool for effortless writing! With Blago, you can search anything and get instant responses through its built-in chat AI. Transfer search results directly to the editor and easily re-write your sentences.
// Create and export documents in a flash, whether you're drafting Kindle eBooks, research articles, or preparing for interviews. Blago streamlines resume and cover letter creation, making it a must-have for bloggers and writers alike. Experience fast, efficient, and versatile writing like never before!



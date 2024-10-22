import React from 'react'
import hero from '../assets/blago.webp';


//backgroundImage: `url(${hero})`,

function Home() {
  return (
 
 

<div
  className="hero min-h-screen"
  style={{
    backgroundImage: `url(${hero})`,
  }}>
  <div className="hero-overlay bg-opacity-70 bg-blend-saturation"></div>
  <div className="hero-content text-neutral-content text-center">
    <div className="max-w-md">
      <h1 className="mb-5 text-5xl font-bold text-neutral-50">Blago</h1>
      <p className="mb-5 text-xl text-neutral-50">
      "Meet Blago: Your go-to AI writing assistant! Get instant answers, seamlessly transfer search results, and effortlessly rewrite sentences. Create and export documents in seconds—perfect for eBooks, research, and interviews. Streamline your resumes and cover letters with ease. Experience writing like never before with Blago!"
      </p>
      <a href="/signup" className="btn bg-emerald-500 ">Get Started</a>

    </div>
  </div>
</div>



  )
}

export default Home



// Introducing Blago, your ultimate AI tool for effortless writing! With Blago, you can search anything and get instant responses through its built-in chat AI. Transfer search results directly to the editor and easily re-write your sentences.
// Create and export documents in a flash, whether you're drafting Kindle eBooks, research articles, or preparing for interviews. Blago streamlines resume and cover letter creation, making it a must-have for bloggers and writers alike. Experience fast, efficient, and versatile writing like never before!



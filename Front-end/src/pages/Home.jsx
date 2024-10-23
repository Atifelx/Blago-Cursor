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
  <div className="hero-overlay bg-opacity-20"></div>
  <div className="hero-content text-neutral-content text-center">
    <div className="max-w-md">
      <h1 className="mb-5 text-5xl font-bold">Blago</h1>
      <p className="mb-5">
      Transform your thoughts into words effortlessly. Our tool harnesses AI to search and generate any content you need, allowing you to convert it into DOC format or copy it directly to your clipboard. Whether it’s for eBooks, articles, or personal projects, get ready to elevate your writing game!
      </p>

<Link to="/signup">
            <Button >Get Started!</Button>
          </Link>

    </div>
  </div>
</div>






  )
}

export default Home



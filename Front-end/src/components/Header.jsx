import { Navbar , Button} from "flowbite-react";
import { Link } from 'react-router-dom';


export default function Header() {

 

  return (
    <div>
      <Navbar className="border-b-2 ">
      <Navbar.Brand href="/">
      <img src="/public/blago.svg" className="mr-3 h-8 sm:h-14" alt="blago Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Blago</span>
      </Navbar.Brand>
      


      <form>
      <input type="search" id="default-search" className="flex sm:hidden w-full p-2 ps-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50" placeholder="Search ..."  />
      </form>


   



      <Navbar.Collapse>
      <Navbar.Link 
        as={Link}  to="/" >
        Home
      </Navbar.Link>
      <Navbar.Link 
        as={Link} 
        to="/about" 
       
      >
        About
      </Navbar.Link>
      <Navbar.Link 
        as={Link} 
        to="/dashboard" 
       
      >
        Dashboard
      </Navbar.Link>
      <Navbar.Link 
        as={Link} 
        to="/projects" 
      
      >
        Projects
      </Navbar.Link>
      <Navbar.Link 
        as={Link} 
        to="/signup" 
 
      >
        Sign Up
      </Navbar.Link>
    </Navbar.Collapse>
        <Link to="/signin"><Button outline >Sign In</Button>
        </Link>

        
    </Navbar>



    </div>
  );
}

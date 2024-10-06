import { Navbar, Button } from "flowbite-react";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; 


export default function Header() {


  const currentUser = useSelector(state => state.user.currentUser);

  return (
    <div>
      <Navbar className="border-b-2 m-4">
        <Navbar.Brand href="/">
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white text-emerald-500">Blago</span>
        </Navbar.Brand>

   

        <Navbar.Collapse>
          {/* <Navbar.Link as={Link} to="/">Home</Navbar.Link> */}
          {/* <Navbar.Link as={Link} to="/about">About</Navbar.Link> */}
          {/* <Navbar.Link as={Link} to="/dashboard">Dashboard</Navbar.Link> */}
          {/* <Navbar.Link as={Link} to="/projects">Projects</Navbar.Link> */}
          <Navbar.Link as={Link} to="/signup" style={{ display: currentUser ? 'none' : 'block' }}> Sign Up</Navbar.Link>

         </Navbar.Collapse>


         {!currentUser && (
        <Link to="/signin">
          <Button outline >Sign In</Button>
        </Link>
        )}

<img className="w-10 h-10 rounded-full" src={currentUser?.user?.photoUrl || '/public/avatar.jpg'} alt="Rounded avatar"/>
      </Navbar>
    </div>
  );
}

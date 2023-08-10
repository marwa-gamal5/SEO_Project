import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import styles from './NavBar.module.css'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import swal from 'sweetalert';
import Swal from 'sweetalert2';

function NavBar() {
  const navigate = useNavigate();
    let token = localStorage.getItem("token")
  // Function to handle logout
const handleLogout = () => {
 // Remove the token from local storage
 localStorage.removeItem('token');
 // Redirect the user to the login page
 
 Swal.fire({
  position: 'cinter',
  icon: 'success',
  title: 'Successfully Logged Out.',
  showConfirmButton: false,
  timer: 1500
})
 navigate('/');
};
  return (
    <>
    
    <Navbar collapseOnSelect expand="lg" className={`${styles.navbar}`}>
      <Container>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link}  style= {{color : 'white'}} to="/">Home Page</Nav.Link>
          </Nav>
          <Nav>
           {token? (   
            <Button variant="secondary" onClick={handleLogout} className={`${styles.button}`}>
            <i className="fa-solid fa-right-from-bracket"></i>
         </Button>):(
            <>
             <Nav.Link as={Link} style= {{color : 'white'}}  to="/login">Login</Nav.Link>
             <Nav.Link as={Link}  style= {{color : 'white'}}  to="/signup">Sign Up</Nav.Link>
            </>
           )}
           
          
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  );
}

export default NavBar;
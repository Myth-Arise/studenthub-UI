// import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import { Link } from 'react-router-dom';

// function NavigationBar() {
//   return (
//     <>
//       <Navbar bg="dark" data-bs-theme="dark">
//         <Container>
//           <Navbar.Brand href="#home">Navbar</Navbar.Brand>
//           <Nav className="me-auto">
//             <Nav.Item> <Link to="/">Home</Link></Nav.Item>
//             <Nav.Item> <Link to="/login">Login</Link></Nav.Item>
//             <Nav.Item> <Link to="/sign-up">Sign-Up</Link></Nav.Item>
//             <div style={{color:"white",cursor:"pointer"}} onClick={() => {localStorage.removeItem("token");window.location.href = "/login"}}> LogOut</div>
//           </Nav>
//         </Container>
//       </Navbar>
//     </>
//   );
// }

// export default NavigationBar;
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function NavigationBar() {

const isAuntheticated = localStorage.getItem("token") !== null;


  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" expand="md" className="py-3">
        <Container>
          <Navbar.Brand as={Link} to="/" style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
            StudentHub
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar-nav" />
          <Navbar.Collapse id="main-navbar-nav">
            <Nav className="ms-auto align-items-center" style={{ gap: "1.5rem" }}>
              <Nav.Item>
                <Link to="/" className="nav-link px-3">Home</Link>
              </Nav.Item>
              {!isAuntheticated && <Nav.Item>
                <Link to="/login" className="nav-link px-3">Login</Link>
              </Nav.Item>}
              {!isAuntheticated && <Nav.Item>
                <Link to="/sign-up" className="nav-link px-3">Sign-Up</Link>
              </Nav.Item>}
              <Nav.Item>
                <span
                  className="nav-link px-3"
                  style={{ color: "white", cursor: "pointer" }}
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                  }}
                >
                  LogOut
                </span>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavigationBar;
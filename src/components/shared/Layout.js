import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

function Layout(props) {
  return (
    <div>
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          {/* Use an img tag with the path to the image in the public folder */}
          <Navbar.Brand>
            Uhr-App
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
        </Container>
      </Navbar>
      <Container>{props.children}</Container>
    </div>
  );
}

export default Layout;

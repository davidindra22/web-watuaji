import { useState, useEffect, useRef } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { navLinks } from "../data/index";
import { NavLink, Link } from "react-router-dom";

const NavarComponent = () => {
  const [changeColor, setChangeColor] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State to track navbar collapse
  const collapseRef = useRef(null); // Ref for Navbar.Collapse

  const changeBackgroundColor = () => {
    if (window.scrollY > 10) {
      setChangeColor(true);
    } else {
      setChangeColor(false);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen); // Toggle collapse state
  };

  const handleClickOutside = (event) => {
    if (collapseRef.current && !collapseRef.current.contains(event.target)) {
      setIsOpen(false); // Close Navbar.Collapse if clicked outside
    }
  };

  const handleMenuClick = () => {
    setIsOpen(false); // Close Navbar.Collapse when a menu item is clicked
  };

  useEffect(() => {
    changeBackgroundColor();
    window.addEventListener("scroll", changeBackgroundColor);

    // Add event listener for clicks outside the navbar collapse
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Cleanup event listeners on component unmount
      window.removeEventListener("scroll", changeBackgroundColor);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Navbar expand="lg" className={changeColor ? "color-active" : ""}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="fs-3 fw-bold">
          <img src="/assets/img/logo.png" alt="watu aji" className="img-logo" />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={handleToggle} // Toggle on click
        />
        <Navbar.Collapse
          ref={collapseRef}
          id="basic-navbar-nav"
          in={isOpen} // Control collapse state
        >
          <Nav className="mx-auto text-center">
            {navLinks.map((link) => {
              return (
                <div className="nav-link" key={link.id}>
                  <NavLink
                    to={link.path}
                    className={({ isActive, isPending }) =>
                      isPending ? "pending" : isActive ? "active" : ""
                    }
                    end
                    onClick={handleMenuClick} // Close collapse when a menu item is clicked
                  >
                    {link.text}
                  </NavLink>
                </div>
              );
            })}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavarComponent;

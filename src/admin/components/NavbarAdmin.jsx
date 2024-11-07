import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Container } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import "../dist/admin.css";
// import { navLinks } from "../data/index";
// import { NavLink } from "react-router-dom";

const NavbarAdmin = ({ toggleSidebar }) => {
  return (
    <Navbar className="NavbarAdmin">
      <Container>
        <button className="hamburger-menu" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <Navbar.Brand className="logo-admin" href="">
          <img
            src="src\assets\img\logo.png"
            className="d-inline-block align-top"
            alt="Logo Watu Aji"
          />
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <button>
            <Link to="/logout" className="btn-logout d-flex align-items-center">
              <i className="fa fa-sign-out" aria-hidden="true"></i> log out
            </Link>
          </button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarAdmin;

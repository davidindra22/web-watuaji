import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaStore, FaNewspaper, FaSignOutAlt } from "react-icons/fa";
import "../dist/SidebarAdmin.css";

const SidebarAdmin = ({ isOpen }) => {
  return (
    <div className={`sidebar-admin ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <img
          src="/assets/img/logo.png"
          alt="Logo Watu Aji"
          className="img-logo mb-3"
        />
        <h4>Admin Panel</h4>
      </div>
      <div className="sidebar-menu mt-4">
        <ul className="list-unstyled">
          <li className="py-2 px-4">
            <Link
              to="/appAdmin/dashboard"
              className="d-flex align-items-center"
            >
              <FaHome className="me-2" /> Dashboard
            </Link>
          </li>
          <li className="py-2 px-4">
            <Link
              to="/appAdmin/adminWisata"
              className="d-flex align-items-center"
            >
              <FaHome className="me-2" /> Wisata
            </Link>
          </li>
          <li className="py-2 px-4">
            <Link
              to="/appAdmin/adminUmkm"
              className="d-flex align-items-center"
            >
              <FaStore className="me-2" /> UMKM
            </Link>
          </li>
          <li className="py-2 px-4">
            <Link
              to="/appAdmin/adminView"
              className="d-flex align-items-center"
            >
              <FaNewspaper className="me-2" /> Pengunjung
            </Link>
          </li>
          <li className="py-2 px-4">
            <Link
              to="/appAdmin/adminBerita"
              className="d-flex align-items-center"
            >
              <FaNewspaper className="me-2" /> Berita
            </Link>
          </li>
          <li className="py-2 px-4">
            <Link
              to="/appAdmin/adminBooking"
              className="d-flex align-items-center"
            >
              <FaNewspaper className="me-2" /> Booking
            </Link>
          </li>
          <li className="py-2 px-4">
            <Link
              to="/appAdmin/adminProfil"
              className="d-flex align-items-center"
            >
              <FaHome className="me-2" /> Profil
            </Link>
          </li>
          <li className="py-2 px-4">
            <Link to="/logout" className="d-flex align-items-center">
              <FaSignOutAlt className="me-2" /> Log out
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarAdmin;

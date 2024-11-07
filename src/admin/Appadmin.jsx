import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dist/admin.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import NavbarAdmin from "./components/NavbarAdmin";
import SidebarAdmin from "./components/Sidebar";
import AdminWisata from "./Pages/AdminWisata";
import AdminUmkm from "./Pages/AdminUmkm";
import AdminView from "./Pages/AdminView";
import AdminBerita from "./Pages/AdminBerita";
import AdminBooking from "./Pages/AdminBooking";
import AdminProfil from "./Pages/AdminProfil";
import FooterAdmin from "./components/FooterAdmin";
import api from "../api";

const AppAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        await api.get("/api/check-session");
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
    };

    // Periksa sesi saat komponen di-mount
    checkSession();

    // Periksa sesi secara periodik setiap 5 menit
    const intervalId = setInterval(checkSession, 5 * 60 * 1000);

    // Bersihkan interval saat komponen di-unmount
    return () => clearInterval(intervalId);
  }, [navigate]);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className={`app-admin ${isSidebarOpen ? "" : "sidebar-closed"}`}>
      <SidebarAdmin isOpen={isSidebarOpen} />
      <div className="content flex-grow-1">
        <NavbarAdmin toggleSidebar={toggleSidebar} />
        <div className="container-fluid">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="adminWisata" element={<AdminWisata />} />
            <Route path="adminUmkm" element={<AdminUmkm />} />
            <Route path="adminView" element={<AdminView />} />
            <Route path="adminBerita" element={<AdminBerita />} />
            <Route path="adminBooking" element={<AdminBooking/>}/>
            <Route path="adminProfil" element={<AdminProfil/>}/>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
        <FooterAdmin />
      </div>
    </div>
  );
};

export default AppAdmin;

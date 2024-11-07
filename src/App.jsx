import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";

import NavbarComponent from "./components/NavbarComponent";
import FooterComponent from "./components/FooterComponent";

import HomePage from "./Pages/HomePage";
import WisataPage from "./Pages/WisataPage";
import UmkmPage from "./Pages/UmkmPage";
import SejarahPage from "./Pages/SejarahPage";
import BeritaPage from "./Pages/Berita";
import DetailPage from "./Pages/DetailPage";
import DetailUmkmPage from "./Pages/DetailUmkmPage";
import DetailBeritaPage from "./Pages/DetailBeritaPage";
import LoginAdmin from "./admin/login";
import AppAdmin from "./admin/Appadmin";
import PrivateRoute from "./PrivateRoute";
import Logout from "./components/Logout";
// import AdminWisata from "./admin/Pages/AdminWisata";

function App() {
  const location = useLocation();
  const adminRoutes = [
    "/loginAdmin",
    "/appAdmin",
    "/appAdmin/dashboard",
    "/appAdmin/adminWisata",
    "/appAdmin/adminUmkm",
    "/appAdmin/adminView",
    "/appAdmin/adminBerita",
    "/appAdmin/adminBooking",
    "/appAdmin/adminProfil",
  ];
  const isAdminRoute = adminRoutes.includes(location.pathname);

  useEffect(() => {
    const recordPageView = async () => {
      try {
        await axios.post("https://api.wisatawatuaji.com/api/page-views");
      } catch (error) {
        console.error("Error recording page view:", error);
      }
    };

    const hasRecordedPageView = sessionStorage.getItem("hasRecordedPageView");

    if (!isAdminRoute && !hasRecordedPageView) {
      recordPageView();
      sessionStorage.setItem("hasRecordedPageView", "true");
    }
  }, [location, isAdminRoute]);

  return (
    <div>
      {!isAdminRoute && <NavbarComponent />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="/detailUmkm/:id" element={<DetailUmkmPage />} />
        <Route path="/detailBerita/:id" element={<DetailBeritaPage />} />
        <Route path="/wisata" element={<WisataPage />} />
        <Route path="/umkm" element={<UmkmPage />} />
        <Route path="/sejarah" element={<SejarahPage />} />
        <Route path="/berita" element={<BeritaPage />} />
        <Route path="/loginAdmin" element={<LoginAdmin />} />
        <Route
          path="/appAdmin/*"
          element={<PrivateRoute element={AppAdmin} />}
        />
        <Route path="/logout" element={<Logout />} />
      </Routes>

      {!isAdminRoute && <FooterComponent />}
    </div>
  );
}

export default App;

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ScrollToTop from "./components/scrollToTop.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "./dist/css/main.css";
import "animate.css";
import "leaflet/dist/leaflet.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import AOS from "aos";
import "aos/dist/aos.css";
AOS.init();

import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

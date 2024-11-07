import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Impor CSS di sini

const MapContainer = () => {
  useEffect(() => {
    let map = L.map("map");

    // Periksa apakah peta sudah ada dan hapus instance sebelumnya
    if (map) {
      map.remove();
    }

    // Inisialisasi peta
    map = L.map("map").setView([-6.5144873, 110.8914306], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([-6.5144873, 110.8914306])
      .addTo(map)
      .bindPopup(
        "Balai Desa Watuaji Kecamatan Keling, Jepara, Jawa Tengah, Indonesia."
      )
      .openPopup();

    // Membersihkan instance peta saat komponen unmount
    return () => {
      map.remove();
    };
  }, []);

  return (
    <>
      <div id="map" style={{ height: "200px", width: "100%" }}></div>
    </>
  );
};

export default MapContainer;

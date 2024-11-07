import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";

const WisataPage = () => {
  const [wisataList, setWisataList] = useState([]);
  let navigate = useNavigate();

  // Ambil semua data wisata
  useEffect(() => {
    axios
      .get("https://api.wisatawatuaji.com/wisata")
      .then((response) => {
        const transformedWisata = response.data.map((item, index) => ({
          id: item.id_wisata,
          // image: item.foto_wisata1,
          image: `https://api.wisatawatuaji.com/uploads/${item.foto_wisata1}`,
          star1: "fa fa-star",
          star2: "fa fa-star",
          star3: "fa fa-star",
          star4: "fa fa-star",
          star5: "fa fa-star",
          title: item.nama_wisata,
          singkat: item.singkat_wisata,
          price: item.tiket_wisata,
          buy: "Lihat Detail",
          delay: index * 100,
        }));
        setWisataList(transformedWisata);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div className="kelas-page">
      <div className="kelas min-vh-100">
        <Container>
          <Row>
            <Col>
              <h1 className="fw-bold text-center animate__animated animate__fadeInUp animate__delay-1s">
                Jelajahi Keindahan Desa Watu Aji
              </h1>
              <p className="text-center animate__animated animate__fadeInUp animate__delay-1s">
                Temukan pesona alam yang memukau di sini. Ayo, rencanakan
                perjalananmu dan nikmati pengalaman berlibur yang tak terlupakan
                di destinasi menakjubkan ini.
              </p>
            </Col>
          </Row>
          <Row>
            {wisataList.length > 0 ? (
              wisataList.map((wisata) => (
                <Col
                  key={wisata.id}
                  className="shadow rounded"
                  data-aos="fade-up"
                  data-aos-duration="800"
                  data-aos-delay={wisata.delay}
                >
                  <img
                    src={wisata.image}
                    alt={wisata.title}
                    className="mb-3 mt-3 rounded"
                  />
                  <div className="star mb-2 px-3">
                    <i className={wisata.star1}></i>
                    <i className={wisata.star2}></i>
                    <i className={wisata.star3}></i>
                    <i className={wisata.star4}></i>
                    <i className={wisata.star5}></i>
                  </div>
                  <h5 className="mb-3 px-3">{wisata.title}</h5>
                  <p className="px-3">{wisata.singkat}</p>
                  <div className="ket d-flex justify-content-between align-items-center px-3 pb-3">
                    <p className="m-0 text-primary fw-bold">
                      {formatRupiah(wisata.price)}
                    </p>
                    <button
                      className="btn btn-danger rounded-1"
                      onClick={() => navigate(`/detail/${wisata.id}`)}
                    >
                      {wisata.buy}
                    </button>
                  </div>
                </Col>
              ))
            ) : (
              <div className="alert-berita text-center p-5 animate__animated animate__fadeInUp">
                <h3>Tidak ada Wisata</h3>
              </div>
            )}
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default WisataPage;

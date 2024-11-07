import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
// import { umkm } from "../data/index";

const UmkmPage = () => {
  const [umkmList, setUmkmList] = useState([]);
  let navigate = useNavigate();

  // Ambil semua data wisata
  useEffect(() => {
    axios
      .get("https://api.wisatawatuaji.com/umkm")
      .then((response) => {
        const transformedUmkm = response.data.map((item, index) => ({
          id: item.id_umkm,
          // image: item.foto_umkm,
          image: `https://api.wisatawatuaji.com/uploads/${item.foto_umkm1}`,
          star1: "fa fa-star",
          star2: "fa fa-star",
          star3: "fa fa-star",
          star4: "fa fa-star",
          star5: "fa fa-star",
          title: item.nama_umkm,
          singkat: item.singkat_umkm,
          price: item.harga_umkm,
          buy: "Buy Now",
          delay: index * 100,
        }));
        setUmkmList(transformedUmkm);
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
    <div className="umkm-page">
      <div className="umkm min-vh-100">
        <Container>
          <Row>
            <Col>
              <h1 className="text-center fw-bold animate__animated animate__fadeInUp animate__delay-1s">
                Beragam UMKM di Desa Watu Aji
              </h1>
              <p className="text-center animate__animated animate__fadeInUp animate__delay-1s">
                Berbagai macam pilihan produk lokal yang berkualitas, enak,
                lezat, dan bergizi tersedia untuk dinikmati.
              </p>
            </Col>
          </Row>
          <Row>
            {umkmList.length > 0 ? (
              umkmList.map((umkm) => (
                <Col
                  key={umkm.id}
                  className="shadow rounded"
                  data-aos="fade-up"
                  data-aos-duration="800"
                  data-aos-delay={umkm.delay}
                >
                  <img
                    src={umkm.image}
                    alt={umkm.title}
                    className="mb-3 mt-3 rounded"
                  />
                  <div className="star mb-2 px-3">
                    <i className={umkm.star1}></i>
                    <i className={umkm.star2}></i>
                    <i className={umkm.star3}></i>
                    <i className={umkm.star4}></i>
                    <i className={umkm.star5}></i>
                  </div>
                  <h5 className="mb-3 px-3">{umkm.title}</h5>
                  <p className="px-3">{umkm.singkat}</p>
                  <div className="ket d-flex justify-content-between align-items-center px-3 pb-3">
                    <p className="m-0 text-primary fw-bold">
                      {formatRupiah(umkm.price)}
                    </p>
                    <button
                      className="btn btn-danger rounded-1"
                      onClick={() => navigate(`/detailUmkm/${umkm.id}`)}
                    >
                      {umkm.buy}
                    </button>
                  </div>
                </Col>
              ))
            ) : (
              <div className="alert-berita text-center p-5 animate__animated animate__fadeInUp">
                <h3>Tidak ada UMKM</h3>
              </div>
            )}
            {/* {umkmList.map((umkm) => {
              return (
                
              );
            })} */}
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default UmkmPage;

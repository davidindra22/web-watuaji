import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Col, Row, Carousel } from "react-bootstrap";

function DetailPage() {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    axios
      .get(`https://api.wisatawatuaji.com/umkm/${id}`)
      .then((response) => {
        setDetail(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
        setError(error);
      });
  }, [id]);

  if (error) {
    return <p>There was an error fetching the data!</p>;
  }

  if (!detail) {
    return <div>Data tidak ada</div>;
  }

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  // link menuju wa pesan tiket
  const handlePurchase = () => {
    const umkmName = encodeURIComponent(detail.nama_umkm); // Menggunakan nama wisata dari data Umkm
    const message = `Saya mau pesan ${umkmName} ini`;

    // Ganti nomor WhatsApp sesuai dengan yang inginkan
    const whatsappUrl = `https://wa.me/${detail.no_hpumkm}?text=${message}`;

    window.open(whatsappUrl, "_blank");
  };

  const shareOnFacebook = () => {
    const url = window.location.href;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const shareOnWhatsApp = () => {
    const messageUrl = `${window.location.href}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      messageUrl
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const photos = [
    detail.foto_umkm1,
    detail.foto_umkm2,
    detail.foto_umkm3,
    detail.foto_umkm4,
    detail.foto_umkm5,
  ].filter((foto) => foto);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(angka);
  };

  return (
    //
    <div className="Detail-page">
      <div className="detail min-vh-100">
        <Container>
          <Row className="align-items-start">
            <Col md={8} className="img-col">
              <Carousel>
                {photos.map((photo, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100"
                      src={`https://api.wisatawatuaji.com/uploads/${photo}`}
                      alt={`Slide ${index}`}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
              <h2 className="fw-bold">{detail.nama_umkm}</h2>
              <div className={`description ${showMore ? "show" : ""}`}>
                <p>{detail.desc_umkm}</p>
              </div>
              <button onClick={toggleShowMore} className="btn btn-primary">
                {showMore ? "Tutup" : "Selengkapnya"}
              </button>
            </Col>
            <Col md={4} className="side-bar px-5 py-3">
              <h3>Harga mulai dari</h3>
              <h3 className="m-0 text-primary fw-bold">
                {formatRupiah(detail.harga_umkm)}
              </h3>
              <button
                className="btn btn-danger rounded-1"
                onClick={handlePurchase}
              >
                <i className="fa-solid fa-shop"></i> Beli Sekarang
              </button>
              <Row className="mt-4 mb-4 border-top border-2 border-dark">
                <h3 className="mt-4">Bagikan Wisata</h3>
                <div className="share ">
                  <Col>
                    <button
                      className="btn btn-primary rounded-5"
                      onClick={shareOnFacebook}
                    >
                      <i className="fab fa-facebook-f"></i> Share
                    </button>
                  </Col>
                  <Col>
                    <button
                      className="btn btn-success rounded-5"
                      onClick={shareOnWhatsApp}
                    >
                      <i className="fab fa-whatsapp"></i> Share
                    </button>{" "}
                  </Col>
                </div>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default DetailPage;

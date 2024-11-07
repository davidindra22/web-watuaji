import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { Container, Col, Row, Carousel, Modal, Button } from "react-bootstrap";

function DetailPage() {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false); // Pindahkan ke sini untuk memastikan urutan hooks konsisten
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    axios
      .get(`https://api.wisatawatuaji.com/wisata/${id}`)
      .then((response) => {
        setDetail(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
        setError(error);
      });

    axios
      .get(`https://api.wisatawatuaji.com/reservasi`)
      .then((response) => {
        console.log(response.data);
        setReservations(response.data); // store full reservation data including descriptions
      })
      .catch((err) => console.error("Error fetching reserved dates", err));
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

  const handlePurchase = () => {
    const wisataName = encodeURIComponent(detail.nama_wisata);
    const message = `Saya mau pesan tiket untuk ${wisataName}`;

    const whatsappUrl = `https://wa.me/${detail.nohp_wisata}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareOnFacebook = () => {
    const url = `https://api.wisatawatuaji.com/detail/${id}`;
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

  // Show description for reserved dates
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const formattedDate = date.toISOString().split("T")[0];

      const reservation = reservations.find((res) => {
        const resDate = res.tanggal_reservasi.split("T")[0];
        return resDate === formattedDate;
      });

      if (reservation) {
        return <div className="dot"></div>;
      }
    }

    return null;
  };

  const handleDateClick = (date) => {
    const formattedDate = date.toISOString().split("T")[0];

    const reservation = reservations.find((reservation) => {
      const resDate = reservation.tanggal_reservasi.split("T")[0];
      return resDate === formattedDate; 
    });

    setSelectedReservation(reservation || null);
    handleShow();
  };

  const photos = [
    detail.foto_wisata1,
    detail.foto_wisata2,
    detail.foto_wisata3,
    detail.foto_wisata4,
    detail.foto_wisata5,
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
              <h2 className="fw-bold">{detail.nama_wisata}</h2>
              <div className={`description ${showMore ? "show" : ""}`}>
                {detail.desc_wisata.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <button onClick={toggleShowMore} className="btn btn-primary">
                {showMore ? "Tutup" : "Selengkapnya"}
              </button>
            </Col>
            <Col md={4} className="side-bar px-3 py-3">
              <h3>Harga mulai dari</h3>
              <h3 className="m-0 text-primary fw-bold">
                {formatRupiah(detail.tiket_wisata)}
              </h3>
              <button
                className="btn btn-danger rounded-1"
                onClick={handlePurchase}
              >
                <i className="fa-solid fa-shop"></i> Beli Sekarang
              </button>
              <Row className="mt-4 mb-4 border-top border-bottom border-2 border-dark">
                <h3 className="mt-4">Bagikan Wisata</h3>
                <div className="share mb-4">
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
                    </button>
                  </Col>
                </div>
              </Row>
              <Container>
                <div className="kalender">
                  <h3>Kalender Reservasi</h3>
                  <Calendar
                    // tileDisabled={tileDisabled}
                    tileContent={tileContent}
                    onClickDay={handleDateClick}
                  />
                </div>
                {/* Modal for displaying reservation details */}
                <Modal show={showModal} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Detail Reservasi</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {selectedReservation ? (
                      <>
                        <h4>
                          Reservasi untuk{" "}
                          {new Date(
                            selectedReservation.tanggal_reservasi
                          ).toLocaleDateString()}
                        </h4>
                        <p>
                          <strong>Keterangan:</strong>{" "}
                          {selectedReservation.keterangan}
                        </p>
                      </>
                    ) : (
                      <p>Tidak ada reservasi untuk tanggal ini.</p>
                    )}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Tutup
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Container>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default DetailPage;

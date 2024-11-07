import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import MapContainer from "./MapContainer.jsx";
import "leaflet/dist/leaflet.css";

const FooterComponent = () => {
  return (
    <div className="footer py-5">
      <Container>
        <Row className="d-flex justify-content-between">
          <Col lg="5">
            <h5 className="fw-bold">Lokasi</h5>
            <p className="desc">
              Desa Watuaji Kecamatan Keling, Jepara, Jawa Tengah, Indonesia.
            </p>
            <MapContainer />
          </Col>
          <Col className="d-flex flex-column col-lg-2 col mt-lg-0 mt-5">
            <h5 className="fw-bold">Menu</h5>
            <Link to="">Home</Link>
            <Link to="wisata">Wisata</Link>
            <Link to="umkm">UMKM</Link>
            <Link to="sejarah">Sejarah</Link>
            <Link to="berita">Berita</Link>
          </Col>
          <Col lg="4" className="mt-lg-0 mt-5">
            <h5 className="fw-bold mb-3">Contact Us</h5>
            <div className="social mt-3">
              <Link to="https://www.facebook.com/groups/531789201060867/?ref=share&mibextid=KtfwRi">
                <i className="fa-brands fa-facebook"></i>
              </Link>
              <Link to="https://www.instagram.com/pesonawatuaji?igsh=dW51dTYxa2YxeHFq">
                <i className="fa-brands fa-instagram"></i>
              </Link>
              <i className="fa-brands fa-youtube"></i>
            </div>
            <div className="wa mb-1 mt-4">
              <Link
                to="https://wa.me/+6282210506909?text=hallo"
                className="text-decoration-none"
              >
                <i className="fa-brands fa-whatsapp"></i>
                <p className="m-0"> 0822 1050 6909</p>
              </Link>
            </div>
            <div className="mail">
              <Link
                className="text-decoration-none"
                to="mailto:terpikatwatuaji@gmail.com"
              >
                <i className="fa fa-envelope"></i>
                <p className="m-0">terpikatwatuaji@gmail.com</p>
              </Link>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <p className="text-center px-md-0 px-3">
              &copy; Copyright {new Date().getFullYear()} By{" "}
              <span className="fw-bold">Watu Aji </span>, All Right Reserved
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FooterComponent;

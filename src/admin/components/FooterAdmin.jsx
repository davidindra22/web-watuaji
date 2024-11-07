import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const FooterAdmin = () => {
  return (
    <div className="fot-admin">
      <Container>
        <Row>
          <Col>
            <p className="text-md-center ">
              &copy; Copyright {new Date().getFullYear()} By{" "}
              <span className="fw-bold">Watu Aji </span>, All Right Reserved
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FooterAdmin;

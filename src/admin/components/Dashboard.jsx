import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import EarningsCard from "./EarningsCard";
import TasksCard from "./TasksCard";
import PageViewsCard from "./PageViewsCard";
import DownloadsCard from "./DownloadsCard";
import BookingCard from "./BookingCard";

const Dashboard = () => {
  return (
    <div className="dashmain">
      <Container>
        <h5>
          Dashboard <small>Control panel</small>
        </h5>
        <Row className="mb-4">
          <Col md={3}>
            <EarningsCard />
          </Col>
          <Col md={3}>
            <TasksCard />
          </Col>
          <Col md={3}>
            <PageViewsCard />
          </Col>
          <Col md={3}>
            <DownloadsCard />
          </Col>
          <Col md={3}>
            <BookingCard />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;

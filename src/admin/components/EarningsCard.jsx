import React, { useEffect, useState } from "react";
import { Card, Col } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

const EarningsCard = () => {
  const [wisataCount, setWisataCount] = useState(0);

  const fetchWisataCount = async () => {
    try {
      const response = await axios.get(
        "https://api.wisatawatuaji.com/api/wisata/count"
      ); // Sesuaikan URL dengan endpoint
      setWisataCount(response.data.count);
    } catch (error) {
      console.error("Error fetching wisata count:", error);
    }
  };

  useEffect(() => {
    // Fetch data initially when component mounts
    fetchWisataCount();

    // Polling every 60 seconds (60000 milliseconds)
    const interval = setInterval(fetchWisataCount, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="mb-4">
      <Card.Body className="bg-success text-white">
        <Col>
          <Card.Title>{wisataCount}</Card.Title>
          <Card.Text>Wisata</Card.Text>
        </Col>
        <Col className="icon">
          <i className="fa fa-line-chart"></i>
        </Col>
      </Card.Body>
      <Link to="/appAdmin/adminWisata">
        <button className="fill">
          Info selengkapnya <i className="fa fa-chevron-right"></i>
        </button>
      </Link>
    </Card>
  );
};

export default EarningsCard;

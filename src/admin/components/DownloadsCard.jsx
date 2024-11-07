import React, { useEffect, useState } from "react";
import { Card, Col } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

const DownloadsCard = () => {
  const [beritaCount, setBeritaCount] = useState(0);

  const fetchBeritaCount = async () => {
    try {
      const response = await axios.get(
        "https://api.wisatawatuaji.com/api/berita/count"
      ); // Sesuaikan URL dengan endpoint
      setBeritaCount(response.data.count);
    } catch (error) {
      console.error("Error fetching Berita count:", error);
    }
  };

  useEffect(() => {
    // Fetch data initially when component mounts
    fetchBeritaCount();

    // Polling every 60 seconds (60000 milliseconds)
    const interval = setInterval(fetchBeritaCount, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="mb-4">
      <Card.Body className="bg-warning text-white">
        <Col>
          <Card.Title>{beritaCount}</Card.Title>
          <Card.Text>Berita</Card.Text>
        </Col>
        <Col className="icon">
          <i className="fa fa-newspaper"></i>
        </Col>
      </Card.Body>
      <Link to="/appAdmin/adminBerita">
        <button className="fill">
          Info selengkapnya <i className="fa fa-chevron-right"></i>
        </button>
      </Link>
    </Card>
  );
};

export default DownloadsCard;

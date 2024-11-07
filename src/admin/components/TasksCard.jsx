import React, { useEffect, useState } from "react";
import { Card, Col } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

const TasksCard = () => {
  const [umkmCount, setUmkmCount] = useState(0);

  const fetchUmkmCount = async () => {
    try {
      const response = await axios.get(
        "https://api.wisatawatuaji.com/api/umkm/count"
      ); // Sesuaikan URL dengan endpoint
      setUmkmCount(response.data.count);
    } catch (error) {
      console.error("Error fetching wisata count:", error);
    }
  };

  useEffect(() => {
    // Fetch data initially when component mounts
    fetchUmkmCount();

    // Polling every 60 seconds (60000 milliseconds)
    const interval = setInterval(fetchUmkmCount, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);
  return (
    <Card className="mb-4">
      <Card.Body className="bg-danger text-white">
        <Col>
          <Card.Title>{umkmCount}</Card.Title>
          <Card.Text>UMKM</Card.Text>
        </Col>
        <Col className="icon">
          <i className="fa fa-shopping-basket"></i>
        </Col>
      </Card.Body>
      <Link to="/appAdmin/adminUmkm">
        <button>
          Info selengkapnya <i className="fa fa-chevron-right"></i>
        </button>
      </Link>
    </Card>
  );
};

export default TasksCard;

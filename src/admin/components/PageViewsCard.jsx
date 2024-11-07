import React, { useEffect, useState } from "react";
import { Card, Col } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

const PageViewsCard = () => {
  const [pageViews, setPageViews] = useState(0);

  const fetchPageViews = async () => {
    try {
      const response = await axios.get(
        "https://api.wisatawatuaji.com/api/total-page-views"
      );
      setPageViews(response.data.totalViews);
    } catch (error) {
      console.error("Error fetching page views:", error);
    }
  };

  useEffect(() => {
    fetchPageViews();

    // Polling every 60 seconds (60000 milliseconds)
    const interval = setInterval(fetchPageViews, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="mb-4">
      <Card.Body className="bg-info text-white">
        <Col>
          <Card.Title>{pageViews}</Card.Title>
          <Card.Text>Viewer</Card.Text>
        </Col>
        <Col className="icon">
          <i className="fa fa-users"></i>
        </Col>
      </Card.Body>
      <Link to="/appAdmin/adminView">
        <button className="fill">
          Info selengkapnya <i className="fa fa-chevron-right"></i>
        </button>
      </Link>
    </Card>
  );
};

export default PageViewsCard;

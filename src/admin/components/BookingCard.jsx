import React, { useEffect, useState } from "react";
import { Card, Col } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

const BookingCard = () => {
  const [bookingCount, setBookingCount] = useState(0);

  const fetchBookingCount = async () => {
    try {
      const response = await axios.get(
        "https://api.wisatawatuaji.com/api/booking/count"
      ); // Sesuaikan URL dengan endpoint
      setBookingCount(response.data.count);
    } catch (error) {
      console.error("Error fetching booking count:", error);
    }
  };

  useEffect(() => {
    // Fetch data initially when component mounts
    fetchBookingCount();

    // Polling every 60 seconds (60000 milliseconds)
    const interval = setInterval(fetchBookingCount, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="mb-4">
      <Card.Body className="bg-warning text-white">
        <Col>
          <Card.Title>{bookingCount}</Card.Title>
          <Card.Text>Booking</Card.Text>
        </Col>
        <Col className="icon">
          <i className="fa fa-newspaper"></i>
        </Col>
      </Card.Body>
      <Link to="/appAdmin/adminBooking">
        <button className="fill">
          Info selengkapnya <i className="fa fa-chevron-right"></i>
        </button>
      </Link>
    </Card>
  );
};

export default BookingCard;

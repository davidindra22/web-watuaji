import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Button,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import "./dist/admin.css";

const LoginAdmin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("danger");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log("Submitting login:", { username, password });

    try {
      const response = await axios.post(
        "https://api.wisatawatuaji.com/api/login",
        {
          username,
          password,
        },
        { withCredentials: true }
      );
      console.log(response.data);
      setMessage(response.data.message);
      setAlertVariant("success");
      localStorage.setItem("token", response.data.token);
      navigate("/appAdmin");
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
      setAlertVariant("danger");
    }
  };

  return (
    <div className="login-page">
      <Container className="login-container">
        <Row>
          <Col className="d-flex justify-content-center">
            <img
              src="/assets/img/logo.png"
              alt=""
              className="img-logo-login mb-3"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <h4 className="text-center">Login</h4>
          </Col>
        </Row>
        <Form className="box-login" onSubmit={handleSubmit}>
          <FormGroup controlId="fromUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></Form.Control>
          </FormGroup>
          <FormGroup controlId="fromPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </FormGroup>
          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>
        {message && (
          <Alert variant={alertVariant} className="mt-3">
            {message}
          </Alert>
        )}
      </Container>
    </div>
  );
};

export default LoginAdmin;

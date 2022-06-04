import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import FooterBar from "components/FooterBar/footerBar";

import landingPageStyles from "./landingPage.module.css";

const LandingPagePage = () => {
  return (
    <Container
      fluid
      className="p-0 gx-0"
      style={{
        backgroundImage: `url(${require("assets/images/img_books1.png")})`,
        backgroundSize: "cover",
      }}
    >
      <IntroSection />
      <FooterBar />
    </Container>
  );
};

export default LandingPagePage;

const IntroSection = (props) => {
  return (
    <Container className="px-md-3 px-lg-5" fluid>
      {/* This row contains the header of the document. (i.e. Logo + Listing/Login/Register buttons) */}
      <Row className="justify-between g-0 py-3">
        {/* Minerva Logo */}
        <Col xs={12} md={6} lg={4}>
          <a href="/" className="d-flex justify-center align-center">
            <img
              src="images/img_minervaLogo.png"
              alt="Minerva Logo"
              style={{ maxHeight: "120px" }}
            />
          </a>
        </Col>

        {/* View Listings, Login and Register Buttons */}
        <Col
          xs={12}
          md={6}
          className="d-flex align-items-center justify-content-center justify-content-md-end"
        >
          <Button className="px-3 py-2 m-2" href="/listingspage">
            View Listings
          </Button>
          <Button variant="outline-light border-0 m-2" href="/loginpage">
            Login
          </Button>
          <Button variant="light m-2" href="/registerpage">
            Register
          </Button>
        </Col>
      </Row>

      {/* Text portion + two buttons */}
      <Row className="px-5 pt-6 justify-center justify-content-sm-start">
        <Col xs={12} sm={8} md={5} lg={4} className="ps-sm-3 ps-lg-4">
          <Row>
            <h1 className={landingPageStyles["intro-header"]}>
              Can't find suitable tutors/tutees?
            </h1>
          </Row>
          <Row>
            <p className={landingPageStyles["intro-text"]}>
              Minerva can help with its easy-to-use and convenient
              tuition-matching service.
              <br />
              Get started with just three simple steps!
            </p>
          </Row>
          <Row>
            <Col xs={12} md="auto" className="d-flex justify-center my-2">
              <Button className="p-3 border" style={{ borderRadius: "10px" }}>
                See How It Works
              </Button>
            </Col>
            <Col xs={12} md={4} className="d-flex justify-center my-2">
              <Button
                className="p-3 border"
                variant="dark"
                style={{ borderRadius: "10px" }}
              >
                About Us
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

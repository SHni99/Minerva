import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import FooterBar from "components/FooterBar/footerBar";


const LandingPagePage = () => {

  return (
    <Container fluid 
      className="p-0 gx-0" 
      style={{
        backgroundImage: `url(${require("assets/images/img_books1.png")})`,
        backgroundSize: "cover"
      }}>
      <IntroSection />
      <FooterBar />
    </Container>
  );
};

export default LandingPagePage;

const IntroSection = props => {
  return (
    <Row className="justify-between g-0">
      <Col xs={12} md={6} lg={4} className="px-5 py-3">
        <a href='/' className="d-flex justify-center align-center">
          <img src="images/img_minervaLogo.png" alt="Minerva Logo" style={{maxHeight: "120px"}}/>
        </a>
      </Col>

      <Col xs={12} md={6} className="d-flex align-items-center justify-content-center justify-content-md-end pe-md-5">
        <Button className="px-3 py-2 m-2" href="/listingspage">View Listings</Button>
        <Button variant="outline-light border-0 m-2">Login</Button>
        <Button variant="light m-2">Register</Button>
      </Col>
    </Row>
  );
}

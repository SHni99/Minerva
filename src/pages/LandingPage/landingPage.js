import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import FooterBar from "components/FooterBar/footerBar";
import { JournalCheck, Funnel, ChatLeftText } from "react-bootstrap-icons";
import { supabaseClient } from "config/supabase-client";
import { useNavigate } from "react-router-dom";

import landingPageStyles from "./landingPage.module.css";

const LandingPage = () => {
  return (
    <Container
      fluid
      className="p-0 gx-0"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <IntroSection />
      <WhyMinervaSection />
      <GetStartedSection />
      <FooterBar />
    </Container>
  );
};

export default LandingPage;

// Used to simplify process of getting image link of an image under src/assets/images
const srcImgLink = (imgName) => {
  return `url("${require("assets/images/" + imgName)}")`;
};

const switchPage = (navigate, e) => {
  e.preventDefault();
  if (supabaseClient.auth.user()) {
    navigate("/profile");
  } else {
    navigate("/loginpage");
  }
};

const IntroSection = () => {
  const navigate = useNavigate();
  return (
    <Container
      className="px-md-3 px-lg-5"
      fluid
      style={{
        backgroundImage: srcImgLink("img_books1.png"),
        backgroundSize: "cover",
      }}
    >
      {/* This row contains the header of the document. (i.e. Logo + Listing/Login/Register buttons) */}
      <Row className="justify-between g-0 py-3">
        {/* Minerva Logo */}
        <Col xs={12} md={6} lg={4}>
          <a href="/" className="d-flex justify-start align-center">
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
          <Button className="px-3 py-2 m-2 rounded-pill" href="/listingspage">
            View Listings
          </Button>
          <Button
            variant="outline-light border-0 m-2"
            onClick={(e) => {
              switchPage(navigate, e);
            }}
          >
            {supabaseClient.auth.user() ? "My Profile" : "Login"}
          </Button>
          <Button variant="light m-2" href="/create-listing">
            {supabaseClient.auth.user() ? "Create Listings" : "Register"}
          </Button>
        </Col>
      </Row>

      {/* Text portion + two buttons */}
      <Row
        className="px-5 py-8 justify-center justify-content-md-start"
        style={{ minHeight: "40vw" }}
      >
        <Col
          xs={12}
          sm={7}
          md={5}
          lg={4}
          className="ps-sm-3 ps-lg-4 ps-xxl-5 pb-5 d-flex flex-column justify-center mb-xl-5"
        >
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
              <Button
                className="p-3 border"
                style={{ borderRadius: "10px" }}
                href="#GetStarted"
              >
                See How It Works
              </Button>
            </Col>
            <Col xs={12} md="auto" className="d-flex justify-center my-2">
              <Button
                className="p-3 border"
                variant="dark"
                style={{ borderRadius: "10px" }}
                href="/aboutuspage"
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

const WhyMinervaSection = () => {
  return (
    <Container className="bg-dark px-2 px-sm-5" fluid>
      {/* << Why Minerva >> Header */}
      <Row className="py-5">
        <h1
          className={`text-light text-center ${landingPageStyles["whyMinerva-heading"]}`}
        >
          WHY MINERVA?
        </h1>
      </Row>

      {/* Reason 1: Direct Matching */}
      <Row className="justify-center">
        <Col xs={12} md={7} className="d-flex">
          <img
            src={require("assets/images/img_communicationd.png")}
            alt="Two individuals communicating directly"
          />
        </Col>
        <Col xs={10} md={5} className="d-flex flex-column justify-center">
          <Row>
            <p
              className={`${landingPageStyles["whyMinerva-sub1"]} text-center text-md-start`}
            >
              FAST & EFFICIENT
            </p>
          </Row>
          <Row>
            <h2
              className={`${landingPageStyles["whyMinerva-1"]} text-center text-md-start`}
            >
              DIRECT MATCHING
            </h2>
          </Row>
          <Row>
            <p
              className={`${landingPageStyles["whyMinerva-text1"]} text-center text-md-start`}
            >
              Chat directly with your chosen tutor/tutee!
              <br />
              Avoid delays caused by manual matching processes by agencies.
            </p>
          </Row>
        </Col>
      </Row>

      {/* Reason 2: User-friendly Interfaces*/}
      <Row className="justify-center flex-row-reverse">
        <Col xs={12} md={5} className="d-flex justify-center align-center py-5">
          <img
            src={require("assets/images/img_happysunshine.png")}
            alt="Happy Sunshine"
          />
        </Col>
        <Col xs={10} md={7} className="d-flex flex-column justify-center">
          <Row>
            <p
              className={`${landingPageStyles["whyMinerva-sub1"]} text-center text-md-end`}
            >
              EASY TO USE
            </p>
          </Row>
          <Row>
            <h2
              className={`${landingPageStyles["whyMinerva-1"]} text-center text-md-end`}
            >
              USER-FRIENDLY INTERFACES
            </h2>
          </Row>
          <Row>
            <p
              className={`${landingPageStyles["whyMinerva-text1"]} text-center text-md-end`}
            >
              Say goodbye to messy walls of text.
              <br />
              Minerva enables easy filtering of listings through clean and
              simple menus.
              <br />
              Make use of the intuitive and straightforward controls to make
              your experience better!
            </p>
          </Row>
        </Col>
      </Row>

      {/* Reason 3: Highly Customisable*/}
      <Row className="justify-center">
        <Col xs={12} md={5} className="d-flex justify-center align-center pb-5">
          <img
            src={require("assets/images/img_multitaskingma.png")}
            alt="Happy Sunshine"
          />
        </Col>
        <Col xs={12} md={7} className="d-flex flex-column justify-center">
          <Row>
            <p
              className={`${landingPageStyles["whyMinerva-sub1"]} text-center text-md-start`}
            >
              FLEXIBLE
            </p>
          </Row>
          <Row>
            <h2
              className={`${landingPageStyles["whyMinerva-1"]} text-center text-md-start`}
            >
              CUSTOMISED LISTINGS
            </h2>
          </Row>
          <Row>
            <p
              className={`${landingPageStyles["whyMinerva-text1"]} text-center text-md-start`}
            >
              Want to teach for free? Only able to teach certain topics of a
              subject? Wish to only teach online?
              <br />
              Fret not! Minerva can handle all these requests. Simply add more
              fields and let Minerva do the rest.
            </p>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

const GetStartedSection = () => {
  return (
    // Background image with colour pencils
    <Container
      fluid
      style={{
        backgroundImage: srcImgLink("img_getStartedbg.jpg"),
        backgroundSize: "cover",
      }}
      className="p-5"
      id="GetStarted"
    >
      {/* White overlay  */}
      <Row
        className="mx-2 mx-sm-5 p-4 bg-light shadow"
        style={{ borderRadius: "20px" }}
      >
        {/* Left side */}
        <Col xs={12} md={6} className="p-2 pb-5">
          <Row>
            <img
              src={require("assets/images/img_getStartedWoman.jpg")}
              alt="A working adult"
            />
          </Row>
          <Row xs={7}>
            <h2 className={landingPageStyles["getStarted-leftTitle"]}>
              Get started with Minerva today
            </h2>
            <p className={landingPageStyles["getStarted-leftText"]}>
              Minerva provides a quick and easy solution to find tutors and
              tutees through our online platform.
            </p>
            <Button variant="warning" href="/registerpage">
              Sign up now
            </Button>
          </Row>
        </Col>

        {/* Right side */}
        <Col xs={12} md={6} className="p-2 d-flex flex-column justify-evenly">
          <Row className="py-2 px-md-5 d-flex flex-column">
            <JournalCheck style={{ height: "6vw" }} />
            <h2
              className={`${landingPageStyles["getStarted-stepHeader"]} text-center`}
            >
              Step 1
            </h2>
            <p
              className={`${landingPageStyles["getStarted-stepText"]} text-center`}
            >
              Create a member account or log in as guest to view listings
            </p>
          </Row>

          <Row xs={12} className="py-2 px-md-5 d-flex flex-column">
            <Funnel style={{ height: "6vw" }} />
            <h2
              className={`${landingPageStyles["getStarted-stepHeader"]} text-center`}
            >
              Step 2
            </h2>
            <p
              className={`${landingPageStyles["getStarted-stepText"]} text-center`}
            >
              Search and filter listings based on your preferences
            </p>
          </Row>

          <Row xs={12} className="py-2 px-md-5 d-flex flex-column">
            <i className="bi-journal-check" />
            <ChatLeftText style={{ height: "6vw" }} />
            <h2
              className={`${landingPageStyles["getStarted-stepHeader"]} text-center`}
            >
              Step 3
            </h2>
            <p
              className={`${landingPageStyles["getStarted-stepText"]} text-center`}
            >
              Communicate with tutors/tutees through private chat
            </p>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

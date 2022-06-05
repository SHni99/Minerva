import React from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import footerBarStyles from "./footerBar.module.css";

const FooterBar = () => {
  return (
    <Container className={`${footerBarStyles.footer}`} fluid>
      <Divider />
      <Bar
        copyrightText={
          <React.Fragment>
            2022 © Minerva
            <br />
            All rights reserved.
          </React.Fragment>
        }
        iconInstagram="/images/img_instagram1.png"
        iconTwitter="/images/img_twitter1.png"
        iconFacebook="/images/img_facebook1.png"
      />
    </Container>
  );
};

export default FooterBar;

const Divider = () => {
  return <div className={footerBarStyles.divider}></div>;
};

const Bar = (props) => {
  const { copyrightText, iconInstagram, iconTwitter, iconFacebook } = props;

  return (
    <Row
      className={`${footerBarStyles["bar"]} p-2 d-flex flex-column-reverse flex-md-row`}
    >
      {/* Copyright Text */}
      <Col className="d-flex justify-center align-center text-center text-md-start py-2">
        <p className="p-0 m-0">{copyrightText}</p>
      </Col>

      <Links />

      <SocialMedia icons={{ iconInstagram, iconTwitter, iconFacebook }} />
    </Row>
  );
};

function Links() {
  return (
    <Col
      className={`${footerBarStyles.links} justify-center py-2 d-flex flex-wrap`}
    >
      <FooterLink label="Home" referTo="/" />
      <FooterLink label="Terms of Service" referTo="/" />
      <FooterLink label="About Us" referTo="/aboutuspage" />
      <FooterLink label="Privacy Policy" referTo="/" />
    </Col>
  );
}

function FooterLink(props) {
  const { label, referTo, minWidth } = props;
  return (
    <Link
      className={`${footerBarStyles["footer-link"]}`}
      style={{ minWidth }}
      to={referTo}
    >
      <div className={`${footerBarStyles["text"]} text-smmedium`}>{label}</div>
    </Link>
  );
}

function SocialMedia(props) {
  const { iconInstagram, iconTwitter, iconFacebook } = props.icons;
  return (
    <Col className="d-flex flex-row gap-4 align-center justify-center py-2">
      <Link to="/">
        <img
          className={footerBarStyles["icon-instagram"]}
          src={iconInstagram}
          alt="Instagram"
        />
      </Link>

      <Link to="/">
        <img
          className={footerBarStyles["icon-twitter"]}
          src={iconTwitter}
          alt="Twitter"
        />
      </Link>

      <Link to="/">
        <img
          className={footerBarStyles["icon-facebook"]}
          src={iconFacebook}
          alt="Facebook"
        />
      </Link>
    </Col>
  );
}

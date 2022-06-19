import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import navBarStyles from "./navBar.module.css";
import { supabaseClient as supabase } from "../../config/supabase-client";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import { ChatDots } from "react-bootstrap-icons";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const NavBar = ({ _userLoggedIn }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(_userLoggedIn || false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const minervaLogoSrc = "/images/img_minervaLogo.png";

  // Try to fetch user profile pic
  useEffect(() => {
    getAvatarUrl();
  }, []);

  const getAvatarUrl = async () => {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      if (!user) return;
      setIsLoggedIn(true);

      const { data, error: avatarUrlError } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();
      if (avatarUrlError) throw avatarUrlError;
      if (data.avatar_url === "") return;

      const { publicURL, error: publicUrlError } = supabase.storage
        .from("avatars")
        .getPublicUrl(data.avatar_url);

      if (publicUrlError) throw publicUrlError;

      setAvatarUrl(publicURL);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateNavBarLinks = () => {
    return (
      <React.Fragment>
        <Link
          className={`${navBarStyles["home-link"]} ${navBarStyles["button-variant-set-master"]} ${navBarStyles["button-master"]}`}
          to="/"
        >
          <div
            className={`${navBarStyles["text"]} inter-medium-black-20px`}
            data-testid="navBar-home"
          >
            Home
          </div>
        </Link>

        <Link
          className={`${navBarStyles["listings-link"]} ${navBarStyles["button-variant-set-master-2"]} ${navBarStyles["button-master-2"]}`}
          to="/listingspage"
        >
          <div className={`${navBarStyles["text-1"]} inter-medium-black-20px`}>
            Listings
          </div>
        </Link>

        <Link
          className={`${navBarStyles["aboutus-link"]} ${navBarStyles["button-variant-set-master"]} ${navBarStyles["button-master"]}`}
          to="/aboutuspage"
          data-testid="navBar-about"
        >
          <div className={`${navBarStyles["text"]} inter-medium-black-20px`}>
            About Us
          </div>
        </Link>
      </React.Fragment>
    );
  };

  return (
    <Container className={`${navBarStyles.navBar} g-0`} fluid>
      <Row>
        <Col
          className="d-flex justify-center justify-content-lg-end"
          xs={12}
          lg={4}
          xxl={3}
        >
          <Link to="/" className="d-flex">
            <img
              className={navBarStyles.minerva_logo}
              src={minervaLogoSrc}
              alt="Minerva Logo"
            />
          </Link>
        </Col>

        <Col
          xs={12}
          lg={4}
          xxl={5}
          className="d-flex justify-center justify-content-lg-start align-center g-0"
        >
          <div className={`${navBarStyles.links}`}>{generateNavBarLinks()}</div>
        </Col>

        <Col xs={12} lg={4} className="d-flex justify-center align-center">
          <CredentialsCorner
            isLoggedIn={isLoggedIn}
            avatarUrl={avatarUrl}
            loading={loading}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default NavBar;

function CredentialsCorner(props) {
  const { isLoggedIn, avatarUrl, loading } = props;

  if (isLoggedIn) {
    return (
      <div className={navBarStyles["credentialsCorner"]}>
        {/* Profile Pic */}
        {loading ? (
          <Spinner animation="border" className={navBarStyles["avatar"]} />
        ) : (
          <Link
            className={navBarStyles["avatar"]}
            to="/viewprofilepage"
            style={{
              backgroundImage: `url(${
                avatarUrl || "/images/img_avatarDefault.jpg"
              })`,
              cursor: "pointer",
            }}
            data-testid="profilePic"
          />
        )}

        {/* Create Listing Button */}
        <Button href="create-listing" className="mx-4" active>
          Create Listing
        </Button>

        {/* Chat Button */}
        <Link
          // Feature Flag: uncomment this to link to chat page
          // to="/chat"
          to="/"
          className={navBarStyles.chat}
        >
          <ChatDots></ChatDots>
        </Link>
      </div>
    );
  }

  return (
    <div className={navBarStyles.credentialsCorner}>
      <Link
        className={`${navBarStyles["login-button"]} ${navBarStyles["button-variant-set-master-3"]} ${navBarStyles["button-master-3"]}`}
        to="/loginpage"
      >
        <div className={`inter nunitosans-normal-endeavour-20px`}>Log in</div>
      </Link>

      <Link
        className={`${navBarStyles["sign-up-button"]} ${navBarStyles["button-master-4"]}`}
        to="/registerpage"
      >
        <div
          className={`${navBarStyles["text-2"]} nunitosans-normal-white-20px`}
        >
          Sign Up
        </div>
      </Link>
    </div>
  );
}

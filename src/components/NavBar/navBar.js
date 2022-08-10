import React, { useContext } from "react";
import AuthContext from "util/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import navBarStyles from "./navBar.module.css";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import { ChatDots, BoxArrowRight } from "react-bootstrap-icons";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import { supabaseClient } from "config/supabase-client";
import ToastContext from "util/ToastContext";

const NavBar = ({ _userLoggedIn }) => {
  const { authData, authLoading, ADMIN_THRESHOLD, BANNED_THRESHOLD } =
    useContext(AuthContext);
  const {
    logged_in: isLoggedIn,
    avatar_url: avatarUrl,
    permissions: perms,
  } = authData;
  const isBanned = perms <= BANNED_THRESHOLD;

  const minervaLogoSrc = "/images/img_minervaLogo.png";

  const generateNavBarLinks = () => {
    if (isBanned) return <></>;
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

        {/* About Us Button/Admin Panel.
        What is displayed depends on user's authorisation status (permissions) */}
        {perms >= ADMIN_THRESHOLD ? (
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" className="mx-2">
              Admin Panel
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="/reports">User Reports</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Link
            className={`${navBarStyles["aboutus-link"]} ${navBarStyles["button-variant-set-master"]} ${navBarStyles["button-master"]}`}
            to="/aboutuspage"
            data-testid="navBar-about"
          >
            <div className={`${navBarStyles["text"]} inter-medium-black-20px`}>
              About Us
            </div>
          </Link>
        )}
      </React.Fragment>
    );
  };

  return (
    <Container className={`${navBarStyles.navBar} g-0`} fluid>
      <Row>
        <Col
          className="d-flex justify-center justify-content-lg-end px-xxl-5"
          xs={12}
          lg="auto"
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
          lg="auto"
          className="d-flex justify-center justify-content-lg-start align-center g-0"
        >
          <div className={`${navBarStyles.links}`}>{generateNavBarLinks()}</div>
        </Col>

        <Col
          xs={12}
          lg="auto"
          className="d-flex justify-center justify-content-lg-end pe-lg-5 align-center ml-auto"
        >
          <CredentialsCorner
            isLoggedIn={isLoggedIn}
            isBanned={isBanned}
            avatarUrl={avatarUrl}
            authLoading={authLoading}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default NavBar;

function CredentialsCorner(props) {
  const { isLoggedIn, isBanned, avatarUrl, authLoading: loading } = props;
  const { handleLogout } = useContext(AuthContext);
  const { showSimpleToast } = useContext(ToastContext);
  const navigate = useNavigate();

  // Let this corner load as it changes depending on user's authentication state
  if (loading) {
    return (
      <div className={navBarStyles["credentialsCorner"]}>
        <Spinner animation="border" />
      </div>
    );
  }

  if (isBanned) {
    return (
      <div className={navBarStyles["credentialsCorner"]}>
        <Button
          size="lg"
          onClick={async () => {
            try {
              navigate("/");
              const { error } = await supabaseClient.auth.signOut();
              if (error) throw error;
            } catch (error) {
              alert(error.message);
            }
          }}
        >
          Log Out
        </Button>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className={navBarStyles["credentialsCorner"]}>
        {/* Profile Pic */}
        <Link
          className={navBarStyles["avatar"]}
          to="/profile"
          style={{
            backgroundImage: `url(${
              avatarUrl || "/images/img_avatarDefault.jpg"
            })`,
            cursor: "pointer",
          }}
          data-testid="profilePic"
        />

        {/* Create Listing Button */}
        <Button href="create-listing" className="mx-3 px-2" active>
          Create Listing
        </Button>

        {/* Chat Button */}
        <Link to="/chats" className={navBarStyles.chat}>
          <ChatDots></ChatDots>
        </Link>

        <div className={navBarStyles.tooltip}>
          <Button
            variant="secondary"
            size="lg"
            className="ms-3 me-0 px-2"
            onClick={() => handleLogout(showSimpleToast, navigate)}
          >
            <BoxArrowRight />
          </Button>
          <span className={navBarStyles.tooltiptext}>Log Out</span>
        </div>
      </div>
    );
  }

  return (
    <div className={navBarStyles.credentialsCorner}>
      <Link
        className={`${navBarStyles["login-button"]} ${navBarStyles["button-variant-set-master-3"]} ${navBarStyles["button-master-3"]} px-0`}
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

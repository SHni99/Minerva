import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import navBarStyles from "./navBar.module.css";
import { useNavigate } from "react-router-dom";
import { supabaseClient as supabase } from "../../config/supabase-client";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const minervaLogoSrc = "/images/img_minervaLogo.png";
  const navigate = useNavigate();

  // Try to fetch user profile pic
  useEffect(() => {
    getAvatarUrl();
  }, []);

  const getAvatarUrl = async () => {
    try {
      const user = supabase.auth.user();

      if (!user) return;
      setIsLoggedIn(true);

      const { data, error: avatarUrlError } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();
      if (avatarUrlError) throw avatarUrlError;

      const { publicURL, error: publicUrlError } = supabase.storage
        .from("avatars")
        .getPublicUrl(data.avatar_url);

      if (publicUrlError) throw publicUrlError;

      if (data) setAvatarUrl(publicURL);
    } catch (error) {
      alert(error.message);
    }
  };

  const generateNavBarLinks = () => {
    return (
      <React.Fragment>
        <Link
          className={`${navBarStyles["home-link"]} ${navBarStyles["button-variant-set-master"]} ${navBarStyles["button-master"]}`}
          to="/"
        >
          <div className={`${navBarStyles["text"]} inter-medium-black-20px`}>
            {" "}
            Home{" "}
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
        >
          <div className={`${navBarStyles["text"]} inter-medium-black-20px`}>
            {" "}
            About Us{" "}
          </div>
        </Link>
      </React.Fragment>
    );
  };

  return (
    <div className={navBarStyles.navBar}>
      <Link to="/">
        {" "}
        <img
          className={navBarStyles.minerva_logo}
          src={minervaLogoSrc}
          alt="Minerva Logo"
        />{" "}
      </Link>
      <div className={navBarStyles.links}>{generateNavBarLinks()}</div>
      <CredentialsCorner
        isLoggedIn={isLoggedIn}
        avatarUrl={avatarUrl}
        navigate={navigate}
        loading={loading}
      />
    </div>
  );
};

export default NavBar;

function CredentialsCorner(props) {
  const { isLoggedIn, avatarUrl, navigate, loading } = props;

  if (isLoggedIn) {
    return (
      <div className={navBarStyles["credentialsCorner"]}>
        <Button href="create-listing" active>
          Create Listing
        </Button>

        {loading ? (
          <Spinner animation="border" className={navBarStyles["avatar"]} />
        ) : (
          <div
            className={navBarStyles["avatar"]}
            onClick={() => navigate("/loginmainpage")}
            style={{
              backgroundImage:
                `url(${avatarUrl})` || `url("/images/img_avatarDefault.jpg")`,
              cursor: "pointer",
            }}
          />
        )}
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

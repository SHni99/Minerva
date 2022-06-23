import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../config/supabase-client";
import FooterBar from "components/FooterBar/footerBar";
import NavBar from "components/NavBar/navBar";
import viewprofileStyles from "./profile.module.css";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useLocation } from "react-router-dom";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import UserListings from "components/UserListing/userlistings";
import Listings from "components/UserListing/userlistings";
import Rating from "components/Rating/Rating";
import ReviewCard from "components/ReviewCard/reviewCard";

const ViewProfilePage = () => {
  const { state } = useLocation();

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <NavBar />
      <ProfilePageBody creator_id={state ? state.creator_id : undefined} />
      <FooterBar />
    </div>
  );
};

export default ViewProfilePage;

//the body which is the card container in the middle
const ProfilePageBody = ({ creator_id }) => {
  const [profileData, setProfileData] = useState({
    username: "",
    avatar_url: "",
    bio: "",
    gender: "",
  });
  const [checkUser, setcheckUser] = useState(false);
  const [currentValue, setCurrentValue] = useState(false);
  const [indexAll, setIndexAll] = useState("");
  const navigate = useNavigate();
  const checkId = supabaseClient.auth.user().id;
  const ratinghover = useState(true);
  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  //log user out and redirect to landing page
  const handleLogout = async (navigate, e) => {
    e.preventDefault();
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      alert("Logged out");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const getReview = async () => {
      try {
        setLoading(true);
        const {
          data: reviewAll,
          error,
          status,
        } = await supabaseClient
          .from("reviews")
          .select("index, textbox, reviewer_id")
          .eq("reviewee_id", checkId);

        if (error && status !== 406) throw error;

        if (reviewAll.length === 0) {
          setIsEmpty(true);
          return;
        }

        setIsEmpty(false);

        const newReviewData = await Promise.all(
          reviewAll.map(async ({ index, textbox, reviewer_id }) => {
            let {
              data: { avatar_url: avatarCode, username },
              error: avatarError,
              status: avatarStatus,
            } = await supabaseClient
              .from("profiles")
              .select("username, avatar_url")
              .eq("id", reviewer_id)
              .single();
            if (avatarError && avatarStatus !== 406) throw avatarError;

            const { publicURL: avatarUrl, error: urlError } =
              avatarCode === ""
                ? {}
                : supabaseClient.storage
                    .from("avatars")
                    .getPublicUrl(avatarCode);
            if (urlError) throw urlError;

            return {
              avatarUrl,
              username,
              index,
              textbox,
              creator_id,
            };
          })
        );
        setReviewData(newReviewData);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    const getUserReview = async () => {
      try {
        setLoading(true);
        const {
          data: reviewAll,
          error,
          status,
        } = await supabaseClient
          .from("reviews")
          .select("index, textbox, reviewer_id")
          .eq("reviewee_id", creator_id);

        if (error && status !== 406) throw error;

        if (reviewAll.length === 0) {
          setIsEmpty(true);
          return;
        }

        setIsEmpty(false);

        const newReviewData = await Promise.all(
          reviewAll.map(async ({ index, textbox, reviewer_id }) => {
            let {
              data: { avatar_url: avatarCode, username },
              error: avatarError,
              status: avatarStatus,
            } = await supabaseClient
              .from("profiles")
              .select("username, avatar_url")
              .eq("id", reviewer_id)
              .single();
            if (avatarError && avatarStatus !== 406) throw avatarError;

            const { publicURL: avatarUrl, error: urlError } =
              avatarCode === ""
                ? {}
                : supabaseClient.storage
                    .from("avatars")
                    .getPublicUrl(avatarCode);
            if (urlError) throw urlError;

            return {
              avatarUrl,
              username,
              index,
              textbox,
              creator_id,
            };
          })
        );
        setReviewData(newReviewData);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    const getUserProfile = async () => {
      try {
        const { data, error } = await supabaseClient
          .from("profiles")
          .select("avatar_url, username, bio, gender")
          .eq("id", creator_id)
          .single();

        if (error) throw error;

        if (data.avatar_url === "") return;

        const { publicURL, error: publicUrlError } = supabaseClient.storage
          .from("avatars")
          .getPublicUrl(data.avatar_url);

        if (publicUrlError) throw publicUrlError;

        if (data) {
          setProfileData({
            username: data.username,
            avatar_url: publicURL,
            bio: data.bio,
            gender: data.gender,
          });
        }
      } catch (error) {
        alert(error.message);
      }
    };

    const getProfile = async () => {
      try {
        let { data, error, status } = await supabaseClient
          .from("profiles")
          .select(`username, avatar_url, bio, gender `)
          .eq("id", checkId)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data.avatar_url === "") return;

        const { publicURL, error: publicUrlError } = supabaseClient.storage
          .from("avatars")
          .getPublicUrl(data.avatar_url);

        if (publicUrlError) throw publicUrlError;

        if (data) {
          setProfileData({
            username: data.username,
            avatar_url: publicURL,
            bio: data.bio,
            gender: data.gender,
          });
        }
      } catch (error) {
        alert(error.message);
      }
    };

    const getAllIndex = async () => {
      try {
        const {
          data: indexData,
          error,
          status,
        } = await supabaseClient
          .from("reviews")
          .select("index")
          .eq("reviewee_id", creator_id);

        setIndexAll(
          Math.round(
            indexData.reduce((x, y) => x + y.index, 0) / indexData.length
          )
        );

        if (error && status !== 406) throw error;
      } catch (error) {
        alert(error.message);
      }
    };

    const getAllIndex2 = async () => {
      try {
        const {
          data: indexData,
          error,
          status,
        } = await supabaseClient
          .from("reviews")
          .select("index")
          .eq("reviewee_id", checkId);

        setIndexAll(
          Math.round(
            indexData.reduce((x, y) => x + y.index, 0) / indexData.length
          )
        );

        if (error && status !== 406) throw error;
      } catch (error) {
        alert(error.message);
      }
    };

    if (creator_id === undefined || checkId === creator_id) {
      setcheckUser(false);
      getProfile();
      getReview();
      getAllIndex2();
    } else {
      setcheckUser(true);
      getUserProfile();
      getUserReview();
      getAllIndex();
    }
  }, [creator_id, checkId]);

  return (
    <div className="text-center">
      <div className={viewprofileStyles["container-center-horizontal"]}>
        <div className={`${viewprofileStyles["home-inner"]} container-fluid`}>
          <div className="row align-self-center">
            <div className="col-3 ">
              <div className="col">
                <img
                  src={
                    profileData.avatar_url || "/images/img_avatarDefault.jpg"
                  }
                  className={`${viewprofileStyles["avatar"]} rounded-pill`}
                  alt="avatar"
                ></img>
              </div>

              <div className="col mt-5">
                <h3>
                  {"@"}
                  <label className="text-dark poppins-normal-black-24px">
                    {"" || profileData.username}
                  </label>
                </h3>

                <div
                  className="row"
                  onClick={() => navigate("/formpage")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="col-5 ml-auto">
                    <Rating
                      index={indexAll}
                      setReviews={[currentValue, setCurrentValue]} //pass the params down to child class (Rating) under component
                      ratinghover={ratinghover}
                    />
                  </div>

                  <div className="col-3 text-left">
                    {"(" + reviewData.length + ")"}
                  </div>
                </div>

                <div className="my-4 poppins-normal-black-24px">
                  Gender:{" "}
                  {profileData.gender === "Female" ? (
                    <div className="poppins-normal-red-24px">Female</div>
                  ) : profileData.gender === "Male" ? (
                    <div className="poppins-normal-sapphire-24px">Male</div>
                  ) : (
                    <div className="poppins-normal-black-24px">
                      User has not set a gender
                    </div>
                  )}
                </div>
                <label className="poppins-normal-black-24px">BIO:</label>
                <div className="card">
                  <div className="card-body bg-light border-dark">
                    {profileData.bio}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-8">
              <div className="row">
                {checkUser ? (
                  " "
                ) : (
                  <div className="row-lg-3 text-right">
                    <div>
                      <Button
                        className="bg-primary"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/loginmainpage");
                        }}
                      >
                        Edit my profile
                      </Button>
                    </div>

                    <div className="row-lg-3 my-7">
                      <div>
                        <Button
                          className="bg-primary"
                          onClick={(e) => {
                            handleLogout(navigate, e);
                          }}
                        >
                          Log out
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <Tabs
                  defaultActiveKey="listings"
                  transition={false}
                  id="noanim-tab-example"
                  className="mb-3"
                >
                  {" "}
                  <Tab eventKey="listings" title="Listings">
                    {checkUser ? (
                      <Listings checkId={creator_id || checkId} />
                    ) : (
                      <UserListings checkId={checkId} checkUser={checkUser} />
                    )}
                  </Tab>
                  <Tab eventKey="reviews" title="Reviews">
                    {isEmpty ? (
                      <h1>No Review!</h1>
                    ) : loading ? (
                      <Spinner
                        animation="border"
                        role="status"
                        aria-label="Loading"
                      />
                    ) : (
                      <React.Fragment>
                        {reviewData.map(
                          ({
                            avatarUrl,
                            username,
                            textbox,
                            creator_id,
                            index,
                          }) => {
                            return (
                              <ReviewCard
                                avatarUrl={avatarUrl}
                                username={username}
                                textbox={textbox}
                                creator_id={creator_id}
                                index={index}
                              />
                            );
                          }
                        )}
                      </React.Fragment>
                    )}
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

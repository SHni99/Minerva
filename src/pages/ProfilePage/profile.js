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
import Rating from "components/Rating/Rating";
import ReviewCard from "components/ReviewCard/reviewCard";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import BlockReportMenu from "components/BlockReportMenu/blockReportMenu";
import Setting from "components/Setting/setting";
import Modal from "react-bootstrap/Modal";

const ViewProfilePage = ({
  blockedArray,
  setBlockedArray,
  option,
  setOption,
}) => {
  const { state } = useLocation();
  const unusedModalState = {
    show: false,
    title: "",
    body: "",
    footer: "",
  };
  const [modalState, setModalState] = useState(unusedModalState);
  const hideModal = () => setModalState(unusedModalState);

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <NavBar />
      <ProfileModal
        modalState={modalState}
        onHide={() => setModalState(unusedModalState)}
      />
      <ProfilePageBody
        blockedArray={blockedArray}
        creator_id={state ? state.creator_id : supabaseClient.auth.user().id}
        setModalState={setModalState}
        hideModal={hideModal}
        setBlockedArray={setBlockedArray}
        option={option}
        setOption={setOption}
      />
      <FooterBar />
    </div>
  );
};

export default ViewProfilePage;

//the body which is the card container in the middle
const ProfilePageBody = ({
  creator_id,
  setModalState,
  hideModal,
  blockedArray,
  setBlockedArray,
  option,
  setOption,
}) => {
  const [profileData, setProfileData] = useState({
    username: "",
    bio: "",
    gender: "",
  });
  const [checkUser, setcheckUser] = useState(false);
  const [currentValue, setCurrentValue] = useState(false);
  const [indexAll, setIndexAll] = useState("");
  const checkId = supabaseClient.auth.user()?.id || "";
  const ratinghover = useState(true);
  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [avatar_url, setAvatarurl] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [show, setShow] = useState({
    email: false,
    bio: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const getReview = async (id) => {
      try {
        setLoading(true);
        const {
          data: reviewAll,
          error,
          status,
        } = await supabaseClient
          .from("reviews")
          .select("index, textbox, reviewer_id")
          .eq("reviewee_id", id);

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

    const getProfile = async (id) => {
      try {
        setProfileLoading(true);
        let { data, error, status } = await supabaseClient
          .from("profiles")
          .select(`username, avatar_url, bio, gender `)
          .eq("id", id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setProfileData({
            username: data.username,
            bio: data.bio,
            gender: data.gender,
          });
        }

        if (data.avatar_url === "") return;

        const { publicURL, error: publicUrlError } = supabaseClient.storage
          .from("avatars")
          .getPublicUrl(data.avatar_url);

        if (publicUrlError) throw publicUrlError;
        setAvatarurl(publicURL);
      } catch (error) {
        alert(error.message);
      } finally {
        setProfileLoading(false);
      }
    };

    const getAllIndex = async (id) => {
      try {
        const {
          data: indexData,
          error,
          status,
        } = await supabaseClient
          .from("reviews")
          .select("index")
          .eq("reviewee_id", id);

        if (indexData)
          setIndexAll(
            (
              indexData.reduce((x, y) => x + y.index, 0) / indexData.length
            ).toPrecision(3)
          );

        if (error && status !== 406) throw error;
      } catch (error) {
        alert(error.message);
      }
    };

    const getBlockedStatus = async (id) => {
      try {
        if (blockedArray) {
          const checkBlocked = blockedArray.reduce(
            (res, next) => res || next === id,
            false
          );

          setIsBlocked(checkBlocked);
        }
      } catch (error) {
        alert("error.message");
      }
    };

    const getOptions = async (option) => {
      setShow({
        email: option.includes("Show email") ? true : false,
        bio: option.includes("Show bio") ? true : false,
        gender: option.includes("Show gender") ? true : false,
      });
    };

    if (checkId === creator_id) {
      if (!checkId) return;
      setcheckUser(false);
      getBlockedStatus(checkId);
      getProfile(checkId);
      getReview(checkId);
      getAllIndex(checkId);
      getOptions(option);
    } else {
      setcheckUser(true);
      getBlockedStatus(creator_id);
      getProfile(creator_id);
      getReview(creator_id);
      getAllIndex(creator_id);
    }
  }, [checkId, creator_id, blockedArray, option]);

  const popover = (
    <Popover>
      <Popover.Body>
        <div className="nunito-medium-black-48px">
          {indexAll === "NaN" ? "0" : indexAll}
        </div>
        out of 5
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="text-center pb-5">
      <div className={viewprofileStyles["container-center-horizontal"]}>
        <div className={`${viewprofileStyles["home-inner"]} container-fluid`}>
          <div className="row align-self-center">
            <div className="col-lg-3 col-sm-12">
              {profileLoading ? (
                <Spinner
                  animation="border"
                  role="status"
                  aria-label="Loading"
                />
              ) : (
                <div className="col">
                  <img
                    src={avatar_url || "/images/img_avatarDefault.jpg"}
                    className={`${viewprofileStyles["avatar"]} rounded-pill`}
                    alt="avatar"
                  ></img>
                </div>
              )}

              <div className="col mt-5">
                <h3>
                  {"@"}
                  <label className="text-dark poppins-normal-black-24px">
                    {profileData.username}
                  </label>
                </h3>
                <OverlayTrigger
                  trigger="click"
                  placement="right"
                  overlay={popover}
                >
                  <div className="row" style={{ cursor: "pointer" }}>
                    <div className="d-flex flex-row text-xl justify-center">
                      <Rating
                        index={indexAll}
                        setReviews={[currentValue, setCurrentValue]} //pass the params down to child class (Rating) under component
                        ratinghover={ratinghover}
                        className="px-2"
                      />
                      {"(" + reviewData.length + ")"}
                    </div>
                  </div>
                </OverlayTrigger>
                {show.gender ? (
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
                ) : (
                  ""
                )}

                {show.email ? (
                  <div>
                    <label className="poppins-normal-black-24px">Email:</label>
                    <div className="text mb-3">
                      {supabaseClient.auth.user().email}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {show.bio ? (
                  <div>
                    <label className="poppins-normal-black-24px">BIO:</label>
                    <div className="card">
                      <div className="card-body bg-light border-dark">
                        {profileData.bio}
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className="col-lg-8 col-sm-12">
              <div className="row">
                {!checkUser ? (
                  <Setting
                    showModal={(title, body, footer) =>
                      setModalState({ show: true, title, body, footer })
                    }
                    onHide={hideModal}
                    blockedArray={blockedArray}
                    setOption={setOption}
                    option={option}
                  ></Setting>
                ) : (
                  <div className="d-flex justify-center justify-content-lg-end align-items-center mb-5 mt-3 my-lg-0">
                    {isBlocked ? (
                      ""
                    ) : (
                      <Button
                        className="m-2"
                        onClick={() =>
                          navigate("/chats", {
                            state: {
                              startChatData: {
                                user_id: creator_id,
                                name: profileData.username,
                                src: avatar_url,
                              },
                            },
                          })
                        }
                      >
                        Chat
                      </Button>
                    )}
                    <BlockReportMenu
                      showModal={(title, body, footer) =>
                        setModalState({ show: true, title, body, footer })
                      }
                      hideModal={hideModal}
                      target_id={creator_id}
                      blockedArray={blockedArray}
                      setBlockedArray={setBlockedArray}
                    />
                  </div>
                )}

                <Tabs
                  defaultActiveKey="listings"
                  transition={false}
                  id="noanim-tab-example"
                  className="mb-3"
                >
                  <Tab eventKey="listings" title="Listings">
                    {isBlocked ? (
                      <h2>User has been blocked</h2>
                    ) : (
                      <UserListings
                        check={creator_id || checkId}
                        checkUser={checkUser}
                      />
                    )}
                  </Tab>
                  <Tab eventKey="reviews" title="Reviews">
                    {isBlocked ? (
                      <h2>User has been blocked</h2>
                    ) : isEmpty ? (
                      <h2>No Reviews Found!</h2>
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
                                key={`${creator_id}_${username}`}
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

const ProfileModal = ({ modalState, onHide }) => {
  const { show, title, body, footer } = modalState;

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>{footer}</Modal.Footer>
    </Modal>
  );
};

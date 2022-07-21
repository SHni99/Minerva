import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "util/AuthContext";
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

const ViewProfilePage = () => {
  const { authData } = useContext(AuthContext);
  const { blocked: blockedArray, preferences } = authData;
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
        preferences={preferences}
        creator_id={state ? state.creator_id : supabaseClient.auth.user().id}
        setModalState={setModalState}
        hideModal={hideModal}
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
}) => {
  const [profileData, setProfileData] = useState({
    username: "",
    bio: "",
    gender: "",
    email: "",
  });
  const [checkUser, setcheckUser] = useState(false);
  const [currentValue, setCurrentValue] = useState(false);
  const [indexAll, setIndexAll] = useState("");
  const checkId = supabaseClient.auth.user()?.id || null;
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
    gender: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const getReview = async (id) => {
      try {
        setLoading(true);
        const { data, error, status } = await supabaseClient
          .from("reviews")
          .select("index, textbox, reviewer(username, avatar_url)")
          .eq("reviewee_id", id);

        if (error && status !== 406) throw error;
        console.log(data);

        if (data.length === 0) {
          setIsEmpty(true);
          return;
        }
        setIsEmpty(false);

        setReviewData(
          data.map(({ index, textbox, reviewer }) => {
            const { username, avatar_url } = reviewer;
            const avatarUrl =
              avatar_url === ""
                ? "images/img_avatarDefault.jpg"
                : supabaseClient.storage
                    .from("avatars")
                    .getPublicUrl(avatar_url).publicURL;
            return {
              avatarUrl,
              username,
              index,
              textbox,
              creator_id,
            };
          })
        );
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
          .select(`username, avatar_url, bio, gender, email `)
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
            email: data.email,
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

    const getOptions = async (id) => {
      try {
        const { data: operation, error } = await supabaseClient
          .from("profiles")
          .select("preferences")
          .eq("id", id)
          .single();

        if (error) throw error;
        setShow({
          email: operation.preferences.email,
          bio: operation.preferences.bio,
          gender: operation.preferences.gender,
        });
      } catch (error) {
        alert(error.message);
      }
    };

    setcheckUser(checkId !== null ? true : false);
    getProfile(checkId === creator_id ? checkId : creator_id);
    getReview(checkId === creator_id ? checkId : creator_id);
    getAllIndex(checkId === creator_id ? checkId : creator_id);
    getOptions(checkId === creator_id ? checkId : creator_id);
  }, [checkId, creator_id]);

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
                  <div className="my-3 poppins-normal-black-24px">
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
                  <div className="my-3">
                    <label className="poppins-normal-black-24px">Email:</label>
                    <div className="text ">{profileData.email}</div>
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
              <div className="row my-2 px-2">
                {checkUser ? (
                  checkId === creator_id ? (
                    <Setting
                      showModal={(title, body, footer) =>
                        setModalState({ show: true, title, body, footer })
                      }
                      onHide={hideModal}
                      blockedArray={blockedArray}
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
                      />
                    </div>
                  )
                ) : (
                  ""
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

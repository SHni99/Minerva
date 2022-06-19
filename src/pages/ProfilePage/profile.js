import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../config/supabase-client";
import FooterBar from "components/FooterBar/footerBar";
import NavBar from "components/NavBar/navBar";
import viewprofileStyles from "./profile.module.css";
import Button from "react-bootstrap/Button";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import UserListings from "components/UserListing/userlistings"

const viewProfilePage = () => {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <NavBar />
      <ProfilePageBody />
      <FooterBar />
    </div>
  );
};

export default viewProfilePage;

//the body which is the card container in the middle
const ProfilePageBody = () => {
  const [username, setUsername] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();
  const checkId = supabaseClient.auth.user().id;

  useEffect(() => {
    getProfile();
  }, []);

  // get data from profiles table in supabase
  const getProfile = async () => {
    try {
      const user = supabaseClient.auth.user();

      let { data, error, status } = await supabaseClient
        .from("profiles")
        .select(`username, avatar_url, Bio, gender `)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        setUsername(data.username);
        setBio(data.Bio);
        setGender(data.gender);
      }
      if (data.avatar_url === "") return;

      const { publicURL, error: publicUrlError } = supabaseClient.storage
        .from("avatars")
        .getPublicUrl(data.avatar_url);

      if (publicUrlError) throw publicUrlError;

      setAvatarUrl(publicURL);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="text-center">
      <div className={viewprofileStyles["container-center-horizontal"]}>
        <div className={`${viewprofileStyles["home-inner"]} container-fluid`}>
          <div className="row align-self-center">
            <div className="col-3 ">
              <div className="col">
                <img
                  src={avatar_url || "/images/img_avatarDefault.jpg"}
                  className={`${viewprofileStyles["avatar"]} rounded-pill`}
                  alt="avatar"
                ></img>
              </div>

              <div className="col mt-5">
                <h3>
                  {"Username: "}
                  <label className="text-danger poppins-normal-black-24px">
                    {username || ""}
                  </label>
                </h3>

                <div className="my-5 poppins-normal-black-24px">
                  Gender: {gender}
                </div>
                <label className="poppins-normal-black-24px">BIO:</label>
                <div className="card">
                  <div className="card-body bg-light border-dark">{bio}</div>
                </div>
              </div>
            </div>

            <div className="col-8">
              <div className="row ">
                <div className="row-lg-3 text-right">
                  <div>
                    <Button
                      className="bg-primary"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/loginmainpage");
                      }}
                    >
                      {" Edit my profile"}
                    </Button>
                  </div>

                  <div className="row-lg-3 my-7">
                    <div>
                      <Button
                        className="bg-primary"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/formpage");
                        }}
                      >
                        View my reviews
                      </Button>
                    </div>
                  </div>
                </div>
                <Tabs
                  defaultActiveKey="listings"
                  transition={false}
                  id="noanim-tab-example"
                  className="mb-3"
                >
                  <Tab eventKey="listings" title="Listings">
                    <UserListings 
                    checkId={checkId}
                    />
                  </Tab>
                  <Tab eventKey="reviews" title="Reviews">
                    ...
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

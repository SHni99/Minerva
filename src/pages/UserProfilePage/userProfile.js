import React, { useState, useEffect } from "react";
import { supabaseClient } from "../../config/supabase-client";
import FooterBar from "components/FooterBar/footerBar";
import NavBar from "components/NavBar/navBar";
import viewprofileStyles from "./userProfile.module.css";
import { useLocation } from "react-router-dom";

const ViewProfilePage = () => {
  const { state } = useLocation();
  const { creator_id } = state;
  console.log(creator_id);
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <NavBar />
      <ProfilePageBody creator_id={creator_id} />
      <FooterBar />
    </div>
  );
};

export default ViewProfilePage;

//the body which is the card container in the middle
const ProfilePageBody = (props) => {
  const { creator_id } = props;
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    getProfile();
    console.log(username);
  });

  // get data from profiles table in supabase
  const getProfile = async () => {
    try {
      const { data, error } = await supabaseClient
        .from("profiles")
        .select("avatar_url, username, Bio, gender")
        .eq("id", creator_id)
        .single();
      if (error) throw error;
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
                  src={avatarUrl || "/images/img_avatarDefault.jpg"}
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
              <div className="row">
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                  <li class="nav-item">
                    <a
                      class="nav-link active"
                      id="home-tab"
                      data-toggle="tab"
                      href="/listingspage"
                      role="tab"
                      aria-controls="Listings"
                      aria-selected="true"
                    >
                      Listings
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      id="profile-tab"
                      data-toggle="tab"
                      href="#profile"
                      role="tab"
                      aria-controls="Reviews"
                      aria-selected="false"
                    >
                      Reviews
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

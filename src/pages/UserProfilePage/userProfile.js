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
      <div
        className={viewprofileStyles["container-center-horizontal"]}

      >
        <div className={`${viewprofileStyles["home-inner"]} container`}>
          <div className="row">
            <div className="col-lg-4 my-auto">
              <img
                src={avatarUrl || "/images/img_avatarDefault.jpg"}
                alt={"avatar" || "default_avatar"}
                className={`${viewprofileStyles["avatar"]} rounded-pill`}
              ></img>
            </div>
            <div className="col-lg-4 my-auto">
              <div
                className={`card shadow text-center rounded-5 `}
                style={{ backgroundColor: "#FAFAD2" }}
              >
                <div className="card-body mt-4">
                  <h2>
                    {"Username: "}
                    <label className="text-danger poppins-semi-bold-black-24px">
                      {username}
                    </label>

                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="my-5 poppins-semi-bold-black-64px">Gender: {gender}</div>
      <label className="poppins-semi-bold-black-64px">BIO:</label>
      <div className={viewprofileStyles["border-box"]}> {bio}</div>
    </div>
  );
};

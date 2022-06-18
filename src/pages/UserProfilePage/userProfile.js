import React, { useState, useEffect } from "react";
import { supabaseClient } from "../../config/supabase-client";
import FooterBar from "components/FooterBar/footerBar";
import NavBar from "components/NavBar/navBar";
import viewprofileStyles from "./userProfile.module.css";
import { useLocation } from "react-router-dom";

const ViewProfilePage = () => {
  const { state } = useLocation();
  const {creator_id} = state;
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
  const [avatar_url, setAvatarUrl] = useState(null);
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    getProfile();
  });

  // get data from profiles table in supabase
  const getProfile = async () => {
    try {
      let { data, error, status } = await supabaseClient
        .from("profiles")
        .select(`username, avatar_url, Bio, gender `)
        .eq("id", creator_id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      const { publicURL, error: publicUrlError } = supabaseClient.storage
        .from("avatars")
        .getPublicUrl(data.avatar_url);

      if (publicUrlError) throw publicUrlError;

      setAvatarUrl(publicURL);

      if (data) {
        setUsername(data.username);
        setBio(data.Bio);
        setGender(data.gender);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="text-center">
      <div
        className={viewprofileStyles["container-center-horizontal"]}
        style={{
          backgroundImage: `url(${"/images/img_image5.png"})`,
        }}
      >
        <div className={`${viewprofileStyles["home-inner"]} container`}>
          <div className="row">
            <div className="col-lg-4 my-auto">
              <img
                src={avatar_url || "/images/img_avatarDefault.jpg"}
                className={`${viewprofileStyles["avatar"]} rounded-pill`}
                alt="avatar"
              ></img>
            </div>
            <div className="col-lg-4 my-auto">
              <div
                className={`card shadow text-center rounded-5 `}
                style={{ backgroundColor: "#FAFAD2" }}
              >
                <div className="card-body mt-4">
                  <h2>
                    {"Welcome "}
                    <label className="text-danger poppins-semi-bold-black-24px">
                      { username || ""}
                    </label>
                    {" !"}
                  </h2>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      <div className="my-5">Gender: {gender}</div>
      <label className="poppins-semi-bold-black-64px">BIO:</label>
      <div className={viewprofileStyles["border-box"]}> {bio}</div>
    </div>
  );
};

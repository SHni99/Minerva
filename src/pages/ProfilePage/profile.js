import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../config/supabase-client";
import FooterBar from "components/FooterBar/footerBar";
import NavBar from "components/NavBar/navBar";
import viewprofileStyles from "./profile.module.css";
import Button from "react-bootstrap/Button";

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
      <div
        className={viewprofileStyles["container-center-horizontal"]}
        
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
                    {"Username: "}
                    <label className="text-danger poppins-semi-bold-black-24px">
                      {username || ""}
                    </label>
                    
                  </h2>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="row-lg-3 my-5">
                <div style={{ paddingLeft: "300px" }}>
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
              </div>
              <div className="row-lg-3 my-7">
                <div style={{ paddingLeft: "300px" }}>
                  <Button
                    className="bg-primary text-black"
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
          </div>
        </div>
      </div>

      <div className="my-5 poppins-semi-bold-black-64px">Gender: {gender}</div>
      <label className="poppins-semi-bold-black-64px">BIO:</label>
      <div className={viewprofileStyles["border-box"]}>
        {" "}
        {bio}
      </div>
    </div>
  );
};

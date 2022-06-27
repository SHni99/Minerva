import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../config/supabase-client";
import FooterBar from "components/FooterBar/footerBar";
import NavBar from "components/NavBar/navBar";
import profileStyles from "./updateProfile.module.css";
import PersonalAvatar from "components/Avatar/avatar";
import Button from "react-bootstrap/Button";

//retrieve session from loginmain page and call getProfile method if session is read
const UpdateProfilePage = ({ session }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [avatar_url, setAvatarUrl] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    getProfile();
  }, [session]);

  // get data from profiles table in supabase
  const getProfile = async () => {
    try {
      setLoading(true);
      const user = supabaseClient.auth.user();

      let { data, error, status } = await supabaseClient
        .from("profiles")
        .select(`username, avatar_url, gender, bio`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
        setGender(data.gender);
        setBio(data.bio);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  //modify the data components in supabase and set its states to new values
  async function updateProfile({ username, avatar_url }) {
    try {
      setLoading(true);
      const user = supabaseClient.auth.user();

      const updates = {
        id: user.id,
        username,
        avatar_url,
        gender,
        bio,
        updated_at: new Date(),
      };

      let { error } = await supabaseClient.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) throw error;
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  //log user out and redirect to landing page
  const handleLogout = async (navigate, e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      // input logout popup
      navigate("/");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  //profile page component classes
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <NavBar />
      <ProfilePageBody
        session={session}
        username={username}
        avatar_url={avatar_url}
        setUsername={setUsername}
        gender={gender}
        setGender={setGender}
        bio={bio}
        setBio={setBio}
        navigate={navigate}
        handleLogout={handleLogout}
        updateProfile={updateProfile}
        setAvatarUrl={setAvatarUrl}
        loading={loading}
      />
      <FooterBar />
    </div>
  );
};

export default UpdateProfilePage;

//the body which is the card container in the middle
const ProfilePageBody = (props) => {
  //call every params under props (from ProfilePage)
  const {
    session,
    username,
    setUsername,
    gender,
    setGender,
    bio,
    setBio,
    navigate,
    handleLogout,
    avatar_url,
    updateProfile,
    setAvatarUrl,
    loading,
  } = props;

  return (
    <div
      className={profileStyles["container-center-horizontal"]}
      style={{
        backgroundImage: `url(${"/images/background.jpg"})`,
      }}
    >
      <div className={`${profileStyles["home-inner"]} container`}>
        <div className="col-lg-6 m-auto">
          <div
            className={`card shadow text-center rounded-5`}
            style={{ backgroundColor: "#FAFAD2" }}
          >
            <div className="card-body mt-4">
              <PersonalAvatar //user can upload from his side, will update avatar_url under the profile table
                className="align-self"
                url={avatar_url}
                onUpload={(url) => {
                  setAvatarUrl(url);
                  updateProfile({
                    username,
                    avatar_url: url,
                  });
                }}
              />

              <div className="mt-4">
                <h4>Email: {session.user.email} </h4>
                <div className="mt-8">
                  <h2>Username</h2>
                </div>
              </div>
              <form>
                <input
                  type="text"
                  value={username || ""}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control form-control-lg m-auto"
                ></input>
                <div className="mt-8">
                  <h2>Gender</h2>
                </div>
                <div className="form-check form-check-inline px-10">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio1"
                    value="Male"
                    checked={gender === "Male" ? true : ""}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <label
                    className="form-check-label inter-medium-sapphire-20px "
                    htmlFor="inlineRadio1"
                  >
                    Male
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="inlineRadio2"
                    value="Female"
                    checked={gender === "Female" ? true : ""}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <label
                    className="form-check-label inter-medium-red-20px"
                    htmlFor="inlineRadio2"
                  >
                    Female
                  </label>
                </div>

                <div className="mt-8">
                  <h2>Bio</h2>
                </div>
                <input
                  type="text"
                  placeholder={bio || ""}
                  onChange={(e) => setBio(e.target.value)}
                  className="form-control form-control-lg m-auto"
                ></input>

                <Button //logout button: supabase logout function
                  className={` col-lg-5 col-sm-6 rounded-4 p-2 mr-5 my-5 border-dark text-dark`}
                  style={{
                    fontSize: "15px",
                    backgroundColor: "#D5DED9",
                  }}
                  onClick={(e) => {
                    handleLogout(navigate, e);
                  }}
                >
                  <strong>Log out</strong>
                </Button>

                <Button //update button: triggers three events when run successfully
                  className={`col-lg-5 col-sm-6 rounded-4 p-2 ml-5 m-auto border-dark text-dark`}
                  style={{
                    fontSize: "15px",
                    backgroundColor: "#42d38b",
                  }}
                  onClick={() => {
                    updateProfile({
                      username,
                      avatar_url,
                    });
                    alert("updated");
                    navigate("/listingspage");
                  }}
                >
                  <strong>{loading ? "Updating" : "Update"}</strong>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

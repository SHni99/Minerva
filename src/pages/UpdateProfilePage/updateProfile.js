import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "util/AuthContext";
import { supabaseClient } from "../../config/supabase-client";
import FooterBar from "components/FooterBar/footerBar";
import NavBar from "components/NavBar/navBar";
import profileStyles from "./updateProfile.module.css";
import PersonalAvatar from "components/Avatar/avatar";
import Button from "react-bootstrap/Button";
import BootstrapSwitchButton from "bootstrap-switch-button-react";

//retrieve session from loginmain page and call getProfile method if session is read
const UpdateProfilePage = ({ session, showSimpleToast }) => {
  const { authData } = useContext(AuthContext);
  const { username, gender, preferences, bio, avatar_url } = authData;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [genderOption, setGender] = useState(gender);
  const [emailPreferences, setEmailPreferences] = useState(
    preferences.email === (undefined || false) ? false : true
  );
  const [genderPreferences, setGenderPreferences] = useState(
    preferences.gender === (undefined || false) ? false : true
  );
  const [bioPreferences, setBioPreferences] = useState(
    preferences.bio === (undefined || false) ? false : true
  );

  async function updateProfile() {
    try {
      setLoading(true);

      const user = supabaseClient.auth.user();
      const newUsername = document.getElementById("username").value;
      const newGender = document.querySelector(
        "input[name='inlineRadioOptions']:checked"
      ).value;
      const newBio = document.getElementById("bio").value;

      const preferencesUpdate = {
        email: emailPreferences,
        gender: genderPreferences,
        bio: bioPreferences,
      };
      const updates = {
        id: user.id,
        username: newUsername,
        gender: newGender,
        bio: newBio,
        email: session.user.email,
        preferences: preferencesUpdate,
        updated_at: new Date(),
      };

      let { error } = await supabaseClient.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) throw error;
      showSimpleToast("Updated", "You have successfully updated!", 2000);
      navigate("/listingspage");
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
        bio={bio}
        session={session}
        username={username}
        avatar_url={avatar_url.split("/").at(-1)}
        genderOption={genderOption}
        setGender={setGender}
        genderPreferences={genderPreferences}
        bioPreferences={bioPreferences}
        setBioPreferences={setBioPreferences}
        setGenderPreferences={setGenderPreferences}
        setEmailPreferences={setEmailPreferences}
        emailPreferences={emailPreferences}
        navigate={navigate}
        handleLogout={handleLogout}
        updateProfile={updateProfile}
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
    bio,
    session,
    username,
    genderOption,
    setGender,
    genderPreferences,
    bioPreferences,
    setBioPreferences,
    setGenderPreferences,
    setEmailPreferences,
    emailPreferences,
    navigate,
    handleLogout,
    avatar_url,
    updateProfile,
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
        <div
          className={`card shadow text-center rounded-5`}
          style={{ backgroundColor: "#FAFAD2" }}
        >
          <div className="card-body mt-4">
            <div className="row">
              <div className="col-7">
                <PersonalAvatar //user can upload from his side, will update avatar_url under the profile table
                  className="align-self"
                  url={avatar_url}
                  loading={loading}
                  id="avatar"
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
                    id="username"
                    defaultValue={username || ""}
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
                      value="Male"
                      checked={genderOption === "Male" ? true : ""}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <text className="form-check-label inter-medium-sapphire-20px ">
                      Male
                    </text>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="inlineRadioOptions"
                      value="Female"
                      checked={genderOption === "Female" ? true : ""}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <text
                      className="form-check-label inter-medium-red-20px"
                      htmlFor="inlineRadio2"
                    >
                      Female
                    </text>
                  </div>

                  <div className="mt-8">
                    <h2>Bio</h2>
                  </div>
                  <input
                    defaultValue={bio}
                    className="form-control form-control-lg m-auto"
                    id="bio"
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
                      updateProfile();
                    }}
                  >
                    <strong>{loading ? "Updating" : "Update"}</strong>
                  </Button>
                </form>
              </div>
              <div className="col-5">
                <div className="row">
                  <div className="col-1">
                    <div class="vr d-flex" style={{ height: "800px" }}></div>
                  </div>
                  <div className="col-10">
                    <div className="nunitosans-bold-black-32px my-3">
                      Privacy setting:
                    </div>
                    <div>
                      <div className="row my-3">
                        <label className="col-8 poppins-normal-black-24px">
                          Show email
                        </label>

                        <BootstrapSwitchButton
                          className="col"
                          onstyle="primary"
                          width={65}
                          height={30}
                          checked={emailPreferences}
                          onChange={() =>
                            setEmailPreferences(
                              emailPreferences === false ? true : false
                            )
                          }
                        />
                      </div>

                      <div className="row">
                        <label className="col-8 poppins-normal-black-24px">
                          Show gender
                        </label>
                        <BootstrapSwitchButton
                          className="col"
                          onstyle="success"
                          width={65}
                          height={30}
                          checked={genderPreferences}
                          onChange={() =>
                            setGenderPreferences(
                              genderPreferences === false ? true : false
                            )
                          }
                        />
                      </div>

                      <div className="row my-3">
                        <label className="col-8 poppins-normal-black-24px">
                          Show bio
                        </label>
                        <BootstrapSwitchButton
                          onstyle="warning"
                          className="col"
                          width={65}
                          height={30}
                          checked={bioPreferences}
                          onChange={() =>
                            setBioPreferences(
                              bioPreferences === false ? true : false
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

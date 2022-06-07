import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../config/supabase-client";
import FooterBar from "components/FooterBar/footerBar";
import NavBar from "components/NavBar/navBar";
import profileStyles from "./profile.module.css";
import PersonalAvatar from "components/Avatar/avatar";

const ProfilePage = ({ session }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const user = supabaseClient.auth.user();

      let { data, error, status } = await supabaseClient
        .from("profiles")
        .select(`username, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  async function updateProfile({ username, avatar_url }) {
    try {
      setLoading(true);
      const user = supabaseClient.auth.user();

      const updates = {
        id: user.id,
        username,
        avatar_url,
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

  const handleLogout = async (navigate, e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      alert("Logged out");
      navigate("/");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavBar />
      <ProfilePageBody
        session={session}
        username={username}
        avatar_url={avatar_url}
        setUsername={setUsername}
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

export default ProfilePage;

const ProfilePageBody = (props) => {
  const {
    session,
    username,
    setUsername,
    navigate,
    handleLogout,
    avatar_url,
    updateProfile,
    setAvatarUrl,
    loading
  } = props;

  return (
    <div className={profileStyles["container-center-horizontal"]}>
      <div className={`${profileStyles["frame-6"]} ${profileStyles["screen"]}`}>
        <div className={profileStyles["frame-7"]}>
          <PersonalAvatar
            url={avatar_url}
            onUpload={(url) => {
              setAvatarUrl(url);
              updateProfile({ username, avatar_url: url });
            }}
          />
          <div
            className={`${profileStyles["emailcom"]} inter-medium-concord-16px`}
          >
            <span>Email: {session.user.email} </span>
            <div
              className={`${profileStyles["overlap-group"]} inter-normal-eerie-black-24px`}
            >
              <h1 className={profileStyles["overlap-group-item"]}>
                <span className={`inter-normal-eerie-black-24px`}>
                  Username
                </span>
              </h1>
            </div>
          </div>

          <input
            type="text"
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
            className={`${profileStyles["input-text"]} border-1px-santas-gray`}
          ></input>
          <div className={profileStyles["buttonmaster-container"]}>
            <div
              className={`${profileStyles["button-master-1"]} border-1px-santas-gray`}
            >
              <button
                onClick={(e) => {
                  handleLogout(navigate, e);
                }}
                className={`${profileStyles["text-1"]} inter-bold-licorice-20px`}
              >
                Log out
              </button>
            </div>

            <div
              className={`${profileStyles["button-master-2"]} border-1px-santas-gray`}
            >
              <button
                onClick={() => {
                  updateProfile({ username, avatar_url });
                  alert("updated");
                  navigate("/listingspage");
                }}
                className={`${profileStyles["text-2"]} inter-bold-romance-20px`}
              >
                <label className={`${profileStyles["text-2"]} inter-bold-romance-20px`}
                >{loading ? 'Updating' : 'Update'}
                </label>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

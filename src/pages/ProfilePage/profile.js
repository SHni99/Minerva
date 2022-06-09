import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../config/supabase-client";
import FooterBar from "components/FooterBar/footerBar";
import NavBar from "components/NavBar/navBar";
import profileStyles from "./profile.module.css";
import PersonalAvatar from "components/Avatar/avatar";
import Button from "react-bootstrap/Button";


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
    <div className={profileStyles["container-center-horizontal"]}
      style={{
        backgroundImage: `url(${"/images/nice2.jpg"})`
      }}
    >
      <div className={`${profileStyles["home-inner"]} container`}>
        <div className="col-lg-4">
          <div className={`card text-center rounded-5 w-auto`}>
            <div className="card-body mt-4">
              <PersonalAvatar
                className="align-self"
                url={avatar_url}
                onUpload={(url) => {
                  setAvatarUrl(url);
                  updateProfile({ username, avatar_url: url });
                }}
              />
              <div className="mt-4">
                <h4>Email: {session.user.email} </h4>
                <div className="mt-8">
                  <h1 >
                    Username
                  </h1>
                </div>
              </div>
              <form>
                <input
                  type="text"
                  value={username || ""}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control form-control-lg mt-4"
                ></input>
                <div className={profileStyles["buttonmaster-container"]}>
                  <Button
                    className={`rounded-pill p-4 w-50 border-dark text-dark`}
                    style={{
                      fontSize: "25px",
                      backgroundColor: "#D5DED9",
                      marginRight: "30px"
                    }}
                    onClick={(e) => {
                      handleLogout(navigate, e);
                    }}
                  ><strong>
                      Log out
                    </strong>
                  </Button>

                  <Button
                    className={`rounded-pill p-4 w-50 border-dark text-dark`}
                    style={{
                      fontSize: "25px",
                      backgroundColor: "#42d38b",
                      marginLeft: "30px"
                    }}
                    onClick={() => {
                      updateProfile({ username, avatar_url });
                      alert("updated");
                      navigate("/listingspage");
                    }}
                  ><strong>
                      {loading ? 'Updating' : 'Update'}
                    </strong>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

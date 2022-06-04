import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../config/supabase-client";
import profileStyles from "./profile.module.css";

const ProfilePage = ({ session }) => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    getProfile()
  }, [session])

  const getProfile = async () => {
    try {
      setLoading(true)
      const user = supabaseClient.auth.user()

      let { data, error, status } = await supabaseClient
        .from('profiles')
        .select(`username, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const user = supabaseClient.auth.user()

      const updates = {
        id: user.id,
        username,
        avatar_url,
        updated_at: new Date(),
      }

      let { error } = await supabaseClient.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      })

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
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
    <div className={profileStyles["container-center-horizontal"]}>
      <div className={`${profileStyles["frame-6"]} ${profileStyles["screen"]}`}>
        <div className={profileStyles["frame-7"]}>
          <div
            className={profileStyles["avatarmaster"]}
            style={{
              backgroundImage: `url(${"/images/img_avatarmaster.png"})`,
            }}
          ></div>
          <div
            className={`${profileStyles["button-master"]} border-1px-santas-gray`}
          >
            <div
              className={`${profileStyles["text"]} inter-normal-licorice-20px`}
            >
              <button className={`inter-normal-licorice-20px`}>Upload</button>
            </div>
          </div>
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
            value={username || ''}
            onChange={e => setUsername(e.target.value)}
            className={`${profileStyles["input-text"]} border-1px-santas-gray`}
          ></input>
          <div className={profileStyles["buttonmaster-container"]}>
            <div
              className={`${profileStyles["button-master-1"]} border-1px-santas-gray`}
            >
              <button
                onClick={(e) => {handleLogout(navigate, e)}}
                className={`${profileStyles["text-1"]} inter-bold-licorice-20px`}
              >
                Log out
              </button>
            </div>

            <div
              className={`${profileStyles["button-master-2"]} border-1px-santas-gray`}
            >
              <button
                className={`${profileStyles["text-2"]} inter-bold-romance-20px`}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

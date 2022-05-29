import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../config/supabase-client";
import profileStyles from "./profile.module.css";

const ProfilePage = () => {
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
            <span>Someone@gmail.com</span>
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
            className={`${profileStyles["input-text"]} border-1px-santas-gray`}
          ></input>
          <div className={profileStyles["buttonmaster-container"]}>
            <div
              className={`${profileStyles["button-master-1"]} border-1px-santas-gray`}
            >
              <button
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

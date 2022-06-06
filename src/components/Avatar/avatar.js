import React from "react";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../config/supabase-client";
import avatarStyle from "./avatar.module.css";



const PersonalAvatar = ({ url, onUpload }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
    console.log(url);
  }, [url]);

  const downloadImage = async (path) => {
    try {
      const { data, error } = await supabaseClient.storage
        .from("public/avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log("Error downloading image: ", error.message);
    }
  };

  const uploadAvatar = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabaseClient.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {avatarUrl ? (
        <img
          className={avatarStyle["avatarmaster"]}
          src= {avatarUrl}
          alt="avatar"
        />
      ) : (
        <img
          className={avatarStyle["avatarmaster"]}
          src={avatarUrl}
          alt="avatar"
        />
      )}
      <div>
        <div
          className={`${avatarStyle["button-master"]} border-1px-santas-gray`}
        >
          <div className={`${avatarStyle["text"]} inter-normal-licorice-20px`}>
            <button className={`inter-normal-licorice-20px`}>
            <label className="button primary block" htmlFor="single">
            {uploading ? 'Uploading ...' : 'Upload'}
          </label>
            </button>
            <input
              style={{
                visibility: "hidden",
                position: "absolute",
              }}
              type="file"
              id="single"
              accept="image/*"
              onChange={uploadAvatar}
              disabled={uploading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalAvatar;

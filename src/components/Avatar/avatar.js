import React from "react";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../config/supabase-client";
import avatarStyle from "./avatar.module.css";

const PersonalAvatar = ({ url, onUpload }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
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
    <div className="d-flex flex-column align-center justify-center">
      <img
        className={`${avatarStyle["avatarmaster"]} border border-dark`}
        src={avatarUrl || "/images/img_avatarDefault.jpg"}
        alt={"avatar" || "default_avatar"}
      />

      <button
        className={`${avatarStyle["button-master"]} border-1px-santas-gray`}
      >
        <div className={`${avatarStyle["text"]} inter-normal-licorice-20px`}>
          <label style={{ cursor: "pointer" }} htmlFor="single">
            {uploading ? "Uploading ..." : "Upload"}
          </label>
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
      </button>
    </div>
  );
};

export default PersonalAvatar;

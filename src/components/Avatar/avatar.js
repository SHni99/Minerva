import React from "react";
import { useDebounceEffect } from "./useDebounceEffect";
import { useEffect, useState, useRef } from "react";
import { supabaseClient } from "../../config/supabase-client";
import avatarStyle from "./avatar.module.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { CloseButton } from "react-bootstrap";

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const PersonalAvatar = ({ url, onUpload }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const aspect = 1;

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
      setModalShow(true);
      onUpload(filePath);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  async function canvasPreview(image, canvas, crop, scale = 1, rotate = 0) {
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    // devicePixelRatio slightly increases sharpness on retina devices
    // at the expense of slightly slower render times and needing to
    // size the image back down if you want to download/upload and be
    // true to the images natural size.
    const pixelRatio = window.devicePixelRatio;
    // const pixelRatio = 1

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";
    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;
    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;

    ctx.save();

    // 5) Move the crop origin to the canvas origin (0,0)
    ctx.translate(-cropX, -cropY);
    // 4) Move the origin to the center of the original position
    ctx.translate(centerX, centerY);
    // 3) Rotate around the origin

    ctx.translate(-centerX, -centerY);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );

    ctx.restore();
  }

  const uploadImage = async (canvas) => {
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        const fileName = `${Math.random()}.jpg`;
        const file = new File([blob], fileName, { type: "image/jpeg" });

        try {
          let { error } = await supabaseClient.storage
            .from("avatars")
            .upload(fileName, file);

          if (error) throw error;

          onUpload(fileName);
        } catch (error) {
          alert(error.message);
        } finally {
          console.log("done");
        }
      },
      "image/jpeg",
      1
    );
  };

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
      }
    },
    100,
    [completedCrop]
  );

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  function todo() {
    uploadImage(previewCanvasRef.current);
    setModalShow(false);
  }

  return (
    <div className="d-flex flex-column align-center ">
      <img
        className={`${avatarStyle["avatarmaster"]} border border-dark`}
        src={avatarUrl || "/images/img_avatarDefault.jpg"}
        alt={"avatar" || "default_avatar"}
      />

      <button
        className={`${avatarStyle["button-master"]} border-1px-santas-gray`}
      >
        <div className={`${avatarStyle["text"]} inter-normal-licorice-20px`}>
          <label
            style={{ cursor: "pointer", fontWeight: "bold" }}
            htmlFor="single"
          >
            {uploading ? "Uploading" : "Upload"}
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
          />
        </div>
      </button>
      <Modal size="lg" show={modalShow} onHide={() => setModalShow(false)}>
        
        <Modal.Title className=" d-flex justify-end"><CloseButton
        onClick={() => setModalShow(false)}>
          </CloseButton></Modal.Title>
        <Modal.Body>
          {avatarUrl && (
            <ReactCrop
              crop={crop}
              ruleOfThirds
              circularCrop={true}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
            >
              <img
                ref={imgRef}
                src={avatarUrl}
                onLoad={onImageLoad}
                alt="Crop me"
              ></img>
            </ReactCrop>
          )}

         
            {completedCrop && (
              <canvas
                ref={previewCanvasRef}
                style={{
                  visibility: "hidden",
                  position: "absolute"
                }}
              />
            )}
          
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              todo();
            }}
          >
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PersonalAvatar;

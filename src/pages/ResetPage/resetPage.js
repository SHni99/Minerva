import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Text } from "components/Text";
import { Input } from "components/Input";
import { supabaseClient } from "../../config/supabase-client";
import ResetStyles from "./reset.module.css";

const ResetPage = () => {
  const navigate = useNavigate();
  const handleNavigate20 = () => navigate("/");
  const handleNavigate19 = () => navigate("/loginpage");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (newPassword, confirmPassword, e) => {
    e.preventDefault();

    if (newPassword === confirmPassword) {
      try {
        setLoading(true);

        const { error } = await supabaseClient.auth.update({
          password: newPassword,
        });
        if (error) throw error;

        alert("Successfully updated!");
        navigate("/loginpage");
      } catch (error) {
        alert("Please check your email inbox");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Password does not match. Re-try");
    }
  };

  return (
    <div className={ResetStyles["container-center-horizontal"]}>
      <div className={`${ResetStyles["login-page"]} ${ResetStyles["screen"]}`}>
        <div
          style={{ backgroundImage: `url(${"/images/img_image1.png"})` }}
          className={ResetStyles["overlap-group1"]}
        >
          <form
            onSubmit={(e) => {
              handleReset(newPassword, confirmPassword, e);
            }}
            className={ResetStyles["login-overlay"]}
          >
            <img
              onClick={handleNavigate19}
              src={"/images/cross.png"}
              className={ResetStyles["close-overlay"]}
              alt="cross"
            />
            <img
              className={ResetStyles["minerva_logo_1-removebg-preview_1-3"]}
              src={"/images/img_minervaLogo.png"}
              alt="minerva"
              onClick={handleNavigate20}
            />
            <div className={ResetStyles["password-input"]}>
              <div
                className={`${ResetStyles["label"]} nunitosans-normal-mirage-28px`}
              >
                <Text
                  className={`poppins-semi-bold-black-24px`}
                >{`Enter new password`}</Text>
                <Input
                  type="password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter password"
                ></Input>
              </div>
              <br></br>
              <div
                className={`${ResetStyles["label"]} nunitosans-normal-mirage-28px`}
              >
                <Text
                  className={`poppins-semi-bold-black-24px`}
                >{`Confirm password`}</Text>
                <Input
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter confirm password"
                ></Input>
              </div>
            </div>

            <div className={ResetStyles["button-master-1"]}>
              {loading ? (
                <text className={` nunitosans-bold-white-32px`}>
                  Sending...
                </text>
              ) : (
                <h1 className={`nunitosans-bold-white-32px`}>
                  <button
                    type="submit"
                    className={`${ResetStyles["text-1"]} nunitosans-bold-white-32px`}
                  >{`Reset password`}</button>
                </h1>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Text } from "components/Text";
import { Input } from "components/Input";
import { supabaseClient } from "../../config/supabase-client";
import PwdStyles from "./password.module.css";
import { CloseButton } from "react-bootstrap";

const PasswordPage = () => {
  const navigate = useNavigate();
  const handleNavigate20 = () => navigate("/");
  const handleNavigate19 = () => navigate("/loginpage");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const forgotPassword = async (email, e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabaseClient.auth.api.resetPasswordForEmail(
        email
      );
      if (error) throw error;
      alert("Sent");
      navigate("/resetpage");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={PwdStyles["container-center-horizontal"]}>
      <div className={`${PwdStyles["login-page"]} ${PwdStyles["screen"]}`}>
        <div
          style={{ backgroundImage: `url(${"/images/img_image1.png"})` }}
          className={PwdStyles["overlap-group1"]}
        >
          <form
            onSubmit={(e) => {
              forgotPassword(email, e);
            }}
            className={PwdStyles["reset-overlay"]}
          >
            <CloseButton
              onClick={handleNavigate19}
              className={PwdStyles["close-overlay"]}
            />
            <img
              className={PwdStyles["minerva_logo_1-removebg-preview_1-3"]}
              src={"/images/img_minervaLogo.png"}
              alt="minerva"
              onClick={handleNavigate20}
            />
            <div className={PwdStyles["email-input"]}>
              <div
                className={`${PwdStyles["label"]} nunitosans-normal-mirage-28px`}
              >
                <Text
                  className={`poppins-semi-bold-black-24px`}
                >{`Enter your email address`}</Text>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                ></Input>
              </div>
            </div>

            <div className={PwdStyles["button-master-1"]}>
              {loading ? (
                <text className={` nunitosans-bold-white-32px`}>
                  Sending...
                </text>
              ) : (
                <h1 className={`nunitosans-bold-white-32px`}>
                  <button
                    type="submit"
                    className={`${PwdStyles["text-1"]} nunitosans-bold-white-32px`}
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

export default PasswordPage;

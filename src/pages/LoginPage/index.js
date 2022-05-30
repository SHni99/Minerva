import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Text } from "components/Text";
import { Input } from "components/Input";
import { supabaseClient } from "../../config/supabase-client";
import loginPageStyles from "./login.module.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const handleNavigate20 = () => navigate("/");
  const handleNavigate19 = () => navigate("/registerpage");
  const handleNavigate18 = () => navigate("/passwordpage");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email, password, navigate, e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabaseClient.auth.signIn({ email, password });
      if (error) throw error;
      alert("Logged in");
      navigate("/listingspage");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supabaseClient.auth.user())
      navigate("/listingspage");
  });

  return (
    <div className={loginPageStyles["container-center-horizontal"]}>
      <div
        className={`${loginPageStyles["login-page"]} ${loginPageStyles["screen"]}`}
      >
        <div
          style={{ backgroundImage: `url(${"/images/img_image1.png"})` }}
          className={loginPageStyles["overlap-group1"]}
        >
          <div className={loginPageStyles["login-overlay"]}>
            <img
              className={loginPageStyles["minerva_logo_1-removebg-preview_1-3"]}
              src={"/images/img_minervaLogo.png"}
              alt="minerva"
              onClick={handleNavigate20}
            />
            <div className={loginPageStyles["username-input"]}>
              <div
                className={`${loginPageStyles["label"]} nunitosans-normal-mirage-28px`}
              >
                <Text
                  className={`poppins-semi-bold-black-24px`}
                >{`Email`}</Text>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter username or email"
                ></Input>
              </div>
              <br></br>
              <div
                className={`${loginPageStyles["label"]} nunitosans-normal-mirage-28px`}
              >
                <Text
                  className={`poppins-semi-bold-black-24px`}
                >{`Password`}</Text>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                ></Input>
              </div>
              <h1
                className={`${loginPageStyles["text-1"]} nunitosans-bold-endeavour-24px`}
              >
                <span
                  onClick={handleNavigate18}
                  className={`nunitosans-bold-endeavour-24px`}
                >{`Forgot password?`}</span>
              </h1>
            </div>

            <div className={loginPageStyles["button-master-1"]}>
              {loading ? (
                <text
                  className={`${loginPageStyles["align-left"]} nunitosans-bold-white-32px`}
                >
                  Logging..
                </text>
              ) : (
                <h1
                  className={`${loginPageStyles["text-1"]} nunitosans-bold-white-32px`}
                >
                  <button
                    onClick={(e) => {
                      handleLogin(email, password, navigate, e);
                    }}
                    className={`nunitosans-bold-white-32px`}
                  >{`Log in`}</button>
                </h1>
              )}
            </div>
            <div className={loginPageStyles["overlap-group"]}>
              <div className={loginPageStyles["button-master-2"]}>
                <button
                  className={`${loginPageStyles["text-3"]} nunitosans-bold-licorice-28px`}
                  onClick={handleNavigate19}
                >{`Sign up`}</button>
              </div>
              <div
                className={`${loginPageStyles["dontt-have-an-account"]} nunitosans-normal-black-28px`}
              >
                <span
                  className={`nunitosans-normal-black-28px`}
                >{`Don’t have an account?`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

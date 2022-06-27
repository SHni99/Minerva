import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../config/supabase-client";
import PwdStyles from "./password.module.css";
import { CloseButton } from "react-bootstrap";

const PasswordPage = () => {
  const navigate = useNavigate();
  const home = () => navigate("/");
  const login = () => navigate("/loginpage");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  //user will use his/her email to reset password with the help of supabase
  const forgotPassword = async (email, e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabaseClient.auth.api.resetPasswordForEmail(
        email, {redirectTo: "http://localhost:3000/resetpage"}
      );
      if (error) throw error;
      alert("Sent");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${PwdStyles["container-center-horizontal"]} py-20`}
      style={{ backgroundImage: `url(${"/images/img_image1.png"})` }}
    >
      <form
        onSubmit={(e) => {
          forgotPassword(email, e);
        }}
        className={`${PwdStyles["home-inner"]} container my-20`}
      >
        <div className="col-lg-18 w-100">
          <div
            className={"card text-center rounded-5"}
            style={{
              backgroundColor: "#abc1c5",
              boxShadow: "0px 6px 4px #00000040",
            }}
          >
            {" "}
            <div className="card-body p-5">
              <div className="row justify-end" >
              <CloseButton
                onClick={login}
               
              />
              </div>
              <img
                className={"m-auto h-20"}
                style={{ cursor: "pointer" }}
                src={"/images/img_minervaLogo.png"}
                alt="minerva"
                onClick={home}
              />
              <div className={"row-lg-8 my-5"}>
                <h3
                  className={`poppins-semi-bold-black-24px text-left`}
                >{`Enter your email address`}</h3>
                <div className="form-group">
                  <input
                    className="form-control form-control-lg h-20"
                    style={{
                      backgroundColor: "#E7E4DE",
                    }}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} //email changes everytime an input change is made
                    placeholder="Enter email"
                  ></input>
                </div>
              </div>
              <div
                className={"btn btn-lg btn-outline-primary"}
                style={{
                  backgroundColor: "#4169e1",
                  width: "100%",
                }}
              >
                {loading ? (
                  <text className={` nunitosans-bold-white-26px`}>
                    Sending...
                  </text>
                ) : (
                  <button
                    type="submit"
                    className={`nunitosans-bold-white-26px`}
                  >{`Reset password`}</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PasswordPage;

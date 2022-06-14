import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../config/supabase-client";
import ResetStyles from "./reset.module.css";
import { CloseButton } from "react-bootstrap";

const ResetPage = () => {
  const navigate = useNavigate();
  const home = () => navigate("/");
  const login = () => navigate("/loginpage");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error1, setError] = useState("");

  const handleReset = async (newPassword, confirmPassword, e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      setError("Please enter a password more than *8* characters");

    } else if (!/^(?=.*[0-9])/.test(newPassword)) {
      setError("PLease enter a password containing at least one NUMBER");

    } else if (!/^(?=.*[A-Z])/.test(newPassword)) {
      setError("Please enter a password containing at least one UPPERCASE character");

    } else if (!/^(?=.*[a-z])/.test(newPassword)) {
      setError("Please enter a password containing at least one LOWERCASE character");

    } else if (!/^(?=.*[!@#$%^&*])/.test(newPassword)) {
      setError("Please enter a password containing at least one SPECIAL CASE");

    } else if (newPassword !== confirmPassword) {
      setError("Please enter the SAME passwords!");

    }
    else {
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
    }
  };

  return (
    <div className={ResetStyles["container-center-horizontal"]}>
      <div
        style={{ backgroundImage: `url(${"/images/img_image1.png"})` }}
        className={ResetStyles["overlap-group1"]}
      >
        <form
          onSubmit={(e) => {
            handleReset(newPassword, confirmPassword, e);
          }}
          className={` ${ResetStyles["home-inner"]} container mt-20 `}
        >
          <div className="col-lg-18 w-100">
            <div
              className={"card text-center rounded-5"}
              style={{
                backgroundColor: "#abc1c5",
                boxShadow: "0px 6px 4px #00000040",
              }}
            >
              <div className="card-body p-5">
                <CloseButton
                  onClick={login}
                  className={"ml-6"}
                  style={{ marginLeft: "800px" }}
                />
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
                  >{`Enter new password`}</h3>
                  <div className="form-group">
                    <input
                      className="form-control form-control-lg h-20 my-3"
                      style={{
                        backgroundColor: "#E7E4DE",
                      }}
                      type="password"
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter password"
                    ></input>

                    <h3
                      className={`poppins-semi-bold-black-24px text-left`}
                    >{`Confirm password`}</h3>
                    <input
                      className="form-control form-control-lg h-20 my-3"
                      style={{
                        backgroundColor: "#E7E4DE",
                      }}
                      type="password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Enter confirm password"
                    ></input>
                  </div>
                  {error1 && <h4 className=" nunitosans-bold-endeavour-24px text-danger text-left">{error1}</h4>}
                  <div
                    className={"btn btn-lg btn-outlinr-primary mt-5"}
                    style={{
                      backgroundColor: "#4169e1",
                      width: "100%",
                    }}
                  >
                    {loading ? (
                      <text className={` nunitosans-bold-white-32px`}>
                        Sending...
                      </text>
                    ) : (
                      <button
                        type="submit"
                        className={`nunitosans-bold-white-32px`}
                      >{`Reset password`}</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../config/supabase-client";
import loginPageStyles from "./login.module.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const home = () => navigate("/");
  const registerPage = () => navigate("/registerpage");
  const passwordPage = () => navigate("/passwordpage");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error1, setError] = useState("");

  //user auth: will check the password entry then check for valid email or password with supabase
  const handleLogin = async (email, password, navigate, e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Please enter a password more than 8 characters");
      setPassword("");
    } else if (!/^(?=.*[0-9])/.test(password)) {
      setError("PLease enter a password containing at least one NUMBER");
      setPassword("");
    } else if (!/^(?=.*[A-Z])/.test(password)) {
      setError(
        "Please enter a password containing at least one UPPERCASE character"
      );
      setPassword("");
    } else if (!/^(?=.*[a-z])/.test(password)) {
      setError(
        "Please enter a password containing at least one LOWERCASE character"
      );
      setPassword("");
    } else if (!/^(?=.*[!@#$%^&*])/.test(password)) {
      setError("Please enter a password containing at least one SPECIAL CASE");
      setPassword("");
    } else {
      try {
        setLoading(true);
        //password which meets the req will move onto this step
        const { error } = await supabaseClient.auth.signIn({
          email,
          password,
        });
        if (error) throw error;
        <div
          aria-live="polite"
          aria-atomic="true"
          style={{ position: "relative", minHeight: "200px" }}
        >
          <div
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            class="toast"
            data-autohide="false"
          >
            <div class="toast-header">
              <strong class="mr-auto">Bootstrap</strong>
              <small>11 mins ago</small>
              <button
                type="button"
                class="ml-2 mb-1 close"
                data-dismiss="toast"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="toast-body">Hello, world! This is a toast message.</div>
          </div>
        </div>;
        navigate("/listingspage");
      } catch (error) {
        alert("You have entered an invalid email or password");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={loginPageStyles["container-center-horizontal"]}>
      <div
        style={{ backgroundImage: `url(${"/images/img_image1.png"})` }}
        className={loginPageStyles["overlap-group1"]}
      >
        <form
          onSubmit={(e) => {
            handleLogin(email, password, navigate, e);
          }}
          className={`${loginPageStyles["home-inner"]} container mt-20`}
        >
          <div className="col-lg-18 w-150">
            <div
              className={"card text-center rounded-5"}
              style={{
                backgroundColor: "#abc1c5",
                boxShadow: "0px 6px 4px #00000040",
              }}
            >
              <div className="card-body p-5">
                <img
                  className={"col-sm-6  h-20"}
                  style={{ cursor: "pointer" }}
                  src={"/images/img_minervaLogo.png"}
                  alt="minerva"
                  onClick={home} //redirects to home
                />

                <div className="col-md-12">
                  <div className={`row-lg-8`}>
                    <div className={` nunitosans-normal-mirage-28px`}>
                      <h3
                        className={`poppins-semi-bold-black-24px text-left pt-5`}
                      >{`Email`}</h3>
                      <div className="form-group">
                        <input
                          className="form-control form-control-lg h-20"
                          style={{
                            backgroundColor: "#E7E4DE",
                          }}
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)} //email changes everytime an input change is made
                          placeholder="Enter username or email"
                          data-testid="findemail"
                        ></input>
                      </div>
                    </div>

                    <div className={`nunitosans-normal-mirage-28px`}>
                      <h3
                        className={`poppins-semi-bold-black-24px text-left pt-5`}
                      >{`Password`}</h3>
                      <input
                        className="form-control form-control-lg h-20"
                        style={{
                          backgroundColor: "#E7E4DE",
                        }}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} //password changes everytime an input change is made
                        placeholder="Enter password"
                        data-testid="findpassword"
                      ></input>
                    </div>
                    <h4
                      className={`nunitosans-bold-endeavour-24px mt-3 text-left`}
                      onClick={passwordPage} //redirects to password reset page
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      {`Forgot password?`}
                    </h4>
                    {error1 && (
                      <h5 className="nunitosans-bold-endeavour-24px text-danger">
                        {error1}
                      </h5>
                    )}
                  </div>

                  <div
                    className=" btn btn-lg btn-outline-primary mt-5"
                    style={{
                      backgroundColor: "#4169e1",
                      width: "100%",
                    }}
                  >
                    {loading ? (
                      <h2 className={`nunitosans-bold-white-26px p-2`}>
                        {"Logging in"}
                      </h2>
                    ) : (
                      <button
                        className={`nunitosans-bold-white-26px p-2`}
                        type="submit"
                      >
                        {"Log in"}
                      </button>
                    )}
                  </div>
                  <div
                    className=" row m-3"
                    style={{
                      width: "600px",
                    }}
                  >
                    <div className=" col-lg-8 nunitosans-normal-black-28px  text-right">
                      {`Don’t have an account?`}
                    </div>

                    <button
                      className={
                        "col-lg-4 nunitosans-bold-licorice-28px text-left"
                      }
                      onClick={registerPage} //redirects to register page
                    >{`Sign up`}</button>
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

export default LoginPage;

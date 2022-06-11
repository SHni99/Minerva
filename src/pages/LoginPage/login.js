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

    const handleLogin = async (email, password, navigate, e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const { error } = await supabaseClient.auth.signIn({
                email,
                password,
            });
            if (error) throw error;
            alert("Logged in");
            navigate("/listingspage");
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
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
                    className={`${loginPageStyles["home-inner"]} container`}
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
                                    onClick={home}
                                />

                                <div className="col-md-12">
                                    <div className={`row-lg-8`}>
                                        <div
                                            className={` nunitosans-normal-mirage-28px`}
                                        >
                                            <h3
                                                className={`poppins-semi-bold-black-24px text-left pt-5`}
                                            >{`Email`}</h3>
                                            <div class="form-group">
                                                <input
                                                    className="form-control form-control-lg h-20"
                                                    style={{
                                                        backgroundColor:
                                                            "#E7E4DE",
                                                    }}
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) =>
                                                        setEmail(e.target.value)
                                                    }
                                                    placeholder="Enter username or email"
                                                ></input>
                                            </div>
                                        </div>

                                        <div
                                            className={`nunitosans-normal-mirage-28px`}
                                        >
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
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                placeholder="Enter password"
                                            ></input>
                                        </div>
                                        <h4
                                            className={`nunitosans-bold-endeavour-24px mt-3 text-left`}
                                            onClick={passwordPage}
                                            style={{
                                                cursor: "pointer",
                                            }}
                                        >
                                            {`Forgot password?`}
                                        </h4>
                                    </div>

                                    <div
                                        className=" btn btn-lg btn-outline-primary mt-5"
                                        style={{
                                            backgroundColor: "#4169e1",
                                            width: "100%",
                                        }}
                                    >
                                        {loading ? (
                                            <h2
                                                className={`nunitosans-bold-white-26px p-2`}
                                            >
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
                                            onClick={registerPage}
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

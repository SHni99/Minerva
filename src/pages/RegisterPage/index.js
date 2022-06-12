import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../config/supabase-client";
import registerPageStyles from "./register.module.css";
import PasswordChecklist from "react-password-checklist";

const RegisterPagePage = () => {
    const navigate = useNavigate();
    const home = () => navigate("/");
    const loginpage = () => navigate("/loginpage");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    // Country field not implemented yet
    // const [country, setCountry] = useState("");
    const [loading, setLoading] = useState(false);

    // Redirect user to Listings page if logged in
    useEffect(() => {
        if (supabaseClient.auth.user()) navigate("/listingspage");

        // We are disabling the following warning as there is
        // no point in including the navigate method into the
        // dependency array.

        // eslint-disable-next-line
    }, []);

    const handleSignUp = async (email, password, username, navigate) => {
        if (password === confirmPassword) {
            try {
                setLoading(true);
                const { error } = await supabaseClient.auth.signUp(
                    { email, password },
                    {
                        data: {
                            username,
                        },
                    }
                );
                if (error) throw error;

                alert("Signed up");
                navigate("/listingspage");
            } catch (error) {
                alert(error.message);
            } finally {
                setLoading(false);
            }
        } else {
            alert("Please enter same passwords!");
        }
    };

    return (
        <div className={registerPageStyles["container-center-horizontal"]}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSignUp(email, password, username, navigate);
                }}
                className={` ${registerPageStyles["home-inner"]} container`}
            >
                {" "}
                <div
                    className="card text-center border-light"
                    style={{ backgroundColor: "#d6d6d6" }}
                >
                    {" "}
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="card-body p-5">
                                <img
                                    src={"/images/img_minervaLogo.png"}
                                    className={"col-sm-6 mb-9 h-20"}
                                    style={{ cursor: "pointer" }}
                                    onClick={home}
                                    alt="minerva"
                                />
                                <div className="col-md-12">
                                    <h3 className="text-left poppins-semi-bold-black-24px">
                                        {"Username"}
                                    </h3>
                                    <div className="form-group">
                                        <input
                                            className="form-control form-control-lg h-15 mb-4 nunitosans-normal-storm-gray-28px"
                                            style={{
                                                backgroundColor: "#E7E4DE",
                                            }}
                                            type="text"
                                            value={username}
                                            onChange={(e) =>
                                                setUsername(e.target.value)
                                            }
                                            placeholder="Enter username"
                                        ></input>
                                    </div>

                                    <h3 className="text-left poppins-semi-bold-black-24px">
                                        {"Email"}
                                    </h3>
                                    <div className={`form-group`}>
                                        <input
                                            className="form-control form-control-lg h-15 mb-4 nunitosans-normal-storm-gray-28px"
                                            style={{
                                                backgroundColor: "#E7E4DE",
                                            }}
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder="Enter email"
                                        ></input>
                                    </div>

                                    <h3 className="text-left poppins-semi-bold-black-24px">
                                        {"Password"}
                                    </h3>
                                    <div className={`form-group`}>
                                        <input
                                            className="form-control form-control-lg h-15 mb-4 nunitosans-normal-storm-gray-28px"
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

                                    <h3 className="text-left poppins-semi-bold-black-24px">
                                        {"Confirm password"}
                                    </h3>
                                    <div className={`form-group`}>
                                        <input
                                            className="form-control form-control-lg h-15 mb-4 nunitosans-normal-storm-gray-28px"
                                            style={{
                                                backgroundColor: "#E7E4DE",
                                            }}
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter password"
                                        ></input>
                                    </div>
                                </div>

                                <PasswordChecklist
                                    rules={[
                                        "minLength",
                                        "specialChar",
                                        "number",
                                        "capital",
                                        "match",
                                    ]}
                                    minLength={8}
                                    value={password}
                                    valueAgain={confirmPassword}
                                />

                                <div
                                    className=" btn btn-lg btn-outline-primary my-3"
                                    style={{
                                        backgroundColor: "#4169e1",
                                        width: "100%",
                                    }}
                                >
                                    {loading ? (
                                        <h1
                                            className={`nunitosans-bold-white-26px`}
                                        >
                                            {`Signing up`}
                                        </h1>
                                    ) : (
                                        <h1
                                            className={`nunitosans-bold-white-26px`}
                                        >
                                            <button
                                                className={`nunitosans-bold-white-26px p-2`}
                                                type="submit"
                                            >
                                                {`Sign up`}
                                            </button>
                                        </h1>
                                    )}
                                </div>

                                <div className=" row m-auto">
                                    <div className=" col-lg-7 nunitosans-normal-black-28px  text-right">
                                        {`Have an account?`}
                                    </div>

                                    <button
                                        className={
                                            "col-lg-4 nunitosans-bold-licorice-28px text-left"
                                        }
                                        onClick={loginpage}
                                    >{`Log In`}</button>
                                </div>
                            </div>
                        </div>

                        <div
                            style={{
                                backgroundImage: `url(${"/images/img_image5.png"})`,
                                borderTopRightRadius: "5px",
                                borderBottomRightRadius: "5px",
                            }}
                            className="col-md-4"
                        >
                            {" "}
                            <div className="mt-20">
                                <img
                                    src="/images/img_image2.png"
                                    className={"rounded-4 items-left m-5"}
                                    style={{ height: "150px" }}
                                    alt="image2"
                                />
                                <img
                                    src="/images/img_image3.png"
                                    className={"rounded-4 ml-auto"}
                                    style={{ height: "150px" }}
                                    alt="image3"
                                />
                                <img
                                    src="/images/img_image4.png"
                                    className={"rounded-4 items-left m-5"}
                                    style={{ height: "150px" }}
                                    alt="image4"
                                />

                                <h1
                                    className={`text-left mt-20 merriweather-bold-black-50px`}
                                >
                                    Anytime Anywhere with Minerva
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RegisterPagePage;

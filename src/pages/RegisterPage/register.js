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
    const [error1, setError] = useState("");

    // Redirect user to Listings page if logged in
    useEffect(() => {
        if (supabaseClient.auth.user()) navigate("/listingspage");

        // We are disabling the following warning as there is
        // no point in including the navigate method into the
        // dependency array.

        // eslint-disable-next-line
    }, []);

    const handleSignUp = async (email, password, username, navigate) => {
        //reset() will set password and confirmPassword to null everytime user enter wrong password
        const reset = () => {
            setPassword("");
            setConfirmPassword("");
        }

        //user must enter a password with more than 8 chars, at least an uppercase, lowercase, special case and number
        if (password.length < 8) {
            setError("Please enter a password more than 8 characters");
            reset();
        } else if (!/^(?=.*[0-9])/.test(password)) {
            setError("Please enter a password containing at least one NUMBER");
            reset();
        } else if (!/^(?=.*[A-Z])/.test(password)) {
            setError("Please enter a password containing at least one UPPERCASE character");
            reset();
        } else if (!/^(?=.*[a-z])/.test(password)) {
            setError("Please enter a password containing at least one LOWERCASE character");
            reset();
        } else if (!/^(?=.*[!@#$%^&*])/.test(password)) {
            setError("Please enter a password containing at least one SPECIAL CASE");
            reset();
        } else if (password !== confirmPassword) {
            setError("Please enter the SAME passwords!");
            reset();
        }
        else { //after user enter a strong password, the information entered will be stored in supabase
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
                                    onClick={home} //redirects to home
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
                                            onChange={(e) => //username changes everytime an input change is made
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
                                            onChange={(e) => //email changes everytime an input change is made
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
                                            onChange={(e) => //password changes everytime an input change is made
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
                                            onChange={(e) => //confirmPassword changes everytime an input change is made
                                                setConfirmPassword(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter password"
                                        ></input>
                                    </div>
                                </div>
                                {error1 && <h4 className=" nunitosans-bold-endeavour-24px text-danger text-left">{error1}</h4>}
                                <PasswordChecklist //list of password requirement to be met. User-friendly tool.
                                    rules={[
                                        "minLength",
                                        "specialChar",
                                        "number",
                                        "lowercase",
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
                                        onClick={loginpage} //redirects to login page
                                    >{`Log In`}</button>
                                </div>
                            </div>
                        </div>

                        <div //right side of the page
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

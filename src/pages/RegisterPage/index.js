import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Input } from "components/Input";
import { supabaseClient } from "../../config/supabase-client";
import registerPageStyles from "./register.module.css";
import PasswordChecklist from "react-password-checklist";

const RegisterPagePage = () => {
    const navigate = useNavigate();
    const handleNavigate21 = () => navigate("/");
    const handleNavigate16 = () => navigate("/loginpage");
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
                className={` ${registerPageStyles["home-inner"]} container-fluid p-10`}
            >
                {" "}
                <div
                    className="card text-center"
                    style={{ backgroundColor: "#d6d6d6" }}
                >
                    <div className="card-body">
                        <div className="row">
                            <div className="col-lg-4">
                                <img
                                    src={"/images/img_minervaLogo.png"}
                                    className={
                                        registerPageStyles[
                                            "minerva_logo_1-removebg-preview_1-2"
                                        ]
                                    }
                                    onClick={handleNavigate21}
                                    alt="minerva"
                                />
                                <div
                                    className={`${registerPageStyles["username-input"]}`}
                                >
                                    <UserInput input1="Username" />
                                    <div
                                        className={`${registerPageStyles["input-box-set-master"]} border-1px-mischka`}
                                    >
                                        <div
                                            className={
                                                registerPageStyles["input-text"]
                                            }
                                        >
                                            <div
                                                className={`${registerPageStyles["text"]} nunitosans-normal-storm-gray-28px`}
                                            >
                                                <Input
                                                    type="text"
                                                    value={username}
                                                    onChange={(e) =>
                                                        setUsername(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter username"
                                                ></Input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={`${registerPageStyles["username-input"]}`}
                                >
                                    <UserInput input1="Email" />
                                    <div
                                        className={`${registerPageStyles["input-box-set-master"]} border-1px-mischka`}
                                    >
                                        <div
                                            className={
                                                registerPageStyles["input-text"]
                                            }
                                        >
                                            <div
                                                className={`${registerPageStyles["text"]} nunitosans-normal-storm-gray-28px`}
                                            >
                                                <Input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) =>
                                                        setEmail(e.target.value)
                                                    }
                                                    placeholder="Enter email"
                                                ></Input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={`${registerPageStyles["username-input"]}`}
                                >
                                    <UserInput input1="Password" />
                                    <div
                                        className={`${registerPageStyles["input-box-set-master"]} border-1px-mischka`}
                                    >
                                        <div
                                            className={
                                                registerPageStyles["input-text"]
                                            }
                                        >
                                            <div
                                                className={`${registerPageStyles["text"]} nunitosans-normal-storm-gray-28px`}
                                            >
                                                <Input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) =>
                                                        setPassword(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter password"
                                                ></Input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={`${registerPageStyles["username-input"]}`}
                                >
                                    <UserInput input1="Confirm password" />
                                    <div
                                        className={`${registerPageStyles["input-box-set-master"]} border-1px-mischka`}
                                    >
                                        <div
                                            className={
                                                registerPageStyles["input-text"]
                                            }
                                        >
                                            <div
                                                className={`${registerPageStyles["text"]} nunitosans-normal-storm-gray-28px`}
                                            >
                                                <Input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) =>
                                                        setConfirmPassword(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter confirmed password"
                                                ></Input>
                                            </div>
                                        </div>
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

                                <button type="submit">
                                    <div
                                        className={
                                            registerPageStyles["button-master"]
                                        }
                                    >
                                        {loading ? (
                                            <h1
                                                className={`${registerPageStyles["text-4"]} nunitosans-bold-white-26px`}
                                            >
                                                {`Signing up`}
                                            </h1>
                                        ) : (
                                            <h1
                                                className={`${registerPageStyles["text-4"]} nunitosans-bold-white-26px`}
                                            >
                                                {`Sign up`}
                                            </h1>
                                        )}
                                    </div>
                                </button>

                                <div
                                    className={
                                        registerPageStyles["login-referral"]
                                    }
                                >
                                    <div
                                        className={`${registerPageStyles["have-an-account"]} nunitosans-normal-black-28px`}
                                    >
                                        {`Have an account?`}
                                    </div>
                                    <div
                                        className={`${registerPageStyles["text-5"]} nunitosans-bold-licorice-28px`}
                                        onClick={handleNavigate16}
                                    >
                                        {`Log in now`}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            style={{
                                backgroundImage: `url(${"/images/img_image5.png"})`,
                            }}
                            className="col-lg-4"
                        >
                            <img
                                src="/images/img_image2.png"
                                className={registerPageStyles["image-2"]}
                                alt="image2"
                            />
                            <img
                                src="/images/img_image3.png"
                                className={registerPageStyles["image-3"]}
                                alt="image3"
                            />
                            <img
                                src="/images/img_image4.png"
                                className={registerPageStyles["image-4"]}
                                alt="image4"
                            />

                            <h1
                                align="left"
                                className={`${registerPageStyles["anytime-anywhere-with-minerva"]} merriweather-bold-black-60px`}
                            >
                                Anytime
                                <br />
                                <br />
                                Anywhere
                                <br />
                                <br />
                                with Minerva
                            </h1>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

const UserInput = (props) => {
    const { input1 } = props;

    return (
        <div
            className={`${registerPageStyles["label"]} nunitosans-normal-mirage-28px`}
        >
            <span className={`nunitosans-normal-mirage-28px`}>{input1}</span>
        </div>
    );
};

export default RegisterPagePage;

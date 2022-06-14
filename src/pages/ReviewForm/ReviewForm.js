import React, { useState } from "react";
import Rating from "components/Rating/Rating";
import ReviewStyle from "./ReviewForm.module.css";
import Button from "react-bootstrap/Button";


export default function FormComponent() {
    const [reviews, setReviews] = useState("");
    const onChange = (e) => {
        setReviews(e.target.value);
    };
    const onSubmit = (e) => {
        console.log("Form Submitted");
    };

    return (

        <div className={ReviewStyle["container-center-horizontal"]}>
            <form onSubmit={onSubmit} className={`${ReviewStyle["home-inner"]} container mt-20`}>
                <div className="col-lg-6 m-auto">
                    <div
                        className={`card shadow text-center rounded-5`}
                        style={{ backgroundColor: "#FAFAD2" }}
                    >
                        <div className="card-body mt-4">
                            <img
                                src="/images/img_avatarDefault.jpg"
                                className="rounded-pill w-10 h-10"
                                alt="default"
                            />
                            <div> <Rating /> </div>
                                <input
                                    className="form-control form-control-lg m-auto"
                                    value={reviews}
                                    type="text"
                                    placeholder="enter your review here"
                                ></input>
                                <div className="row-lg-2 m-5">

                                    <Button
                                        className={`col-lg-5 rounded-4 p-2 ml-5  w-1 border-dark text-dark`}
                                        style={{
                                            fontSize: "15px",
                                            backgroundColor: "#42d38b",
                                        }}
                                        onChange={onChange}
                                    >{"Submit review"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
            </form>

        </div>
    );
}
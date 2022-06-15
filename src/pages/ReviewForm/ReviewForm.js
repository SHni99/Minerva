import React, { useState } from "react";
import Rating from "components/Rating/Rating";
import ReviewStyle from "./ReviewForm.module.css";
import Button from "react-bootstrap/Button";


export default function FormComponent() {
    const [reviews, setReviews] = useState("");

    const onSubmit = (e) => {
        console.log("Form Submitted");
    };

    return (

        <div className={ReviewStyle["container-center-horizontal"]}>
            <form onSubmit={onSubmit} className={`${ReviewStyle["home-inner"]} container mt-20`}>
                <div className="">
                    <div
                        className={`card shadow text-center rounded-5`}
                        style={{ backgroundColor: "#FAFAD2" }}
                    >
                        <div className="card-body mt-4">
                            <img
                                src="/images/img_avatarDefault.jpg"
                                className="rounded-pill w-20 h-20 my-3"
                                alt="default"
                            />

                            <div>
                                <Rating /> </div>
                            <div className="form-group">
                                <textarea
                                    className={`${ReviewStyle["textarea"]} form-control form-control-lg my-3`}
                                    value={reviews}
                                    type="text"
                                    placeholder="enter your review here"
                                    onChange={(e) => setReviews(e.target.value)}
                                ></textarea>
                                <div className="row-lg-2 m-5">

                                    <Button
                                        className={`col-lg-5 rounded-4 p-2 ml-5  w-1 border-dark text-dark`}
                                        style={{
                                            fontSize: "15px",
                                            backgroundColor: "#42d38b",
                                        }}
                                    >{"Submit review"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

        </div>
    );
}
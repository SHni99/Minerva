import React, { useState } from "react";
import Rating from "components/Rating/Rating";
import ReviewStyle from "./ReviewForm.module.css";
import Button from "react-bootstrap/Button";
//import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../config/supabase-client";

export default function FormComponent() {
  //const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const ratinghover = true;
  const [currentValue, setCurrentValue] = useState(0);

  //information will be registered under the table "reviews"
  const onReviewSubmit = async ({ index, textbox, user_id }) => {
    const user = supabaseClient.auth.user().id;
    try {
      const data = {
        index,
        textbox,
        user_id: user
      };
      setLoading(true);
      let { error } = await supabaseClient
        .from("reviews")
        .insert(data, { returning: "minimal" });
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={ReviewStyle["container-center-horizontal"]}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onReviewSubmit({
            index: currentValue,
            textbox: comment,
          });
        }}
        className={`${ReviewStyle["home-inner"]} container mt-20`}
      >
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
                <Rating //user can review the quality of his dealer by awarding the number of stars (out of 5)
                setReviews={[currentValue, setCurrentValue]} //pass the params down to child class (Rating) under component
                ratingHover={ratinghover}
                />
              </div>
              <div className="form-group">
                <textarea
                  className={`${ReviewStyle["textarea"]} form-control form-control-lg my-3`}
                  value={comment}
                  type="text"
                  placeholder="enter your review here"
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
                <div className="row-lg-2 m-5">
                  <Button //execute onReviewSubmit when click or enter
                    className={`col-lg-5 rounded-4 p-2 ml-5  w-1 border-dark text-dark`}
                    type="submit"
                    style={{
                      fontSize: "15px",
                      backgroundColor: "#42d38b",
                    }}
                  >
                    {loading ? "Submitting" : "Submit review"}
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

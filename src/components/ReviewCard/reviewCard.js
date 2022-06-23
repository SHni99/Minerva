import React from "react";
import { useState } from "react";
import Card from "react-bootstrap/Card";
import reviewCardStyles from "./reviewCard.module.css";
import Rating from "components/Rating/Rating"

const ReviewCard = ({ avatarUrl, username, textbox, creator_id, index }) => {

    const [currentValue, setCurrentValue] = useState(" ");
    const ratinghover = false

  return (
    <Card className={reviewCardStyles.card + " mx-sm-3 my-3 py-4 rounded-3"}>
      <Card.Body className="row ">
        <div className="col-lg-3">
        <img
          src={avatarUrl || "/images/img_avatarDefault.jpg"}
          alt="Avatar"
          className={reviewCardStyles.avatar}
        />
        </div>
        <div className={`${reviewCardStyles.level} col-lg-6 `}>
            
            <div className="row-3 text-left">{username}</div>

            <div className="row-3 m-auto">
        <Rating
          index={index}
          setReviews={[currentValue, setCurrentValue]}
          ratingHover={ratinghover}
        />
      </div>
        </div>
      </Card.Body>

      <Card.Body className="d-flex justify-center">
        <div
          className="d-flex align-items-end"
          style={{ fontFamily: "Nunito"
        }}
        >
          <h5 className="m-0">{textbox}</h5>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ReviewCard;
